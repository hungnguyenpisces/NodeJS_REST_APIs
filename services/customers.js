const Customer = require('../models/Customer.js');

class CustomersServices {
	getAllCustomers = (req, res) => {
		Customer.find({}, (err, customer) => {
			if (err) {
				res.send(err);
			}
			res.json(customer);
		});
	};

	getCustomerByNumber = (req, res) => {
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

	createCustomer = (req, res) => {
		const newCustomer = new Customer(req.body);
		newCustomer.save((err, customer) => {
			if (err) {
				res.send(err);
			}
			res.json(customer);
		});
	};

	updateCustomer = (req, res) => {
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

	updatePartialCustomer = (req, res) => {
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

	deleteCustomer = (req, res) => {
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
