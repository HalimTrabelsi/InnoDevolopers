const express = require('express');
const { registerUser, signInUser, logout, checkAuth,  getUserProfileImage } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authorisation');
const { compareFaces } = require("../controllers/faceController");
const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.post('/logout', logout);
router.get('/me', authMiddleware(), checkAuth); // Apply authentication middleware
router.get("/profile-image", authMiddleware, getUserProfileImage);
router.post("/compare", authMiddleware,compareFaces);

module.exports = router;
