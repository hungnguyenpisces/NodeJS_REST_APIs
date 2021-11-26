const express = require('express');
const router = express.Router();
const users = require('../services/users.js');
const validate = require('../middleware/validators.js');

// register
router.post('/register', validate.user, users.createUser);

//login
router.post('/login', users.userLogin);

module.exports = router;
