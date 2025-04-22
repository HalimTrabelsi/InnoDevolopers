const express = require('express');
const router = express.Router();
//const dashboardOwnerController = require('../controllers/dashboardOwnerController');
const { getDashboardData, createDashboardData } = require("../controllers/dashboardOwnerController");

// Dashboard routes
//router.get('/ownerdashboard', dashboardOwnerController.getDashboardData);
router.get('/getownerdashboard', getDashboardData);
router.post('/createownerdashboard', createDashboardData);
module.exports = router;