const express = require('express');
const router = express.Router();
const employees = require('./employees.js');
const customers = require('./customers.js');
const users = require('./users.js');
const logs = require('./logs.js');

router.use('/employees', employees);
router.use('/customers', customers);
router.use('/users', users);
router.use('/logs', logs);

module.exports = router;
