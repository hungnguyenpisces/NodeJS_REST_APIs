const express = require('express');
const router = express.Router();
const users = require('../services/users.js');

// register
router.post('/register', users.createUser);

//login
router.post('/login', users.userLogin);

module.exports = router;
