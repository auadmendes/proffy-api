# Proffy API

## Overview

This API serves as the backend for the Proffy web and mobile applications, providing endpoints for user management, class scheduling, and connection tracking. The API is built using Fastify, with a TypeScript-based stack that includes Prisma for database management and Zod for schema validation.

## Features

- **User Management**: Create, retrieve, and manage users, including handling their social profiles and contact information.
- **Class Scheduling**: Define and manage classes, including availability slots and costs.
- **Connection Tracking**: Record and count connections between users and classes.

## Technologies

- **Fastify**: High-performance web framework used for building the API.
- **TypeScript**: Strongly typed JavaScript for better development experience and safety.
- **Prisma**: Modern ORM for interacting with the SQL database.
- **Zod**: Type-safe schema validation and parsing for input validation.
- **Swagger**: API documentation is provided through Swagger and accessible at `/docs`.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/proffy-api.git
    cd proffy-api
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up the environment:
    Create a `.env` file based on `.env.example` and configure your database connection.
4. Run the development server:
    ```bash
    npm run dev
    ```

The API will be available at `http://localhost:4444`.

## API Endpoints

### User Management

- **Create User**: `POST /create-user`
- **Get User by ID**: `GET /users/:id`
- **User Login**: `POST /get-user`

### Class Management

- **Create Class**: `POST /users/:id/classes`
- **Get All Classes**: `GET /classes`

### Availability Management

- **Create Availability**: `POST /availability`
- **Get Availability**: `GET /availability`

### Connection Management

- **Create Connection**: `POST /connections`
- **Get Connection Count**: `GET /connections/count`

## Database Schema

The database schema is managed using Prisma ORM. Below are the key models:

- **User**: Represents users, including their personal information and social links.
- **Class**: Represents classes that users can teach or attend.
- **Availability**: Represents time slots during which users are available for classes.
- **Connection**: Tracks the connections between users and classes.

## Documentation

API documentation is available at `http://localhost:4444/docs` once the server is running. It provides detailed information about all available endpoints and their request/response formats.
