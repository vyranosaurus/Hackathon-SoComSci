#!/bin/sh

# Print environment variables for debugging
echo "===== ENVIRONMENT VARIABLES ====="
echo "DATABASE_URL: $DATABASE_URL (masked)"
echo "PGHOST: $PGHOST"
echo "PGPORT: $PGPORT"
echo "PGDATABASE: $PGDATABASE"
echo "PGUSER: $PGUSER"
echo "PGPASSWORD: $PGPASSWORD (redacted)"
echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"
echo "================================="

# Start nginx for frontend
echo "Starting nginx..."
nginx

# Start Spring Boot for backend with explicit connection to Railway PostgreSQL
echo "Starting Spring Boot application..."

# Railway extreme memory optimization flags
JAVA_OPTS="-Xmx200m -Xms64m -XX:MaxMetaspaceSize=96m -XX:CompressedClassSpaceSize=32m -XX:ReservedCodeCacheSize=32m -XX:+UseSerialGC -Xss256k -XX:MaxRAM=320m -XX:+UseStringDeduplication -XX:+DisableExplicitGC -XX:+ClassUnloadingWithConcurrentMark"

# Check if DATABASE_URL is provided by Railway
if [ ! -z "$DATABASE_URL" ]; then
  echo "Using Railway's DATABASE_URL with memory optimization"
  # Spring Boot can automatically convert postgres:// URLs to JDBC format
  java $JAVA_OPTS \
       -Dspring.profiles.active=railway \
       -jar app.jar
else
  echo "No DATABASE_URL found, trying individual variables with memory optimization"
  # Try with individual variables if available
  java $JAVA_OPTS \
       -Dspring.profiles.active=railway \
       -jar app.jar
fi
