
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customer = new Schema({
	customerNumber: {type: Number, required: true, min: 1},
	customerName: {type: String, required: true, minlength:3, maxLength: 50},
	contactLastName: {type: String, required: true, minlength:3, maxLength: 50},
	contactFirstName: {type: String, required: true, minlength:3, maxLength: 50},
	phone: {type: String, required: true, minlength:8, maxLength: 20},
	addressLine1: {type: String, required: true, maxLength: 50},
	addressLine2: {type: String, maxLength: 50},
	city: {type: String, required: true, minlength:2, maxLength: 50},
	state: {type: String, minlength:2, maxLength: 50},
	postalCode: {type: String, minlength:2, maxLength: 50},
	country: {type: String, required: true, minlength:2, maxLength: 50},
	salesRepEmployeeNumber: {type: Number, required: true, min: 1},
	creditLimit: Number,
});
const Customer = mongoose.model('Customer', customer);

module.exports = Customer;