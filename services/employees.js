const Employee = require('../models/Employee.js');
const { AppError, handleError } = require('../utils/errorshandle.js');
const LogMaker = require('./LogMaker.js');

class EmployeeService {
	getAllEmployees = handleError(async (req, res) => {
		const employees = await Employee.find({}).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (!employees) {
			throw new AppError('Employees not found', 404);
		}
		LogMaker.createLog(
			'info',
			`${res.locals.auth.username} getAllEmployees`,
			`${res.locals.auth.username}`,
			'Get all employees'
		);
		return res.status(200).json({
			total: employees.length,
			employees,
		});
	});

	getEmployeeByNumber = handleError(async (req, res) => {
		const employee = await Employee.findOne({
			employeeNumber: req.params.employeeNumber,
		}).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (!employee) {
			throw new AppError('Employee not found', 404);
		}
		LogMaker.createLog(
			'info',
			`${res.locals.auth.username} getEmployeeByNumber`,
			`${res.locals.auth.username}`,
			'Get employee by number'
		);
		return res.status(200).json(employee);
	});

	createEmployee = handleError(async (req, res) => {
		const isExists = await Employee.findOne({
			employeeNumber: req.body.employeeNumber,
		}).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (isExists) {
			return res.status(304).json({
				message: 'Employee already exists',
			});
		}
		const employee = await new Employee(req.body).save().catch((err) => {
			throw new AppError(err.message, 500);
		});
		LogMaker.createLog(
			'info',
			`${res.locals.auth.username} createEmployee`,
			`${res.locals.auth.username}`,
			`Create employee ${employee.employeeNumber}`
		);
		return res.status(201).json({
			message: 'Employee created successfully',
			employee,
		});
	});

	updateEmployee = handleError(async (req, res) => {
		const employee = await Employee.findOne({
			employeeNumber: req.params.employeeNumber,
		}).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (!employee) {
			throw new AppError('Employee not found', 404);
		} else {
			const updatedEmployee = await Employee.findOneAndUpdate(
				{ employeeNumber: req.body.employeeNumber },
				req.body,
				{ new: true }
			).catch((err) => {
				throw new AppError(err.message, 500);
			});
			LogMaker.createLog(
				'info',
				`${res.locals.auth.username} updateEmployee`,
				`${res.locals.auth.username}`,
				`Update employee ${employee.employeeNumber}`
			);
			return res.status(200).json({
				message: 'Employee updated successfully',
				updatedEmployee,
			});
		}
	});

	deleteEmployee = handleError(async (req, res) => {
		const employee = await Employee.findOne({
			employeeNumber: req.params.employeeNumber,
		}).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (!employee) {
			throw new AppError('Employee not found', 404);
		} else {
			const deletedEmployee = await Employee.findOneAndDelete({
				employeeNumber: req.params.employeeNumber,
			}).catch((err) => {
				throw new AppError(err.message, 500);
			});
			LogMaker.createLog(
				'info',
				`${res.locals.auth.username} deleteEmployee`,
				`${res.locals.auth.username}`,
				`Delete employee ${employee.employeeNumber}`
			);
			return res.status(200).json({
				message: 'Employee deleted successfully',
				deletedEmployee,
			});
		}
	});
}

module.exports = new EmployeeService();
