const Customer = require('../models/Customer.js');
const Employee = require('../models/Employee.js');

class CustomersServices {
	getAllCustomers = (data, req, res, next) => {
		const salesRepEmployeeNumber = data.employeeNumber;
		switch (data.jobTitle) {
			case 'Staff':
				Customer.aggregate([{ $match: { salesRepEmployeeNumber } }])
					.then((customers) => res.json(customers))
					.catch((err) => res.status(400).json('Error: ' + err));

				break;
			case 'Leader':
				Customer.aggregate([
					{ $match: { salesRepEmployeeNumber } },
					{
						$lookup: {
							from: 'employees',
							localField: 'salesRepEmployeeNumber',
							foreignField: 'employeeNumber',
							as: 'employee',
						},
					},
					// { $unwind: '$employee' },
					{
						$lookup: {
							from: 'employees',
							localField: 'employee.employeeNumber',
							foreignField: 'reportsTo',
							as: 'reportsTo',
						},
					},
					// { $unwind: '$reportsTo' },
					//lookup customer from reportsto employeeNumber
					{
						$lookup: {
							from: 'customers',
							localField: 'reportsTo.employeeNumber',
							foreignField: 'salesRepEmployeeNumber',
							as: 'customerFromStaff',
						},
					},
					// { $unwind: '$customerFromStaff', },
					{
						$project: {
							_id: 1,
							customerNumber: 1,
							customerName: 1,
							contactLastName: 1,
							contactFirstName: 1,
							phone: 1,
							addressLine1: 1,
							addressLine2: 1,
							city: 1,
							state: 1,
							postalCode: 1,
							country: 1,
							salesRepEmployeeNumber: 1,
							creditLimit: 1,
							customerFromStaff: 1,
						},
					},
					// { $project: { customerFromStaff: 1 } },
				])
					.then((customers) => {
						res.json(customers);
					})
					.catch((err) => {
						res.send(err);
					});
				break;

			default:
				Customer.find({}, (err, customer) => {
					if (err) {
						res.send(err);
					}
					res.json(customer);
				});
				break;
		}
	};

	getCustomerByNumber = async (data, req, res, next) => {
		switch (data.jobTitle) {
			case 'Staff':
				Customer.findOne(
					{
						customerNumber: req.params.customerNumber,
						salesRepEmployeeNumber: data.employeeNumber,
					},
					(err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					}
				);
				break;
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === data.employeeNumber) {
						res.json(customer);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === data.employeeNumber) {
							res.json(customer);
						} else {
							res.send('Not authorize this customer' + err);
						}
					}
				} catch (error) {
					res.send(error + ' or custom not found');
				}
				break;
			default:
				Customer.find(
					{ customerNumber: req.params.customerNumber },
					(err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					}
				);
				break;
		}
	};

	createCustomer = async (data, req, res, next) => {
		const newCustomer = new Customer(req.body);
		switch (data.jobTitle) {
			case 'Staff':
				if (req.body.salesRepEmployeeNumber === data.employeeNumber) {
					newCustomer.save((err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					});
				} else {
					res.send('you cannot create customer for other employee');
				}
				break;
			case 'Leader':
				try {
					if (req.body.salesRepEmployeeNumber === data.employeeNumber) {
						newCustomer.save((err, customer) => {
							if (err) {
								res.send(err);
							}
							res.json(customer);
						});
					} else {
						const employee = await Employee.findOne({
							employeeNumber: req.body.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === data.employeeNumber) {
							newCustomer.save((err, customer) => {
								if (err) {
									res.send(err);
								}
								res.json(customer);
							});
						} else {
							res.send(
								'you cannot create customer for other employee in other team'
							);
						}
					}
				} catch (error) {
					res.send(error);
				}
				break;
			default:
				newCustomer.save((err, customer) => {
					if (err) {
						res.send(err);
					}
					res.json(customer);
				});
				break;
		}
	};

	updateCustomer = async (data, req, res, next) => {
		switch (data.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === data.employeeNumber) {
						Customer.findOneAndUpdate(
							{ customerNumber: req.body.customerNumber },
							req.body,
							{ new: true },
							(err, customer) => {
								if (err) {
									res.send(err);
								}
								res.json(customer);
							}
						);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === data.employeeNumber) {
							Customer.findOneAndUpdate(
								{ customerNumber: req.body.customerNumber },
								req.body,
								{ new: true },
								(err, customer) => {
									if (err) {
										res.send(err);
									}
									res.json(customer);
								}
							);
						} else {
							res.send('You do not have permission to perform this operation');
						}
					}
				} catch (error) {
					res.send(error);
				}
				break;
			default:
				Customer.findOneAndUpdate(
					{ customerNumber: req.body.customerNumber },
					req.body,
					{ new: true },
					(err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					}
				);
				break;
		}
	};

	updatePartialCustomer = async (data, req, res, next) => {
		switch (data.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === data.employeeNumber) {
						Customer.findOneAndUpdate(
							{ customerNumber: req.body.customerNumber },
							req.body,
							(err, customer) => {
								if (err) {
									res.send(err);
								}
								res.json(customer);
							}
						);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === data.employeeNumber) {
							Customer.findOneAndUpdate(
								{ customerNumber: req.body.customerNumber },
								req.body,
								(err, customer) => {
									if (err) {
										res.send(err);
									}
									res.json(customer);
								}
							);
						} else {
							res.send('You do not have permission to perform this operation');
						}
					}
				} catch (error) {
					res.send(error);
				}
				break;
			default:
				Customer.findOneAndUpdate(
					{ customerNumber: req.body.customerNumber },
					req.body,
					(err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					}
				);
				break;
		}
	};

	deleteCustomer = async (data, req, res, next) => {
		switch (data.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === data.employeeNumber) {
						Customer.findOneAndDelete(
							{
								customerNumber: req.params.customerNumber,
							},
							(err, customer) => {
								if (err) {
									res.send(err);
								}
								res.json(customer);
							}
						);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === data.employeeNumber) {
							Customer.findOneAndDelete(
								{
									customerNumber: req.params.customerNumber,
								},
								(err, customer) => {
									if (err) {
										res.send(err);
									}
									res.json(customer);
								}
							);
						} else {
							res.send('You do not have permission to perform this operation');
						}
					}
				} catch (error) {
					res.send(error);
				}
				break;
			default:
				Customer.findOneAndDelete(
					{ customerNumber: req.params.customerNumber },
					(err, customer) => {
						if (err) {
							res.send(err);
						}
						res.json(customer);
					}
				);

				break;
		}
	};
}

module.exports = new CustomersServices();
