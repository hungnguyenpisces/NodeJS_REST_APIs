const Customer = require('../models/Customer.js');
const Employee = require('../models/Employee.js');

class CustomersServices {
	getAllCustomers = (req, res) => {
		const salesRepEmployeeNumber = res.locals.auth.employeeNumber;
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				Customer.aggregate([{ $match: { salesRepEmployeeNumber } }])
					.then((customers) => res.json({ total: customers.length, customers }))
					.catch((err) => res.status(400).json('Error: ' + err));

				break;
			case 'Leader':
				let employeeNumbers = [res.locals.auth.employeeNumber];
				Employee.find({ reportsTo: res.locals.auth.employeeNumber })
					.then((employees) => {
						employees.forEach((employee) => {
							employeeNumbers.push(employee.employeeNumber);
						});
						Customer.aggregate([
							{ $match: { salesRepEmployeeNumber: { $in: employeeNumbers } } },
						])
							.then((customers) =>
								res.json({ total: customers.length, customers })
							)
							.catch((err) => res.status(400).json('Error: ' + err));
					})
					.catch((err) => res.status(400).json('Error: ' + err));

				break;

			default:
				Customer.find({}, (err, customers) => {
					if (err) {
						res.send(err);
					}
					res.json({ total: customers.length, customers });
				});
				break;
		}
	};

	getCustomerByNumber = async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				Customer.findOne(
					{
						customerNumber: req.params.customerNumber,
						salesRepEmployeeNumber: res.locals.auth.employeeNumber,
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
					if (customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber) {
						res.json(customer);
					} else {
						const employee = await Employee.findOne({
							employeeNumber: customer.salesRepEmployeeNumber,
						});
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
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

	createCustomer = async (req, res) => {
		const newCustomer = new Customer(req.body);
		switch (res.locals.auth.jobTitle) {
			case 'Staff':
				//check customerNumber is exist
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
						salesRepEmployeeNumber: res.locals.auth.employeeNumber,
					});
					if (customer) {
						res.send('Customer already exists');
					} else {
						newCustomer.save((err, customer) => {
							if (err) {
								res.send(err);
							}
							res.json(customer);
						});
					}
				} catch (error) {
					res.send(error + ' or custom not found');
				}
				break;
			case 'Leader':
				//check customer is exist
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer) {
						res.send('Customer already exists');
					} else {
						if (req.body.salesRepEmployeeNumber === res.locals.auth.employeeNumber) {
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
							if (employee.reportsTo === res.locals.auth.employeeNumber) {
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
					}
				} catch (error) {
					res.send(error + ' or custom not found');
				}
				break;
			default:
				//check customer is exist
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer) {
						res.send('Customer already exists');
					} else {
						newCustomer.save((err, customer) => {
							if (err) {
								res.send(err);
							}
							res.json(customer);
						});
					}
				} catch (error) {
					res.send(error + ' or custom not found');
				}
				break;
		}
	};

	updateCustomer = async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber) {
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
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
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

	updatePartialCustomer = async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.body.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber) {
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
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
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

	deleteCustomer = async (req, res) => {
		switch (res.locals.auth.jobTitle) {
			case 'Leader':
				try {
					const customer = await Customer.findOne({
						customerNumber: req.params.customerNumber,
					});
					if (customer.salesRepEmployeeNumber === res.locals.auth.employeeNumber) {
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
						if (employee.reportsTo === res.locals.auth.employeeNumber) {
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
