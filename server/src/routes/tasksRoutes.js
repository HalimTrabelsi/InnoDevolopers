const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authorization');
const aiController = require('../controllers/aiAssistant');

router.get('/prioritized', authMiddleware(['Accountant']), taskController.getPrioritizedTasks);
router.post('/ai/assist', authMiddleware(['Accountant']), aiController.handleAIAssist);

module.exports = router;