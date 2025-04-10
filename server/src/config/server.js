const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const profileRoutes = require('../routes/profileRoute');
const generateRoutes = require('../routes/generateRoute');
const bodyParser = require('body-parser');
const upload = require('../middlewares/uploadImage');
const translationRoutes = require('../routes/translationRoutes');
const tranRoutes = require('../routes/tranRoute');
const revenueRoute = require('../routes/revenueRoute'); // Import the revenue routes
dotenv.config();
const expenseRoutes = require('../routes/expenseRoutes');
const smsRoutes = require('../routes/smsRoute'); // Adjust the path if needed
const aiRoutes = require('../routes/aiRoutes');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cryptoRoutes = require('../routes/crypto');
const compteBanciareRoutes=require('../routes/compteBancaireRoutes')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // generate
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/export', generateRoutes);
app.use('/api/transactions', tranRoutes); 
app.use('/api/revenue', revenueRoute); 
app.use('/api/expenses', expenseRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/ai', aiRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));
app.use('/api/profile', profileRoutes);
app.use('/stripe', require('../routes/stripe'));
app.use('/crypto', cryptoRoutes); // Transaction Routes
app.use('/compteBancaire', compteBanciareRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


