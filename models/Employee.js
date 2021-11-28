const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employee = new Schema({
	employeeNumber: { type: Number, unique: true },
	lastName: String,
	firstName: String,
	extension: String,
	email: { type: String, unique: true },
	officeCode: String,
	reportsTo: Number,
	jobTitle: String,
});
const Employee = mongoose.model('Employee', employee);

module.exports = Employee;
