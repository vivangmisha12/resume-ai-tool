const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/database');
const userRouter = require('./routes/user.routes');
const analyzeRouter = require('./routes/analysis.routes');
const insightsRouter = require('./routes/insights.routes');

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: 'GET,POST,PUT,DELETE', 
  };
  
  app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


connectDB();

// api
app.use("/api/v1/user", userRouter);
app.use("/api/v1/analyze", analyzeRouter);
app.use("/api/v1/insights", insightsRouter);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})

