const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const employees = require('../services/employees.js');

//Employee
router.get('/',auth(['President','Manager','Leader']), employees.getAllEmployees);

router.get('/:employeeNumber',auth(['President','Manager','Leader']), employees.getEmployeeByNumber);

router.post('/',auth(['President','Manager']), employees.createEmployee);

router.put('/',auth(['President','Manager']), employees.updateEmployee);

router.patch('/',auth(['President','Manager']), employees.updatePartialEmployee);

router.delete('/:employeeNumber',auth(['President']), employees.deleteEmployee);

module.exports = router;
