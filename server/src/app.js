const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const dbConfig = require('./config/db');
const userRoutes = require('./routes/userRoute');
const cors = require('cors');
const passwordRoutes = require('./routes/passwordRoutes');


const app = express();
app.use(cors());
app.use(cors({ origin: 'http://localhost:5001' }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//userRoot
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
// Database connection
dbConfig();

// Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});