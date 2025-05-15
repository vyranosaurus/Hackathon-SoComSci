# Railway Dockerfile for monorepo (builds both frontend and backend)

# Build frontend from root
FROM node:20-alpine as frontend-build
WORKDIR /app
# Set Node options for OpenSSL legacy provider
ENV NODE_OPTIONS="--openssl-legacy-provider"
COPY package.json package-lock.json ./
RUN npm install
COPY public ./public
COPY src ./src
COPY *.js ./
COPY *.json ./
RUN npm run build

# Build backend
FROM maven:3.9-eclipse-temurin-17 as backend-build
WORKDIR /app
COPY backend/pom.xml ./
COPY backend/src ./src
# Copy all necessary resource files
RUN mkdir -p src/main/resources/
COPY backend/src/main/resources/application.properties src/main/resources/
COPY backend/src/main/resources/data.sql src/main/resources/
# We don't need schema.sql - Spring Boot can generate the schema
RUN mvn clean package -DskipTests

# Final image with both
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Set Spring profile to railway and all necessary env variables
ENV SPRING_PROFILES_ACTIVE=railway
# Pass through Railway's auto-provided PostgreSQL variables
ENV PGHOST=${PGHOST}
ENV PGPORT=${PGPORT}
ENV PGDATABASE=${PGDATABASE}
ENV PGUSER=${PGUSER}
ENV PGPASSWORD=${PGPASSWORD}

# DON'T set datasource URL explicitly - let Spring Boot use Railway's variables
# We'll rely on application-railway.properties instead

# CRITICAL DATABASE INITIALIZATION SETTINGS
# First drop and recreate schema (instead of update)
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=create-drop
# Always run SQL initialization scripts on startup
ENV SPRING_SQL_INIT_MODE=always
# Ensure SQL scripts run after Hibernate schema generation
ENV SPRING_JPA_DEFER_DATASOURCE_INITIALIZATION=true
# Continue if minor errors in SQL scripts
ENV SPRING_SQL_INIT_CONTINUE_ON_ERROR=true
# Show SQL in logs
ENV SPRING_JPA_SHOW_SQL=true

# Database platform
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect

# Enhanced debugging
ENV LOGGING_LEVEL_ROOT=WARN
ENV LOGGING_LEVEL_ORG_SPRINGFRAMEWORK=INFO
ENV LOGGING_LEVEL_COM_HACKATHON_SOCOMSCI=DEBUG
ENV LOGGING_LEVEL_ORG_HIBERNATE=INFO
ENV LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=DEBUG
ENV LOGGING_LEVEL_COM_ZAXXER_HIKARI=DEBUG
ENV LOGGING_LEVEL_ORG_HIBERNATE_SQL=DEBUG
ENV LOGGING_LEVEL_ORG_HIBERNATE_TYPE_DESCRIPTOR_SQL=TRACE

# Copy backend jar
COPY --from=backend-build /app/target/*.jar app.jar
# Copy frontend build
COPY --from=frontend-build /app/build /app/public

# Install nginx to serve frontend
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Start script
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Expose ports for both services
EXPOSE 8080 80

# Start both services
CMD ["/app/start.sh"]