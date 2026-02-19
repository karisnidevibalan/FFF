# Resume App - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User's Browser                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Frontend (React + Vite)                    │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │         http://localhost:8080                   │   │ │
│  │  │  ┌──────────────┐  ┌──────────────┐            │   │ │
│  │  │  │ Signup Page  │  │ Login Page   │            │   │ │
│  │  │  └──────────────┘  └──────────────┘            │   │ │
│  │  │         ↕ (authService.ts)                      │   │ │
│  │  │  ┌──────────────────────────────┐              │   │ │
│  │  │  │  LocalStorage                │              │   │ │
│  │  │  │  - token (JWT)               │              │   │ │
│  │  │  │  - user (name, email, etc.)  │              │   │ │
│  │  │  └──────────────────────────────┘              │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTP Requests (JSON)
                     │ (Port 8080 → 5000)
                     ↓
┌────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         http://localhost:5000                            │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Router: /api/auth                                 │ │  │
│  │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │  │  │ POST /signup - Register new user             │  │ │  │
│  │  │  │ POST /login  - Authenticate user             │  │ │  │
│  │  │  │ GET /profile/:userId - Get user details      │  │ │  │
│  │  │  └──────────────────────────────────────────────┘  │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Middleware                                        │ │  │
│  │  │  - CORS (Cross-Origin Resource Sharing)           │ │  │
│  │  │  - JSON Parser                                     │ │  │
│  │  │  - Error Handling                                  │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│               ↕                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Security Layer                                          │  │
│  │  - bcryptjs: Password Hashing (10 salt rounds)          │  │
│  │  - JWT: Token Generation & Validation                   │  │
│  │  - Mongoose: Input Validation & Injection Prevention    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────────────┘
                 │ Database Queries
                 │ (Port 27017)
                 ↓
┌────────────────────────────────────────────────────────────────┐
│                MongoDB (Local Database)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: resume-app                                   │  │
│  │  Collection: users                                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Document Structure:                                │  │  │
│  │  │ {                                                  │  │  │
│  │  │   _id: ObjectId(),                                 │  │  │
│  │  │   name: "John Doe",           [indexed]            │  │  │
│  │  │   email: "john@example.com",  [unique index]       │  │  │
│  │  │   password: "$2a$10$hashed",  [hashed]             │  │  │
│  │  │   phone: "+1234567890",                            │  │  │
│  │  │   createdAt: ISODate()                             │  │  │
│  │  │ }                                                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Access via MongoDB Compass:                             │  │
│  │  - Connection: mongodb://localhost:27017                 │  │
│  │  - Visual Database Browser                               │  │
│  │  - Query & Document Editing                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER ACTION                                 │
│              Clicks "Sign Up" Button                             │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND                                       │
│  Form Validation (Client-side)                                  │
│  - Email format valid?                                          │
│  - Passwords match?                                             │
│  - All fields filled?                                           │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│            authService.signup() Called                           │
│  Sends POST request to backend                                  │
│  Body: {name, email, password, confirmPassword, phone}          │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
         HTTP POST → Backend (Port 5000)
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND                                    │
│            /api/auth/signup Handler                             │
│                                                                 │
│  1. Validate Input                                              │
│     - Check all required fields                                 │
│     - Validate email format                                     │
│     - Check password length (min 6)                             │
│                                                                 │
│  2. Database Check                                              │
│     - Query: Does user with this email exist?                   │
│     - If yes → Return 400 "Email already registered"            │
│                                                                 │
│  3. Hash Password                                               │
│     - bcryptjs.genSalt(10) → Generate random salt              │
│     - bcryptjs.hash(password, salt) → Hashed password          │
│     - Never store plain password!                               │
│                                                                 │
│  4. Create User                                                 │
│     - Mongoose User.create({name, email, hashedPassword, ...}) │
│     - Auto-generates _id (ObjectId)                             │
│     - Auto-sets createdAt timestamp                             │
│                                                                 │
│  5. Generate JWT Token                                          │
│     - jwt.sign({userId, email}, JWT_SECRET, {expiresIn: 7d})   │
│     - Token includes user info + expiration                     │
│                                                                 │
│  6. Return Response                                             │
│     - success: true                                             │
│     - token: "eyJhbGci..."                                      │
│     - user: {_id, name, email, phone, createdAt}               │
│                                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
         HTTP 201 ← Frontend (Port 8080)
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND                                       │
│           Handle Response (authService)                         │
│                                                                 │
│  1. Check Response Status                                       │
│     - 201/200 → Success                                         │
│     - 400/500 → Error                                           │
│                                                                 │
│  2. Store Token                                                 │
│     - localStorage.setItem('token', token)                      │
│     - Token will be sent with future requests                   │
│                                                                 │
│  3. Store User Data                                             │
│     - localStorage.setItem('user', JSON.stringify(user))        │
│     - Used for greeting message, profile display, etc.          │
│                                                                 │
│  4. Redirect User                                               │
│     - navigate('/') → Go to home page                           │
│     - User is now logged in!                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Visualization

