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
		//check employeeNumber is exist
		Employee.findOne({ employeeNumber }, (err, employee) => {
			if (err) {
				res.status(500).json({
					message: 'Internal server error',
					error: err,
				});
			} else if (!employee) {
				res.status(404).json({
					message: 'Employee not found',
				});
			} else {
				//check username is exist
				User.findOne({ username }, (err, user) => {
					if (err) {
						res.status(500).json({
							message: 'Internal server error',
							error: err,
						});
					} else if (user) {
						res.status(409).json({
							message: 'Username is exist',
						});
					} else {
						//create user
						const newUser = new User({
							username,
							password: this.hashPassword(password),
							employee: employee._id,
						});
						newUser.save((err, user) => {
							if (err) {
								res.status(500).json({
									message: 'Internal server error',
									error: err,
								});
							} else {
								res.status(201).json({
									message: 'User created',
									user,
								});
							}
						});
					}
				});
			}
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
						});
					} else {
						res.status(400).json('Incorrect password');
					}
				} else {
					res.status(400).json('User not found');
				}
			});
	};

	userChangePwd = (data, req, res, next) => {
		//check data.employeeNumber === req.employeeNumber
		if (data.employeeNumber !== req.body.employeeNumber) {
			res.status(401).json('Unauthorized');
		} else {
			User.findOne({ username: req.body.username }, (err, user) => {
				if (err) {
					res.status(500).json({
						message: 'Internal server error',
						error: err,
					});
				} else if (!user) {
					res.status(404).json({
						message: 'User not found',
					});
				} else {
					if (this.isPasswordValid(req.body.oldPassword, user.password)) {
						user.password = this.hashPassword(req.body.newPassword);
						user.save((err, user) => {
							if (err) {
								res.status(500).json({
									message: 'Internal server error',
									error: err,
								});
							} else {
								res.status(200).json({
									message: 'Password changed',
									user,
								});
							}
						});
					} else {
						res.status(400).json('Incorrect password');
					}
				}
			});
		}
	};
}

module.exports = new Users();
