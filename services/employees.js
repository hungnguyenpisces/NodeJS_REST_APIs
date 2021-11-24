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
		const employee = new Employee(req.body);
		employee
			.save()
			.then(() => res.json(employee))
			.catch((err) => res.status(400).json('Error: ' + err));
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
