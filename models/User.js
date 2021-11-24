const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
	username: String,
	password: String,
	employeeNumber: { type: Schema.Types.Number, ref: 'Employee' },
});
const User = mongoose.model('User', user);

module.exports = User;
