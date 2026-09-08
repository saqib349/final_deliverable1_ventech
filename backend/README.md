# Todo Application — Backend

The backend API for a full-stack Todo application built with Node.js and Express. It provides authentication, authorization, user management, and Todo CRUD operations.

## Features

* User Signup and Login
* Password hashing
* JWT authentication
* HttpOnly cookie-based authentication
* Authentication middleware
* Role-based authorization
* Admin authorization middleware
* User management
* Todo CRUD operations
* User-specific Todo access
* MongoDB database integration
* Mongoose ODM

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt
* cookie-parser

## Project Structure

```text
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── util/
├── index.js
├── package.json
├── .env
└── .env.example
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

Never commit the `.env` file to GitHub.

### Run Development Server

```bash
npm run dev
```

## Authentication Flow

```text
Login Request
     ↓
Verify Email & Password
     ↓
Create JWT
     ↓
Store JWT in HttpOnly Cookie
     ↓
Authentication Middleware
     ↓
Verify JWT
     ↓
req.user
```

## Authorization Flow

The application supports two roles:

```text
             Authenticated User
                    │
              ┌─────┴─────┐
              ↓           ↓
            admin        user
              ↓           ↓
        Admin Dashboard  User Dashboard
```

Admin-only routes are protected using authorization middleware.

## Todo Authorization

Each Todo belongs to a specific user.

```text
User
 │
 └── userId
       │
       ├── Todo 1
       ├── Todo 2
       └── Todo 3
```

Users can only access and modify their own Todos.

## API Overview

### Authentication

```text
POST /user/signup
POST /user/login
GET  /auth/me
POST /auth/logout
```

### Todos

```text
GET    /todos
POST   /todos
PATCH  /todos/:id
DELETE /todos/:id
```

### Admin

Admin-specific routes require both authentication and admin authorization.

## Security

* Passwords are hashed before being stored.
* JWT is stored in an HttpOnly cookie.
* Protected routes require a valid JWT.
* Admin routes require the `admin` role.
* Users can only access their own Todo data.
* Sensitive environment variables are stored in `.env`.

## Frontend

The Angular frontend is maintained in a separate repository.

Frontend repository:

`<your-frontend-repository-url>`

## Future Improvements

* Refresh token implementation
* Better validation
* Pagination
* Advanced error handling
* Admin statistics
* API documentation
* Production deployment
