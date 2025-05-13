const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute');
const dbConfig = require('./config/db');
require('dotenv').config();
const generateRoutes = require('./routes/generateRoute'); 
const tranRoutes = require('./routes/tranRoute');
const predictRoute = require('./routes/predictRoute');
const revenueRoutes = require('./routes/revenueRoutes');
const taskRoute = require('./routes/taskRoute');
const dashboardOwnerRoutes = require('./routes/dashboardOwnerRoutes'); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
dbConfig();

// Routes
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/export', generateRoutes);  // Register the routes
app.use('/api/transactions', tranRoutes); 
app.use('/api', revenueRoutes);
app.use('/api', taskRoute);
app.use('/api', predictRoute);
app.use('/api/ownerdashboard', dashboardOwnerRoutes);

// Start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));
