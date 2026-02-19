# Resume App - Full Stack Setup Guide

## Project Structure

```
resume/
├── resumeapp/          # Frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Login.tsx        # Login page
│       │   ├── Signup.tsx       # Signup page
│       │   └── ...
│       └── services/
│           └── authService.ts   # API communication
└── backend/            # Backend (Express + MongoDB)
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── authRoutes.js
    ├── db/
    │   └── connect.js
    ├── server.js
    └── .env
```

## Quick Start

### 1. MongoDB Setup

**Windows:**
- Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
- Follow installation wizard (default settings are fine)
- MongoDB runs as a service automatically

**Verify MongoDB is running:**
```powershell
mongo  # or mongosh for newer versions
```

**MongoDB Compass (GUI):**
- Download: https://www.mongodb.com/products/compass
- Open and connect to `mongodb://localhost:27017`
- You'll see the database structure visually

### 2. Backend Setup

```powershell
# Navigate to backend
cd d:\resume\backend

# Install dependencies (already done)
npm install

# Start server (should already be running)
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### 3. Frontend Setup

```powershell
# In another terminal
cd d:\resume\resumeapp

# Start frontend (should already be running)
npm run dev
```

**Access at:** `http://localhost:8080`

## API Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

## Frontend Features Added

### 1. Login Page (`/login`)
- Email and password input
- Error handling
- Redirect to home on success
- Link to signup page

### 2. Signup Page (`/signup`)
- Full name, email, phone inputs
- Password and confirm password
- Client-side validation
- Success message and redirect
- Link to login page

### 3. Authentication Service
- Handles all API calls
- Stores JWT token in localStorage
- Stores user data in localStorage
- Auto-includes token in API requests
- Helper methods: `isAuthenticated()`, `getCurrentUser()`, `logout()`

## Common Issues & Solutions

### Issue: "MongoDB Connected: mongodb://localhost"
**Solution:** MongoDB is not running
- Windows: Restart MongoDB service from Services
- Mac: `brew services restart mongodb-community`
- Linux: `sudo systemctl restart mongod`

### Issue: "Port 5000 already in use"
**Solution:** 
- Kill process: `lsof -i :5000` then `kill -9 <PID>`
- Or change PORT in .env

### Issue: CORS error in console
**Solution:** Already handled! Backend has CORS enabled for all origins

### Issue: "Token not found" after signup
**Solution:** 
- Check MongoDB is running
- Check .env JWT_SECRET is set
- Check browser console for actual error

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/resume-app
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this
NODE_ENV=development
```

### Frontend (uses API_BASE_URL in authService.ts)
```
const API_BASE_URL = 'http://localhost:5000/api';
```

## Database Structure

### Users Collection
Fields:
- `_id`: MongoDB ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `phone`: String (optional)
- `createdAt`: Date (auto-generated)

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 8080
3. ✅ MongoDB connected
4. ✅ User signup API working
5. ✅ User login API working
6. ✅ Frontend signup/login pages created

## Testing Workflow

1. Open MongoDB Compass
2. Connect to localhost:27017
3. Open frontend at http://localhost:8080
4. Navigate to /signup
5. Fill form and submit
6. Check MongoDB Compass - new user appears in resume-app > users collection
7. Test login at /login
8. Check localStorage in browser DevTools (F12) for token and user data

## Useful Commands

```powershell
# Backend
npm run dev      # Development with nodemon
npm start        # Production mode
npm install      # Install dependencies

# Frontend
npm run dev      # Development with Vite
npm run build    # Build for production
npm run preview  # Preview production build
```

## Security Notes

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens expire in 7 days
- ✅ CORS is enabled (configure in production)
- ✅ Input validation on all endpoints
- ✅ Environment variables for secrets

## MongoDB Compass Tips

1. **View Users Collection:**
   - Connect to localhost:27017
   - Expand "resume-app" database
   - Click "users" collection
   - See all registered users

2. **Filter Users:**
   - Click "Filter" button
   - Example: `{ "email": "john@example.com" }`

3. **View User Password Hash:**
   - Click on a user document
   - See bcryptjs hashed password

## API Response Examples

### Successful Signup
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67a12345...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-01-20T..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Support

For issues or questions:
1. Check MongoDB is running
2. Check both servers are running on correct ports
3. Check .env file has all variables
4. Check browser console and terminal for error messages
5. Verify network tab in DevTools shows API calls

---

**Ready to go!** 🚀 Your backend is set up and running with user authentication!
