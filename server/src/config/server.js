const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const aiRoutes = require('../routes/aiRoutes');
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});