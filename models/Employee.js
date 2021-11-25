const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employee = new Schema({
	employeeNumber: { type: Number, required: true, min: 1 },
	lastName: { type: String, required: true, minLength: 3, maxLength: 50 },
	firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
	extension: { type: String, required: true, minLength: 3, maxLength: 50 },
	email: { type: String, required: true, maxLength: 100 },
	officeCode: { type: String, required: true, maxLength: 10 },
	reportsTo: { type: Number, min: 1 },
	jobTitle: { type: String, required: true, enum: ['President', 'Manager', 'Leader', 'Staff'] },
});
const Employee = mongoose.model('Employee', employee);

module.exports = Employee;
