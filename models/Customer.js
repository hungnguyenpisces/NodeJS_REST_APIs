const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customer = new Schema({
	customerNumber: Number,
	customerName: String,
	contactLastName: String,
	contactFirstName: String,
	phone: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	state: String,
	postalCode: String,
	country: String,
	salesRepEmployeeNumber: Number,
	creditLimit: Number,
});
const Customer = mongoose.model('Customer', customer);

module.exports = Customer;
