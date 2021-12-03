const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const Customers = require('../services/Customers.js');
const Validate = require('../middleware/Validators.js');

//Customer
router.get(
	'/:customerNumber',
	auth([1, 2, 3, 4]),
	Customers.getCustomerByNumber
);

router.get('/', auth([1, 2, 3, 4]), Customers.getAllCustomers);

router.post(
	'/',
	auth([1, 2, 3, 4]),
	Validate.customer,
	Customers.createCustomer
);

router.put('/', auth([1, 2, 3]), Customers.updateCustomer);

router.delete('/:customerNumber', auth([1, 2, 3]), Customers.deleteCustomer);

module.exports = router;
