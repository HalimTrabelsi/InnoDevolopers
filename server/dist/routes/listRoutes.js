const express = require('express');
const { addUser, editUser, deleteUser } = require('../controllers/ListController');
const router = express.Router();

router.post('/add-user', addUser);

router.put('/edit-user/:userId', editUser);

router.delete('/delete-user/:userId', deleteUser);

module.exports = router;
