# Task Manager REST API Implementation Guide

## Overview

This document details the complete implementation of the Task Manager REST API with JWT authentication and MongoDB integration.

## ✅ Completed Implementations

### 1. Models

#### User Model (`src/models/User.js`)
- **Fields:**
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, minlength 6)
  - `createdAt` (Date, default: Date.now)

#### Task Model (`src/models/Task.js`)
- **Fields:**
  - `title` (String, required)
  - `description` (String, optional)
  - `completed` (Boolean, default: false)
  - `owner` (ObjectId ref User, required)
  - `createdAt` (Date, default: Date.now)

### 2. Authentication Middleware (`src/middleware/authMiddleware.js`)

The middleware implements the following flow:
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies JWT signature using `JWT_SECRET`
3. Retrieves the user from the database
4. Attaches user to `req.user` for route handlers
5. Returns 401 if token is invalid or missing

### 3. Authentication Routes (`src/routes/authRoutes.js`)

#### POST `/api/auth/register`
- Validates input (name, email, password)
- Checks for duplicate email
- Hashes password using bcryptjs
- Saves user to database
- Returns user data (without password) with 201 status

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-03-05T..."
}
```

#### POST `/api/auth/login`
- Validates credentials
- Compares password with hashed password
- Generates JWT token
- Returns token and user info with 200 status

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Protected Task Routes (`src/routes/taskRoutes.js`)

All routes require authentication with `Authorization: Bearer <token>` header.

#### POST `/api/tasks`
- Creates a new task for the authenticated user
- Sets owner to `req.user._id`
- Returns created task with 201 status

**Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "owner": "...",
  "createdAt": "2026-03-05T..."
}
```

#### GET `/api/tasks`
- Returns all tasks for the authenticated user
- Filters by `owner === req.user._id`
- Returns array of tasks with 200 status

**Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false,
    "owner": "...",
    "createdAt": "2026-03-05T..."
  }
]
```

#### DELETE `/api/tasks/:id`
- Finds task by ID
- Verifies user is the owner
- Deletes task if authorized
- Returns 403 if unauthorized
- Returns 404 if task not found

**Response (200):**
```json
{
  "message": "Task deleted"
}
```

### 5. Application Setup (`src/app.js`)
- Express app configuration
- JSON middleware
- Route mounting
- Proper error handling

### 6. Database Configuration (`src/config/db.js`)
- MongoDB connection setup
- Error handling with graceful exit
- Connection confirmation logging

### 7. Server Entry Point (`server.js`)
- Loads environment variables
- Connects to MongoDB
- Starts HTTP server on configured port
- Proper error handling

## 🚀 Running the Application

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas URI)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Edit PORT, MONGO_URI, and JWT_SECRET
```

### Configuration

**.env file:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_min_32_chars
```

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## 🧪 Running Tests

Tests are set up with Jest and Supertest. They test:
- User registration
- User login and token generation
- Protected task routes
- Authorization enforcement

### Running Tests

```bash
npm test
```

**Note:** Tests require a MongoDB instance. If you don't have MongoDB installed locally, you can:
1. Use MongoDB Atlas (cloud): Update `MONGO_URI` in `.env`
2. Use Docker: `docker run -d -p 27017:27017 mongo`
3. Install MongoDB locally

### Test Coverage

- ✅ User registration with unique email validation
- ✅ User login with password verification
- ✅ JWT token generation
- ✅ Protected routes require authentication
- ✅ Tasks belong only to their creator
- ✅ Unauthorized access is blocked

## 📁 Project Structure

```
src/
├── app.js              # Express app setup
├── config/
│   └── db.js          # MongoDB connection
├── middleware/
│   └── authMiddleware.js  # JWT authentication
├── models/
│   ├── User.js        # User schema
│   └── Task.js        # Task schema
└── routes/
    ├── authRoutes.js  # Auth endpoints
    └── taskRoutes.js  # Task endpoints

tests/
├── setup.js           # Test configuration
├── auth.test.js       # Auth route tests
└── tasks.test.js      # Task route tests

server.js             # Server entry point
.env                  # Environment variables (don't commit)
.env.example          # Example env file
.gitignore            # Git ignore rules
package.json          # Dependencies
jest.config.js        # Jest configuration
```

## 🔐 Security Features

1. **Password Hashing:**
   - Passwords are hashed using bcryptjs before storage
   - Plain text passwords are never stored in the database

2. **JWT Authentication:**
   - Tokens are signed with a secret key
   - Token verification is enforced on protected routes
   - Tokens include user ID for identification

3. **Document Ownership:**
   - Users can only access/modify their own tasks
   - Ownership checks prevent unauthorized access

4. **Input Validation:**
   - Email uniqueness is enforced at database level
   - Password minimum length requirement
   - Required fields validation

## 📝 API Summary

| Method | Endpoint            | Auth | Description                    |
|--------|---------------------|------|--------------------------------|
| POST   | /api/auth/register  | No   | Register new user              |
| POST   | /api/auth/login     | No   | Login and get JWT token        |
| POST   | /api/tasks          | Yes  | Create new task                |
| GET    | /api/tasks          | Yes  | Get user's tasks               |
| DELETE | /api/tasks/:id      | Yes  | Delete task (owner only)       |

## 🐛 Error Handling

All routes return appropriate HTTP status codes:
- **201 Created:** Successful resource creation
- **200 OK:** Successful GET/DELETE operations
- **400 Bad Request:** Invalid input or missing fields
- **401 Unauthorized:** Missing or invalid token
- **403 Forbidden:** Insufficient permissions (not task owner)
- **404 Not Found:** Resource not found
- **500 Server Error:** Database or server issues

## 📚 Example Usage

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"My Task","description":"Task details"}'
```

### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TOKEN>"
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/<TASK_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

## ✨ Features Implemented

- ✅ ES Modules (import/export)
- ✅ Mongoose for database modeling
- ✅ Authentication middleware
- ✅ JWT token generation and verification
- ✅ Password hashing with bcryptjs
- ✅ Proper HTTP status codes
- ✅ Clean project structure
- ✅ Input validation
- ✅ Error handling
- ✅ Protected routes
- ✅ Document ownership checks
- ✅ Comprehensive test suite

## 🚨 Important Notes

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT_SECRET** - Minimum 32 characters recommended
3. **Keep MongoDB credentials secure** - Use environment variables
4. **Test before submitting** - Run `npm test` to verify all tests pass
5. **Check git status** - Make sure sensitive files aren't staged

---

**Implementation Date:** March 5, 2026
**Status:** ✅ Complete and Ready for Testing
