const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const cors = require("cors");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const cookieParser = require("cookie-parser");

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
