require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");


// ─── Connect to MongoDB ──────────────────────────────────────
connectDB();

const app = express();

// ─── Middleware ──────────────────────────────────────────────
// ─── CORS Configuration ──────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, "") === normalizedOrigin)
      || normalizedOrigin.startsWith("http://localhost:")
      || normalizedOrigin.startsWith("http://127.0.0.1:");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/plans", require("./routes/mealPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ─── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
