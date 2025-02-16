const express = require('express');
const { registerUser, signInUser, requestPasswordReset, resetPassword } = require('../controllers/userController');
const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
