# Railway Monorepo Deployment Instructions

## Overview
This guide walks you through deploying your entire stack (frontend + backend + database) to Railway as a single service using a monorepo approach.

## 1. Setting Up Railway Project

1. Go to https://railway.app and sign in
2. Create a new project
3. Add a PostgreSQL database:
   - Click "New" → Select "PostgreSQL"
   - Railway will provision a database and generate credentials

## 2. Deploying Your Monorepo

1. In your Railway project, click "New" → Select "GitHub Repo" or "Deploy from GitHub"
2. Connect your GitHub repository
3. In the deployment settings:
   - Root Directory: `/` (project root where Dockerfile is located)
   - Service Name: `socomsci-app` (or any name you prefer)

## 3. Environment Variables

Add these environment variables to your service:

```
DATABASE_URL=postgresql://postgres:password@containers-us-west-XXX.railway.app:5432/railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password-here
SPRING_PROFILES_ACTIVE=railway
FRONTEND_URL=https://your-app-name.up.railway.app
GEMINI_API_KEY=your-gemini-api-key-if-needed
```

Note: Replace the DATABASE_URL, USERNAME and PASSWORD with the values from your PostgreSQL service. You can copy these directly from the PostgreSQL service in Railway.

## 4. Domains and Ports

- Railway will expose your application on port 80 for the frontend
- The backend API will be available at `/api` on the same domain
- Configure a domain in Railway settings if needed

## 5. Monitoring Deployment

1. Railway will automatically build and deploy your application
2. You can monitor the build logs in the Railway dashboard
3. Once deployed, your frontend will be accessible at: 
   `https://your-app-name.up.railway.app`
4. Your backend API will be accessible at:
   `https://your-app-name.up.railway.app/api`

## 6. Local Testing Before Deployment

To test locally before deploying:

```bash
# Install Railway CLI
powershell -c "iwr https://raw.githubusercontent.com/railwayapp/cli/master/install.ps1 -useb | iex"

# Login and link your project
railway login
railway link

# Run locally
railway run
```

## 7. Troubleshooting

- **Build Failures**: Check the Dockerfile is correctly configured for your project structure
- **Runtime Errors**: Check logs in Railway dashboard
- **Database Connection Issues**: Verify environment variables are correctly set
- **CORS Issues**: Make sure the CORS configuration in Spring Boot accepts your frontend URL

---
*You can edit this file to add more details for your team later!*
