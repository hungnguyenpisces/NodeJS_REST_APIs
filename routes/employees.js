const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const Employees = require('../services/Employees.js');
const Validate = require('../middleware/Validators.js');

//Employee
router.get('/:employeeNumber', auth([1, 2, 3]), Employees.getEmployeeByNumber);

router.get('/', auth([1, 2, 3]), Employees.getAllEmployees);

router.post('/', auth([1, 2]), Validate.employee, Employees.createEmployee);

router.put('/', auth([1, 2]), Validate.employee, Employees.updateEmployee);

router.delete('/:employeeNumber', auth([1]), Employees.deleteEmployee);

module.exports = router;
