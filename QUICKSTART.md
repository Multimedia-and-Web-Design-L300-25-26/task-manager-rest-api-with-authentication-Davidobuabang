# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Environment

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-jwt-key-minimum-32-characters
```

## 3. Start MongoDB

### Option A: Local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update MONGO_URI in .env

### Option C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 4. Run Development Server
```bash
npm run dev
```

The server will start on http://localhost:5000

## 5. Run Tests
```bash
npm test
```

Expected output:
- ✅ Auth registration test
- ✅ Auth login test  
- ✅ Task creation test
- ✅ Protected route test
- ✅ Task retrieval test

## 6. Test the API

### Using cURL:

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

#### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

#### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify MongoDB is accessible on the specified port

### Test Failures
- Make sure MongoDB is running
- Check that .env file has valid configuration
- Review test output for specific error messages

### Port Already in Use
- Change PORT in .env
- Or kill the process using the port:
  ```bash
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## Project Structure

```
├── src/
│   ├── app.js                    # Express app
│   ├── server.js                 # Entry point
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT middleware
│   └── routes/
│       ├── authRoutes.js         # Auth endpoints
│       └── taskRoutes.js         # Task endpoints
├── tests/
│   ├── setup.js                  # Test setup
│   ├── auth.test.js              # Auth tests
│   └── tasks.test.js             # Task tests
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── .gitignore                    # Git ignore
├── package.json                  # Dependencies
└── IMPLEMENTATION.md             # Detailed documentation
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure .env
3. ✅ Start MongoDB
4. ✅ Run `npm run dev` to start server
5. ✅ Run `npm test` to verify tests pass
6. ✅ Make a git commit
7. ✅ Push to GitHub Classroom

For detailed API documentation, see [IMPLEMENTATION.md](./IMPLEMENTATION.md)
