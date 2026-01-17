const express = require('express');
const router = express.Router();
const { login, registerInitialAdmin } = require('../controllers/auth');

router.post('/login', login);
router.post('/seed', registerInitialAdmin); // Remove in production or protect

module.exports = router;
