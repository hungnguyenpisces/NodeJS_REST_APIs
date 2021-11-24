const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employee = new Schema({
	employeeNumber: Number,
	lastName: String,
	firstName: String,
	extension: String,
	email: String,
	officeCode: String,
	reportsTo: Number,
	// jobTitle: String,
	jobTitle: { type: String, enum: ['President', 'Manager', 'Leader', 'Staff'] },
});
const Employee = mongoose.model('Employee', employee);

module.exports = Employee;
