const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const userRoutes = require('./userRoute');

// Define your routes here
//router.get('/example', controller.exampleFunction);
//router.post('/example', controller.createExampleFunction);
// Add more routes as needed
router.use('/users', userRoutes);


module.exports = router;