```
┌─────────────────────────────────────────────┐
│         MongoDB: resume-app                 │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Collection: users                    │  │
│  │  (Created automatically on first      │  │
│  │   user signup)                        │  │
│  │                                       │  │
│  │  Documents (Rows):                    │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ Document 1:                     │  │  │
│  │  │ {                               │  │  │
│  │  │   _id: 67a1234567890abc...,    │  │  │
│  │  │   name: "John Doe",             │  │  │
│  │  │   email: "john@test.com",       │  │  │
│  │  │   password: "$2a$10$Xmw...",    │  │  │
│  │  │   phone: "+1234567890",         │  │  │
│  │  │   createdAt: 2026-01-20T...     │  │  │
│  │  │ }                               │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ Document 2:                     │  │  │
│  │  │ {                               │  │  │
│  │  │   _id: 67a2345678901bcd...,    │  │  │
│  │  │   name: "Jane Smith",           │  │  │
│  │  │   email: "jane@test.com",       │  │  │
│  │  │   password: "$2a$10$Ymx...",    │  │  │
│  │  │   phone: "+9876543210",         │  │  │
│  │  │   createdAt: 2026-01-20T...     │  │  │
│  │  │ }                               │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  │  Indexes:                             │  │
│  │  - _id (primary key)                 │  │
│  │  - email (unique) ← Prevents         │  │
│  │             duplicate signups         │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Accessed via:                              │
│  - MongoDB Shell: mongosh                  │
│  - GUI Tool: MongoDB Compass               │
│  - Backend: Mongoose ODM                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Request/Response Flow

```
SIGNUP REQUEST:
═════════════════════════════════════════

Frontend Browser                Backend
       │                           │
       ├──→ POST /api/auth/signup  │
       │    {                       │
       │      "name": "John",      │
       │      "email": "john@...", │
       │      "phone": "+123...",  │
       │      "password": "pass",  │
       │      "confirmPassword"    │
       │    }                       │
       │                           │
       │                      Process
       │                      Validate
       │                      Hash pwd
       │                      Save DB
       │                      Gen JWT
       │                           │
       │  ←─ 201 Created           │
       │    {                       │
       │      "success": true,     │
       │      "token": "jwt...",   │
       │      "user": {            │
       │        "_id": "...",      │
       │        "name": "John",    │
       │        "email": "john@"   │
       │      }                     │
       │    }                       │
       │                           │
     Store in                       
     LocalStorage                   
       │                           
     Redirect                       
     to Home                        

LOGIN REQUEST:
═════════════════════════════════════════

Frontend Browser                Backend
       │                           │
       ├──→ POST /api/auth/login   │
       │    {                       │
       │      "email": "john@...", │
       │      "password": "pass"   │
       │    }                       │
       │                           │
       │                      Find user
       │                      Hash check
       │                      Gen JWT
       │                           │
       │  ←─ 200 OK                │
       │    {                       │
       │      "success": true,     │
       │      "token": "jwt...",   │
       │      "user": {...}        │
       │    }                       │
       │                           │
     Store Token                   
     in LocalStorage               
       │                           
     Redirect                       
     to Home                        
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18.3.1        - UI Library                    │  │
│  │  Vite 5.4.19         - Build Tool                    │  │
│  │  TypeScript 5.8.3    - Type Safety                   │  │
│  │  React Router 6.30   - Navigation                    │  │
│  │  TailwindCSS 3.4.17  - Styling                       │  │
│  │  Shadcn/ui           - Component Library             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  authService.ts                                      │  │
│  │  - Handles all API calls                             │  │
│  │  - Manages localStorage                              │  │
│  │  - Token management                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
         HTTP (JSON over CORS)
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express 4.18.2      - Web Framework                 │  │
│  │  Node.js             - Runtime                       │  │
│  │  Mongoose 7.0        - MongoDB ODM                   │  │
│  │  bcryptjs 2.4.3      - Password Hashing             │  │
│  │  jsonwebtoken 9.0    - JWT Tokens                    │  │
│  │  CORS 2.8.5          - Cross-Origin Support         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Logic                                │  │
│  │  - Input validation                                  │  │
│  │  - Password hashing & verification                  │  │
│  │  - JWT generation & validation                      │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
         MongoDB Protocol (Port 27017)
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB 5.0+        - NoSQL Database                │  │
│  │  Mongoose Schema     - Data Validation               │  │
│  │  Indexes             - Query Performance             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## JWT Token Structure

