const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const employees = require('../services/employees.js');
const employeeValidator = require('../middleware/employeeValidator.js');

//Employee
router.get('/:employeeNumber',auth(['President','Manager','Leader']), employees.getEmployeeByNumber);

router.get('/',auth(['President','Manager','Leader']), employees.getAllEmployees);

router.post('/',auth(['President','Manager']), employeeValidator, employees.createEmployee);

router.put('/',auth(['President','Manager']), employees.updateEmployee);

router.patch('/',auth(['President','Manager']), employees.updatePartialEmployee);

router.delete('/:employeeNumber',auth(['President']), employees.deleteEmployee);

module.exports = router;
