const express = require('express');
<<<<<<< HEAD
<<<<<<< HEAD
const { registerUser , signInUser , verifyEmail , resendVerificationEmail , fetchUsersByFilters ,   checkAuth,
    logout } = require('../controllers/userController');
const upload = require('../middlewares/uploadImage');
const router = express.Router();
const authMiddleware = require('../middlewares/authorization'); // Import the middleware

=======
const { registerUser, signInUser, logout, checkAuth,getUserImageByEmail, verifyEmail , resendVerificationEmail ,fetchUsersByFilters  } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authorisation');
const { compareFaces } = require("../controllers/faceController");
const upload = require('../middlewares/uploadImage');
const router = express.Router();
// 🔹 User Authentication Routes
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
const { registerUser, signInUser, logout, checkAuth,getUserImageByEmail, verifyEmail , resendVerificationEmail ,fetchUsersByFilters  } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authorisation');
const { compareFaces } = require("../controllers/faceController");
const upload = require('../middlewares/uploadImage');
const router = express.Router();
// 🔹 User Authentication Routes
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.get('/verify-email/:verificationToken', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.get('/view-users', fetchUsersByFilters); 
router.post('/logout', logout);
router.get('/me', authMiddleware(), checkAuth);
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
// 🔹 Face Recognition Route
router.post("/compare-faces", authMiddleware(),compareFaces);
// 🔹 Fetch User Profile Image by Email
router.get('/profile-image/:email', authMiddleware(), getUserImageByEmail);
<<<<<<< HEAD
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
module.exports = router;
