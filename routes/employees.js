const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const employees = require('../services/employees.js');
const validate = require('../middleware/validators.js');

//Employee
router.get(
	'/:employeeNumber',
	auth(['President', 'Manager', 'Leader']),
	employees.getEmployeeByNumber
);

router.get(
	'/',
	auth(['President', 'Manager', 'Leader']),
	employees.getAllEmployees
);

router.post(
	'/',
	auth(['President', 'Manager']),
	validate.employee,
	employees.createEmployee
);

router.put(
	'/',
	auth(['President', 'Manager']),
	validate.employee,
	employees.updateEmployee
);

router.delete(
	'/:employeeNumber',
	auth(['President']),
	employees.deleteEmployee
);

module.exports = router;
