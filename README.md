# SoComSci Hackathon Project

This is a full-stack application built with React, Spring Boot, and PostgreSQL for the SoComSci Hackathon.
roor
## Project Structure

- `/backend` - Spring Boot backend
- `/src` - React frontend

## Tech Stack

### Frontend
- React 19.1
- React Router 7.5
- Tailwind CSS 4.1

### Backend
- Spring Boot 3.2.4
- Spring Data JPA
- PostgreSQL

### Tools
- pgAdmin 4 (PostgreSQL management)
- Maven (Java build tool)
- npm (JavaScript package manager)

## Setup and Running

### Prerequisites
- Node.js and npm
- Java 17+
- Maven
- PostgreSQL
- pgAdmin 4

### Database Setup
1. Install PostgreSQL and pgAdmin 4
2. Open pgAdmin 4 and create a new database named `patientqueue`
3. Default credentials are set in `backend/src/main/resources/application.properties`

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Run the Spring Boot application: `mvn spring-boot:run`
3. The backend server will start on port 8080

### Frontend Setup
1. From the project root, install dependencies: `npm install`
2. Start the React development server: `npm start`
3. The frontend will be available at `http://localhost:3000`
