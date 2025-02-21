const express = require('express');
const { registerUser, signInUser } = require('../controllers/userController');
const upload = require('../middlewares/uploadImage');

const router = express.Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);

module.exports = router;
