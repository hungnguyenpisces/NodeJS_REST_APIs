const express = require('express');
const router = express.Router();
const users = require('../services/users.js');
const userValidator = require('../middleware/userValidator.js');
const auth = require('../middleware/auth.js');

// register
router.post('/register', userValidator, users.createUser);

//login
router.post('/login', users.userLogin);

//change password
router.put('/', auth(['President', 'Manager', 'Leader', 'Staff']), userValidator, users.userChangePwd);

module.exports = router;
