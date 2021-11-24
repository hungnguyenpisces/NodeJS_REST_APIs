const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const customers = require('../services/customers.js');

//Customer
router.get('/', auth(['President','Manager']), customers.getAllCustomers);

router.get('/:customerNumber', auth(['President','Manager']), customers.getCustomerByNumber);

router.post('/', auth(['President','Manager']), customers.createCustomer);

router.put('/', auth(['President','Manager']), customers.updateCustomer);

router.patch('/', auth(['President','Manager']), customers.updatePartialCustomer);

router.delete('/:customerNumber', auth(['President','Manager']), customers.deleteCustomer);

module.exports = router;
