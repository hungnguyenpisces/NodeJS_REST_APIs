const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee.js');
const secret = 'mysecretsshhh';
const User = require('../models/User.js');

class Users {
	hashPassword = (password) => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
	};

	isPasswordValid = (password, hashedPwd) => {
		return bcrypt.compareSync(password, hashedPwd);
	};

	generateToken = (user) => {
		const {
			_id,
			username,
			employeeNumber: { jobTitle, email },
		} = user;
		return jwt.sign({ _id, username, jobTitle, email }, secret, {
			expiresIn: '1h',
		});
	};

	createUser = (req, res) => {
		const { username, password, employeeNumber } = req.body;
		const hashedPwd = this.hashPassword(password);
		const newUser = new User({
			username,
			password: hashedPwd,
			employeeNumber,
		});
		newUser.save((err, user) => {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	userLogin = (req, res) => {
		User.findOne({ username: req.body.username })
			// .populate('employeeNumber')
			.populate({ path: 'employeeNumber', select: 'jobTitle email' })
			.then((user) => {
				// const user = users[0];
				if (user) {
					if (this.isPasswordValid(req.body.password, user.password)) {
						const token = this.generateToken(user);
						res.json({
							message: 'Authentication successful!',
							token,
							user,
						});
					} else {
						res.status(400).json('Incorrect password');
					}
				} else {
					res.status(400).json('User not found');
				}
			});
	};
}

module.exports = new Users();
