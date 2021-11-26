const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
	username: String,
	password: String,
	employeeNumber: Number,
});
const User = mongoose.model('User', user);

module.exports = User;
