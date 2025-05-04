const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authorization');

router.get('/prioritized', authMiddleware(['Accountant']), taskController.getPrioritizedTasks);

module.exports = router;