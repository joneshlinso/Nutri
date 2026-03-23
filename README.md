# 🥗 NutriPlanner — MERN Stack

A full-stack MERN application for tracking nutrition and meal planning.

## Project Structure

```
NutriPlanner/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios instance & service functions
│   │   ├── components/      # Navbar, PrivateRoute
│   │   ├── context/         # AuthContext (JWT auth state)
│   │   └── pages/           # Home, Login, Register, Dashboard
│   └── .env.example         # Frontend env template
├── server/                  # Node.js + Express backend
│   ├── config/db.js         # MongoDB Mongoose connection
│   ├── controllers/         # authController, userController
│   ├── middleware/          # JWT protect + admin guards
│   ├── models/              # User model (bcrypt hashed passwords)
│   ├── routes/              # authRoutes, userRoutes
│   ├── server.js            # Express entry point
│   └── .env.example         # Server env template
└── package.json             # Root scripts with concurrently
```

## 🚀 Getting Started

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Set up environment variables

**Backend:**
```bash
cp server/.env.example server/.env
```
Edit `server/.env` and set your values:
```
MONGO_URI=mongodb://localhost:27017/nutriplanner   # or your Atlas URI
JWT_SECRET=your_strong_secret_here
PORT=5000
```

**Frontend:**
```bash
cp client/.env.example client/.env
```
The default `VITE_API_URL=http://localhost:5000/api` works out of the box.

### 3. MongoDB Setup

You have **two options**:

#### Option A — Local MongoDB
Install [MongoDB Community](https://www.mongodb.com/try/download/community) and start it:
```bash
brew services start mongodb-community
```

#### Option B — MongoDB Atlas (Cloud)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your IP → Create a DB user → Copy the connection string
3. Paste the string into `server/.env` as `MONGO_URI`

### 4. Run the app
```bash
npm run dev
```
- **Frontend:** http://localhost:5173  
- **Backend:**  http://localhost:5000  
- **Health check:** http://localhost:5000/api/health

## 📡 API Routes

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Private | Get user by ID |
| PUT | `/api/users/:id` | Private | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router |
| HTTP client | Axios (with JWT interceptors) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Dev tools | Nodemon + Concurrently |
