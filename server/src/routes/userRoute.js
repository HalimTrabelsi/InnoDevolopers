const express = require('express');
const { registerUser , signInUser , verifyEmail , resendVerificationEmail , fetchUsersByFilters ,   checkAuth,
    logout , getUserImageByEmail } = require('../controllers/userController');
const upload = require('../middlewares/uploadImage');
const router = express.Router();
const authMiddleware = require('../middlewares/authorization'); // Import the middleware
const { compareFaces } = require("../controllers/faceController");

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.get('/verify-email/:verificationToken', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.get('/view-users', fetchUsersByFilters); 
router.post('/logout', logout);
router.get('/me', authMiddleware(), checkAuth);
router.post("/compare-faces", authMiddleware(),compareFaces);
router.get('/profile-image/:email', authMiddleware(), getUserImageByEmail);


module.exports = router;
