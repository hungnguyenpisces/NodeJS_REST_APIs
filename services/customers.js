const Customer = require('../models/Customer.js');
const Employee = require('../models/Employee.js');
const { AppError, handleError } = require('../utils/errorshandle.js');
const LogMaker = require('./LogMaker.js');

class CustomersServices {
	getAllCustomers = handleError(async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				try {
					const customers = await Customer.find({
						salesRepEmployeeNumber: res.locals.auth.employeeNumber,
					}).catch((err) => {
						throw new AppError(err.message, 500);
					});
					if (!customers) {
						throw new AppError('No customers found', 404);
					}
					return res.status(200).json({ total: customers.length, customers });
				} catch (error) {
					throw new AppError(error.message, 500);
				}
				break;
			case 'Leader':
				try {
					let employeeNumbers = [res.locals.auth.employeeNumber];
					const employees = await Employee.find({
						reportsTo: res.locals.auth.employeeNumber,
					}).catch((err) => {
						throw new AppError(err.message, 500);
					});
					if (!employees) {
						throw new AppError('No employees found', 404);
					}
					employees.forEach((employee) => {
						employeeNumbers.push(employee.employeeNumber);
					});

					const customers = await Customer.aggregate([
						{ $match: { salesRepEmployeeNumber: { $in: employeeNumbers } } },
					]).catch((err) => {
						throw new AppError(err.message, 500);
					});
					if (!customers) {
						throw new AppError('No customers found', 404);
					}
					return res.status(200).json({ total: customers.length, customers });
				} catch (error) {
					throw new AppError(error.message, 500);
				}
				break;
			default:
				try {
					const customers = await Customer.find({}).catch((err) => {
						throw new AppError(err.message, 500);
					});
					if (!customers) {
						throw new AppError('No customers found', 404);
					}
					return res.status(200).json({ total: customers.length, customers });
				} catch (error) {
					throw new AppError(error.message, 500);
				}
				break;
		}
	});

	getCustomerByNumber = handleError(async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (
						customer.salesRepEmployeeNumber !== res.locals.auth.employeeNumber
					) {
						throw new AppError(
							'You are not authorized to view this customer',
							403
						);
					}
					if (!customer) {
						throw new AppError('No customer found', 404);
					}
					return res.status(200).json(customer);
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (
						customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber
					) {
						return res.status(200).json(customer);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						}).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
							return res.status(200).json(customer);
						} else {
							return res.status(403).json({
								message: 'You are not authorized to access this resource',
							});
						}
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			default:
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (!customer) {
						throw new AppError('No customer found', 404);
					}
					return res.status(200).json(customer);
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
		}
	});

	createCustomer = handleError(async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (customer) {
						return res.status(409).json({
							message: 'Customer number already exist',
						});
					} else if (
						req.body.salesRepEmployeeNumber !== res.locals.auth.employeeNumber
					) {
						return res.status(403).json({
							message:
								'You are not authorized to create this customer for other employee',
						});
					} else {
						const newCustomer = await new Customer(req.body)
							.save()
							.catch((err) => {
								throw new AppError(err.message, err.status);
							});
						return res.status(201).json(newCustomer);
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (customer) {
						return res.status(409).json({
							message: 'Customer number already exist',
						});
					} else {
						if (
							req.body.salesRepEmployeeNumber === res.locals.auth.employeeNumber
						) {
							const newCustomer = await new Customer(req.body)
								.save()
								.catch((err) => {
									throw new AppError(err.message, err.status);
								});
							return res.status(201).json(newCustomer);
						} else {
							const employee = await Employee.findOne({
								employeeNumber: req.body.salesRepEmployeeNumber,
							}).catch((err) => {
								throw new AppError(err.message, err.status);
							});
							if (employee.reportsTo === res.locals.auth.employeeNumber) {
								const newCustomer = await new Customer(req.body)
									.save()
									.catch((err) => {
										throw new AppError(err.message, err.status);
									});
								return res.status(201).json(newCustomer);
							} else {
								return res.status(403).json({
									message:
										'You are not authorized to create this customer for other team',
								});
							}
						}
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			default:
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (customer) {
						return res.status(409).json({
							message: 'Customer number already exist',
						});
					} else {
						const newCustomer = await new Customer(req.body)
							.save()
							.catch((err) => {
								throw new AppError(err.message, err.status);
							});
						return res.status(201).json(newCustomer);
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
		}
	});

	updateCustomer = handleError(async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (
						customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber
					) {
						const updatedCustomer = await Customer.findOneAndUpdate(
							{
								customerNumber: req.body.customerNumber,
							},
							req.body,
							{
								new: true,
							}
						).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						return res.status(200).json(updatedCustomer);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						}).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
							const updatedCustomer = await Customer.findOneAndUpdate(
								{
									customerNumber: req.body.customerNumber,
								},
								req.body,
								{
									new: true,
								}
							).catch((err) => {
								throw new AppError(err.message, err.status);
							});
							return res.status(200).json(updatedCustomer);
						} else {
							return res.status(403).json({
								message:
									'You are not authorized to update this customer for other team',
							});
						}
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			default:
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (customer) {
						const updatedCustomer = await Customer.findOneAndUpdate(
							{
								customerNumber: req.body.customerNumber,
							},
							req.body,
							{
								new: true,
							}
						).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						return res.status(200).json(updatedCustomer);
					} else {
						return res.status(404).json({
							message: 'Customer not found',
						});
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
		}
	});

	deleteCustomer = handleError(async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (!customer) {
						return res.status(404).json({
							message: 'Customer not found',
						});
					} else if (
						customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber
					) {
						const customer = await Customer.findOneAndDelete({
							customerNumber: req.params.customerNumber,
						}).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						return res.status(200).json({
							message: 'Customer deleted successfully',
							customer,
						});
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						}).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
							const customer = await Customer.findOneAndDelete({
								customerNumber: req.params.customerNumber,
							}).catch((err) => {
								throw new AppError(err.message, err.status);
							});
							return res.status(200).json({
								message: 'Customer deleted successfully',
								customer,
							});
						} else {
							return res.status(403).json({
								message:
									'You are not authorized to delete this customer in other team',
							});
						}
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
			default:
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					}).catch((err) => {
						throw new AppError(err.message, err.status);
					});
					if (!customer) {
						return res.status(404).json({
							message: 'Customer not found',
						});
					} else {
						const customer = await Customer.findOneAndDelete({
							customerNumber: req.params.customerNumber,
						}).catch((err) => {
							throw new AppError(err.message, err.status);
						});
						return res.status(200).json({
							message: 'Customer deleted successfully',
							customer,
						});
					}
				} catch (error) {
					throw new AppError(error.message, error.status);
				}
				break;
		}
	});
}

module.exports = new CustomersServices();
