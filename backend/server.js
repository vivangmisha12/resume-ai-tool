// Load environment variables at the very top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const connectDB = require('./database/database'); // Optional if you want a separate DB file
const userRouter = require('./routes/user.routes');
const analyzeRouter = require('./routes/analysis.routes');
const insightsRouter = require('./routes/insights.routes');

const app = express();

// ---------- CORS Configuration ----------
const corsOptions = {
  origin: ['http://localhost:5173', 'https://dhanushk-adya-ai.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ---------- MongoDB Connection ----------
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MongoDB URI not found! Please check your .env file.");
  process.exit(1); // Stop server if URI is missing
}

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------- Routes ----------
app.use("/api/v1/user", userRouter);
app.use("/api/v1/analyze", analyzeRouter);
app.use("/api/v1/insights", insightsRouter);

// ---------- Start Server ----------
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
