# Resume App Backend

This is the backend API for the Resume App built with Express.js and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally, or MongoDB Compass connected to a remote instance)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/resume-app
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this
NODE_ENV=development
```

## MongoDB Setup with Compass

1. **Install MongoDB Community Edition** (if not already installed):
   - Download from https://www.mongodb.com/try/download/community
   - Follow the installation guide for your OS

2. **Start MongoDB Server**:
   - **Windows**: MongoDB starts automatically after installation
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Open MongoDB Compass**:
   - Download from https://www.mongodb.com/products/compass
   - Open the application
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

4. **View Your Database**:
   - In Compass, you'll see `resume-app` database
   - Click it to view collections
   - The `users` collection will be created automatically when the first user signs up

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Signup
- **POST** `/api/auth/signup`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-01-20T..."
  }
}
```

#### 2. Login
- **POST** `/api/auth/login`
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: Same as signup response

#### 3. Get User Profile
- **GET** `/api/auth/profile/:userId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "user": { /* user object */ }
}
```

#### 4. Health Check
- **GET** `/api/health`
- **Response**:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, min 2 chars),
  email: String (required, unique, valid email format),
  password: String (required, hashed with bcryptjs),
  phone: String (optional),
  createdAt: Date (default: current timestamp)
}
```

## Security Features

- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ JWT token authentication (expires in 7 days)
- ✅ Email validation
- ✅ CORS enabled for frontend communication
- ✅ MongoDB injection protection through Mongoose
- ✅ Input validation on all endpoints

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common errors:
- 400: Bad request (missing fields, validation failed)
- 400: Email already registered
- 400: Invalid credentials (login)
- 404: User not found
- 500: Server error

## Frontend Integration

Use the `authService` from `src/services/authService.ts`:

```typescript
import { authService } from '@/services/authService';

// Signup
const response = await authService.signup({
  name: 'John',
  email: 'john@example.com',
  phone: '+1234567890',
  password: 'password123',
  confirmPassword: 'password123'
});

// Login
const response = await authService.login('john@example.com', 'password123');

// Get current user
const user = authService.getCurrentUser();

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout
authService.logout();
```

## Troubleshooting

### "MongoDB Connection Error"
- Ensure MongoDB server is running
- Check MONGODB_URI in .env file
- Verify connection string is correct

### "Port already in use"
- Change PORT in .env file
- Or kill the process using port 5000

### "JWT_SECRET not found"
- Ensure .env file exists in backend directory
- Add JWT_SECRET variable

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/resume-app |
| PORT | Server port | 5000 |
| JWT_SECRET | JWT signing secret | (required) |
| NODE_ENV | Environment mode | development |

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **validator**: Input validation

## Development Dependencies

- **nodemon**: Auto-reload during development

## License

ISC
