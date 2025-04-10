const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const profileRoutes = require('../routes/profileRoute');
<<<<<<< HEAD
<<<<<<< HEAD
const generateRoutes = require('../routes/generateRoute');
const bodyParser = require('body-parser');
const cors = require("cors");
const upload = require('../middlewares/uploadImage');
require('dotenv').config();
const tranRoutes = require('../routes/tranRoute');
const revenueRoute = require('../routes/revenueRoute'); // Import the revenue route
const mongoose = require('mongoose');
const dbConfig = require('./db');
=======
const aiRoutes = require('../routes/aiRoutes');
const cors = require("cors");
=======
const aiRoutes = require('../routes/aiRoutes');
const cors = require("cors");
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
const cookieParser = require("cookie-parser");

>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const expenseRoutes = require('../routes/expenseRoutes');
const smsRoutes = require('../routes/smsRoute'); // Adjust the path if needed
// Connect to MongoDB
connectDB();

// Middleware
<<<<<<< HEAD
<<<<<<< HEAD
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // generate
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));

>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
// Routes
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/export', generateRoutes);
app.use('/api/transactions', tranRoutes); 
app.use('/api/revenue', revenueRoute); 
app.use('/api/expenses', expenseRoutes);
app.use('/api/sms', smsRoutes);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());






app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});