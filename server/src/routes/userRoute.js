const express = require('express');
const { registerUser , signInUser, logout} = require('../controllers/userController');
const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.post("/logout",logout);

module.exports = router;
