const express = require('express');
const router = express.Router();
const { createDeadline, getUserDeadlines } = require('../controllers/taxDeadlineController');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure authMiddleware is imported

router.post('/', authMiddleware, createDeadline); // Correctly define the POST route
router.get('/', authMiddleware, getUserDeadlines); // Ensure the GET route is also defined

module.exports = router;