```
JWT Token Format:
═════════════════════════════════════════

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2N2ExMjM0NTY3ODkwYWJjIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjc2ODAzMjAwLCJleHAiOjE2NzY4MDMyMDB9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Split into 3 parts:
┌──────────────┬──────────────────────────────┬───────────┐
│   Header     │        Payload               │ Signature │
├──────────────┼──────────────────────────────┼───────────┤
│              │                              │           │
│ {            │  {                           │ Signed    │
│   "alg":     │    "userId": "67a12345...",  │ with JWT  │
│   "typ":     │    "email": "john@...",      │ Secret    │
│   "JWT"      │    "iat": 1676803200,        │           │
│ }            │    "exp": 1676803200         │           │
│              │  }                           │           │
│ (Base64)     │  (Base64)                    │           │
│              │                              │           │
└──────────────┴──────────────────────────────┴───────────┘

Token Lifespan: 7 days
After 7 days: User must login again
Verified: Backend checks signature & expiry
```

---

## Data Flow - Complete Example

```
User Types:  john@example.com / password123
                    ↓
         ┌─────────────────────┐
         │  Form Validation    │
         │  (Frontend)         │
         └─────────────────────┘
                    ↓
    Sends authService.signup()
                    ↓
    POST http://localhost:5000/api/auth/signup
    Body: {name, email, password, ...}
                    ↓
         ┌─────────────────────┐
         │  Backend Validates  │
         │  Input              │
         └─────────────────────┘
                    ↓
    Query MongoDB:  "Is john@example.com taken?"
                    ↓
                 No → Continue
                    ↓
    Hash password: "password123" → "$2a$10$..."
                    ↓
    Save to MongoDB:
    db.users.insertOne({
      name: "John",
      email: "john@example.com",
      password: "$2a$10$...",
      phone: "+123...",
      createdAt: new Date()
    })
                    ↓
    Generate JWT:  jwt.sign(
                     {userId: "67a123...", email: "john@..."},
                     SECRET,
                     {expiresIn: '7d'}
                   )
                    ↓
    Return 201:
    {
      success: true,
      token: "eyJhbGc...",
      user: {_id, name, email, phone, createdAt}
    }
                    ↓
    Frontend receives response
                    ↓
    localStorage.setItem('token', token)
    localStorage.setItem('user', user)
                    ↓
    User logged in! ✓
                    ↓
    Redirect to home page
```

---

## Security Flow

```
PASSWORD SECURITY:
═════════════════════════════════════════

User Password      Plain text password
     ↓              (never stored)
     │                    ↓
     └────→ bcryptjs.hash()
                    ↓
            Generate Salt (10 rounds)
                    ↓
            Hash password with salt
                    ↓
            $2a$10$... (hashed)
                    ↓
            Store in MongoDB
                    ↓
        CANNOT reverse-engineer
        password from hash!


JWT SECURITY:
═════════════════════════════════════════

User Credentials
     ↓
Login verified
     ↓
Create token with:
  - User ID
  - Email
  - Expiration (7 days)
     ↓
Sign with SECRET_KEY
  (only backend knows)
     ↓
Send to Frontend
     ↓
Frontend stores in localStorage
     ↓
On future requests:
  Include token in header
     ↓
Backend verifies signature
  (still matches SECRET_KEY?)
     ↓
Check expiration
  (not older than 7 days?)
     ↓
If valid: Process request ✓
If invalid: Return 401 Unauthorized ✗
```

---

## Ports Used

```
Frontend:   8080  (http://localhost:8080)
Backend:    5000  (http://localhost:5000)
MongoDB:   27017  (mongodb://localhost:27017)

Communication:
Frontend (8080) ──→ Backend (5000) ──→ MongoDB (27017)
```

---

This architecture provides a secure, scalable foundation for your Resume App!
