# Frota Sapiens - Fleet Management System

This project is a full-stack web application for managing vehicle fleet expenses. It is built with Node.js, Express, Prisma, and SQLite on the backend, and React with Vite and TypeScript on the frontend. The entire application is containerized with Docker for easy setup and deployment.

## Executing with Docker

To run the application, you will need to have Docker and Docker Compose installed on your machine. Once you have cloned the repository, you can start the application with the following command:

```bash
docker compose up --build -d
```

This command will build the Docker images for the frontend and backend services, and then start them in detached mode.

## Test Credentials

The database is populated with sample data, including two users with different roles. You can use the following credentials to log in and test the application:

*   **Admin User**
    *   **Email:** `admin@test.com`
    *   **Password:** `password`
*   **Standard User**
    *   **Email:** `user@test.com`
    *   **Password:** `password`

## Sample Data

The database is seeded with sample data to facilitate initial testing. This includes:

*   An admin user and a standard user
*   Two vehicles
*   Sample data for freights, supplies, maintenance, and expenses

## API Proxy Configuration

The frontend application uses a proxy to redirect API requests to the backend service. This is handled differently in development and production environments:

*   **Development:** The Vite development server is configured with a `server.proxy` in the `vite.config.ts` file. This redirects all requests to `/api` to the backend service running at `http://backend:5000`.
*   **Production:** The production Docker image for the frontend uses a custom Nginx configuration to act as a reverse proxy. The `nginx.conf` file is configured to proxy all requests to `/api/` to the backend service.
