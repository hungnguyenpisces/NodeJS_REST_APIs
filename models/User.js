const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
		maxLength: 20,
	},
	password: { type: String, required: true, minLength: 6, maxLength: 100 },
	employeeNumber: { type: Number, required: true, unique: true, min: 1, ref: 'Employee' },
});
const User = mongoose.model('User', user);

module.exports = User;
