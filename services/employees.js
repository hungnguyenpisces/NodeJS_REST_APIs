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
		const employee = new Employee(req.body);
		employee
			.save()
			.then(() => res.json(employee))
			.catch((err) => res.status(400).json('Error: ' + err));
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
