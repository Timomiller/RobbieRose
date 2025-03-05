const express = require('express');
const { addPoints, getUser } = require('./controllers/userController');
const router = express.Router();

router.post('/add-points', addPoints);
router.get('/me', getUser);

module.exports = router;