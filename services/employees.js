const Employee = require('../models/Employee.js');

class EmployeeService {
	getAllEmployees = (req, res) => {
		Employee.find({}, (err, employees) => {
			if (err) {
				res.send(err);
			}
			res.json(employees);
		});
	};

	getEmployeeByNumber = (req, res) => {
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

	createEmployee = (req, res) => {
		//check if employee already exists
		Employee.findOne(
			{ employeeNumber: req.body.employeeNumber },
			(err, employee) => {
				if (err) {
					res.status(500).json({
						message: 'Internal server error',
						error: err,
					});
				} else if (employee) {
					res.status(409).json({
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

	updateEmployee = (req, res) => {
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

	updatePartialEmployee = (req, res) => {
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

	deleteEmployee = (req, res) => {
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
