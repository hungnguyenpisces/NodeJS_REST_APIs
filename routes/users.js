const express = require('express');
const router = express.Router();
const Users = require('../services/Users.js');
const Validate = require('../middleware/Validators.js');

// register
router.post('/register', Validate.user, Users.createUser);

//login
router.post('/login', Users.userLogin);

module.exports = router;