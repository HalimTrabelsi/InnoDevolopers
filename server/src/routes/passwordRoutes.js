const express = require('express');
const { forgotPassword } = require('../controllers/passwordController');
const router = express.Router();

router.post('/forgot-password', forgotPassword);

module.exports = router;