const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { $where } = require('../models/Employee.js');
const Employee = require('../models/Employee.js');
const User = require('../models/User.js');
const salt = process.env.SALT;
const secret = process.env.TOKEN_SECRET;

class Users {
	hashPassword = (password) => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(+salt));
	};

	isPasswordValid = (password, hashedPwd) => {
		return bcrypt.compareSync(password, hashedPwd);
	};

	generateToken = (user) => {
		const { employee } = user;
		const { employeeNumber, officeCode, jobTitle } = employee;
		return jwt.sign({ employeeNumber, officeCode, jobTitle }, secret, {
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
		User.aggregate([
			{ $match: { username: req.body.username } },
			{
				$lookup: {
					from: 'employees',
					localField: 'employeeNumber',
					foreignField: 'employeeNumber',
					as: 'employee',
				},
			},
			{ $unwind: '$employee' },
		])
			// .populate('employeeNumber')
			// .populate({ path: 'employeeNumber', select: 'jobTitle email' })
			.then((users) => {
				const user = users[0];
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
