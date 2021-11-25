const Employee = require('../models/Employee.js');

class EmployeeService {
	getAllEmployees = (data, req, res, next) => {
		Employee.find({}, (err, employees) => {
			if (err) {
				res.send(err);
			}
			res.json(employees);
		});
	};

	getEmployeeByNumber = (data, req, res, next) => {
		Employee.find(
			{ employeeNumber: req.params.employeeNumber },
			(err, employee) => {
				if (err) {
					res.send(err);
				}
				res.json(employee);
			}
		);
	};

	createEmployee = (data, req, res, next) => {
		//check if employee already exists
		Employee.find(
			{ employeeNumber: req.body.employeeNumber },
			(err, employees) => {
				if (err) {
					res.status(500).json({
						message: 'Internal server error',
						error: err,
					});
				}
				if (employees.length > 0) {
					res.status(400).send({
						message: 'Employee already exists',
					});
				} else {
					const newEmployee = new Employee(req.body);
					newEmployee.save((err, employee) => {
						if (err) {
							res.send(err);
						}
						res.json(employee);
					});
				}
			}
		);
	};

	updateEmployee = (data, req, res, next) => {
		Employee.findOneAndUpdate(
			{ employeeNumber: req.body.employeeNumber },
			req.body,
			{ new: true },
			(err, employee) => {
				if (err) {
					res.send(err);
				}
				res.json(employee);
			}
		);
	};

	updatePartialEmployee = (data, req, res, next) => {
		Employee.findOneAndUpdate(
			{ employeeNumber: req.body.employeeNumber },
			req.body,
			(err, employee) => {
				if (err) {
					res.send(err);
				}
				res.json(employee);
			}
		);
	};

	deleteEmployee = (data, req, res, next) => {
		Employee.findOneAndDelete(
			{ employeeNumber: req.params.employeeNumber },
			(err, employee) => {
				if (err) {
					res.send(err);
				}
				res.json(employee);
			}
		);
	};
}

module.exports = new EmployeeService();
