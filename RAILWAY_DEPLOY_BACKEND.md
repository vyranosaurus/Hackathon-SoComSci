# Railway Deployment Instructions (Backend)

## Backend Deployment with PostgreSQL

### 1. Setting Up PostgreSQL on Railway

1. In your Railway project, click "New" and select "PostgreSQL" from the database options.
2. Once created, Railway will provision a PostgreSQL database with credentials.
3. Click on the PostgreSQL service to view connection details.
4. Note the following variables (you'll need them for your backend service):
   - `DATABASE_URL` (format: jdbc:postgresql://hostname:port/database_name)
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`

### 2. Deploying the Spring Boot Backend

1. In your Railway project, click "New" and select "Deployment" or "Empty Service".
2. Connect your GitHub repo or upload the code.
3. Set the deployment root directory to the `backend` folder.
4. Railway will auto-detect the Dockerfile and build the Spring Boot application.
5. Add the following environment variables:
   
   ```
   SPRING_PROFILES_ACTIVE=railway
   DATABASE_URL=jdbc:postgresql://<railway-postgres-hostname>:<port>/<database-name>
   DATABASE_USERNAME=<postgres-username>
   DATABASE_PASSWORD=<postgres-password>
   FRONTEND_URL=<your-frontend-url>
   GEMINI_API_KEY=<your-gemini-api-key>
   ```
   
   Note: You can copy the PostgreSQL connection details directly from the Railway PostgreSQL service.

6. For `FRONTEND_URL`, use the URL of your deployed frontend service.

### 3. Connecting Frontend and Backend

1. Update your frontend service with an environment variable that points to your backend:
   ```
   REACT_APP_API_URL=<your-backend-url>
   ```

2. Make sure your backend's CORS configuration in `application-railway.properties` includes the frontend URL.

### 4. First-time Database Setup

The application is configured to create tables automatically (`spring.jpa.hibernate.ddl-auto=update`), but you may need to:

1. For initial data, connect to the PostgreSQL database and run any necessary SQL scripts.
2. Alternatively, enable `spring.sql.init.mode=always` if you want to use your data.sql and schema.sql files on first deployment.

### 5. Monitoring and Troubleshooting

1. Use Railway's logs to monitor your application.
2. If you encounter issues, check:
   - Connection strings are correct
   - Environment variables are properly set
   - The backend can reach the database
   - CORS is properly configured

---
*You can edit this file to add more details for your team later!*
