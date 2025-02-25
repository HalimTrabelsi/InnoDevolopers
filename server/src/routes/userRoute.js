const express = require('express');
const { registerUser , signInUser} = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const router = express.Router();
const User = require('../models/user');

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);



module.exports = router;
