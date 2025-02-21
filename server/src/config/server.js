const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const passwordRoutes = require('../routes/passwordRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
