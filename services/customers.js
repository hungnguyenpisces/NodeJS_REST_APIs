const Customer = require('../models/Customer.js');

class CustomersServices {
	getAllCustomers = (data, req, res, next) => {
		switch (data.jobTitle) {
			case 'Staff':
				break;
			case 'Leader':
				const salesRepEmployeeNumber = data.employeeNumber;
				//aggregate
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
							as: 'customer',
						},
					},
					// { $unwind: '$customer', },
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
							customer: 1,
						},
					},
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

	getCustomerByNumber = (data, req, res, next) => {
		Customer.find(
			{ customerNumber: req.params.customerNumber },
			(err, customer) => {
				if (err) {
					res.send(err);
				}
				res.json(customer);
			}
		);
	};

	createCustomer = (data, req, res, next) => {
		const newCustomer = new Customer(req.body);
		newCustomer.save((err, customer) => {
			if (err) {
				res.send(err);
			}
			res.json(customer);
		});
	};

	updateCustomer = (data, req, res, next) => {
		Customer.findOneAndUpdate(
			{ customerNumber: req.params.customerNumber },
			req.body,
			{ new: true },
			(err, customer) => {
				if (err) {
					res.send(err);
				}
				res.json(customer);
			}
		);
	};

	updatePartialCustomer = (data, req, res, next) => {
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
	};

	deleteCustomer = (data, req, res, next) => {
		Customer.findOneAndDelete(
			{ customerNumber: req.params.customerNumber },
			(err, customer) => {
				if (err) {
					res.send(err);
				}
				res.json(customer);
			}
		);
	};
}

module.exports = new CustomersServices();
