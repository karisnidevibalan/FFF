# 🎯 Resume App - Quick Reference Card

## 📋 Checklist - Before You Start

- [ ] MongoDB installed and running
- [ ] Backend installed (npm install done)
- [ ] Frontend installed (npm install done)
- [ ] .env file exists in `/backend` folder
- [ ] All 3 servers running in separate terminals

## 🚀 Start Servers (3 Terminal Windows)

### Terminal 1: MongoDB
```powershell
mongosh
```

### Terminal 2: Backend
```powershell
cd d:\resume\backend
npm run dev
```
**Expected:** `Server running on http://localhost:5000`

### Terminal 3: Frontend
```powershell
cd d:\resume\resumeapp
npm run dev
```
**Expected:** `VITE v5.4.21 ready in 1044 ms`

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8080 | Web app |
| Backend API | http://localhost:5000 | API requests |
| MongoDB | mongodb://localhost:27017 | Database |
| Compass | Connect to localhost:27017 | View database |

---

## 📝 Test Signup (Quick)

### Via Web Browser
1. Go to http://localhost:8080/signup
2. Fill form and submit

### Via PowerShell
```powershell
$body = @{
    name = "Test"
    email = "test@example.com"
    password = "pass123"
    confirmPassword = "pass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📚 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile/:id | Get profile |
| GET | /api/health | Check server |

---

## 🔧 Important Files

### Backend
- **server.js** - Main server
- **.env** - Configuration
- **models/User.js** - Database schema
- **routes/authRoutes.js** - API endpoints

### Frontend
- **Signup.tsx** - Registration page
- **Login.tsx** - Login page
- **authService.ts** - API calls
- **useAuth.tsx** - Auth hook

---

## 💾 Environment Variables

**Location:** `d:\resume\backend\.env`

```
MONGODB_URI=mongodb://localhost:27017/resume-app
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this
NODE_ENV=development
```

**⚠️ Change JWT_SECRET before production!**

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to MongoDB" | Run `mongosh` in first terminal |
| "Port 5000 already in use" | Kill process or change PORT |
| "CORS error" | Check backend is running |
| "Page not found" | Ensure frontend running on 8080 |
| "Signup fails silently" | Check browser console for errors |

---

## 🔗 Frontend Code Examples

### Use Auth Service
```typescript
import { authService } from '@/services/authService';

// Signup
await authService.signup({
  name: 'John',
  email: 'john@example.com',
  password: 'pass123',
  confirmPassword: 'pass123'
});

// Check if logged in
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
}

// Logout
authService.logout();
```

### Use Auth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

---

## 📊 MongoDB Compass

### Connect
1. Open MongoDB Compass
2. Connection: `mongodb://localhost:27017`
3. Click "Connect"

### View Data
- Database: `resume-app`
- Collection: `users`
- See all registered users here

### Example Query
```json
{ "email": "john@example.com" }
```

---

## 🔐 Security

✅ Passwords hashed with bcryptjs
✅ JWT tokens expire in 7 days
✅ Input validation on all fields
✅ Unique email constraint
✅ CORS enabled

---

## 📦 Dependencies

### Backend
- express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv

### Frontend
- react, vite, typescript, tailwindcss, react-router-dom

---

## 🎮 Page Routes

| URL | Page | Purpose |
|-----|------|---------|
| / | Index.tsx | Home page |
| /signup | Signup.tsx | Register |
| /login | Login.tsx | Login |
| /builder | Builder.tsx | Resume builder |
| /templates | Templates.tsx | Template gallery |

---

## 📱 LocalStorage Keys

After login, these are stored:
- **token** - JWT token (7-day expiration)
- **user** - User object {_id, name, email, phone, createdAt}

Access in code:
```typescript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
```

---

## ⚡ Common Commands

```powershell
# Backend
npm run dev      # Start with auto-reload
npm start        # Start without reload
npm install      # Install packages

# Frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build

# Database
mongosh          # Start MongoDB shell
```

---

## 🎯 Current Status

✅ Backend running: http://localhost:5000
✅ Frontend running: http://localhost:8080
✅ MongoDB running: localhost:27017
✅ Signup/Login working
✅ Token authentication ready

---

## 📞 Next Steps

1. Test signup at http://localhost:8080/signup
2. Check MongoDB Compass for user data
3. Test login at http://localhost:8080/login
4. Add resume upload feature (next phase)
5. Add template selection (next phase)

---

## 💡 Pro Tips

1. **DevTools**: Press F12 to view:
   - Network tab: See API calls
   - Application: See localStorage
   - Console: See errors

2. **MongoDB Compass**: Real-time database view
   - See documents instantly
   - Edit records manually
   - Run test queries

3. **API Testing**: Use PowerShell or Postman
   - Test endpoints independently
   - Debug response issues

4. **Restart All**: Ctrl+C in terminals and restart

---

**Everything is ready to use! 🚀**

Start with: **http://localhost:8080/signup**
