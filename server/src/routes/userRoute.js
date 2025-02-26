const express = require('express');
const { registerUser, signInUser, logout, checkAuth } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authorisation'); // Import the middleware
const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.post('/logout', logout);
router.get('/me', authMiddleware(), checkAuth); // Apply authentication middleware

module.exports = router;
