const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema(
	{
		username: { type: String, unique: true },
		password: String,
		employeeNumber: { type: Number, unique: true },
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model('User', user);

module.exports = User;
