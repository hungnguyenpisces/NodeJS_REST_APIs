const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee.js');
const User = require('../models/User.js');
const LogMaker = require('./LogMaker.js');
const { AppError, handleError } = require('../utils/errorshandle.js');
const { logger } = require('../utils/logger.js');
class Users {
	hashPassword = (password) => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(+process.env.SALT));
	};

	isPasswordValid = (password, hashedPwd) => {
		return bcrypt.compareSync(password, hashedPwd);
	};

	generateToken = (user) => {
		const { username, employee } = user;
		console.log(username, employee);
		const { employeeNumber, officeCode, role } = employee;
		return jwt.sign(
			{ username, employeeNumber, officeCode, role },
			process.env.TOKEN_SECRET,
			{
				expiresIn: '1h',
			}
		);
	};

	createUser = handleError(async (req, res) => {
		const { username, password, employeeNumber } = req.body;

		const checkUsername = await User.findOne({ username }).catch((err) => {
			LogMaker.createLog('error', err.message, username, 'createUser');
			throw new AppError(err.message, 500);
		});
		if (checkUsername) {
			LogMaker.createLog(
				'warning',
				'Username already exists',
				username,
				'createUser'
			);
			throw new AppError('Username already exists', 400);
		}

		const checkEmployee = await Employee.findOne({ employeeNumber }).catch(
			(err) => {
				LogMaker.createLog('error', err.message, username, 'createUser');
				throw new AppError(err.message, 500);
			}
		);
		if (!checkEmployee) {
			LogMaker.createLog(
				'warning',
				'Employee number does not exist',
				username,
				'createUser'
			);
			throw new AppError('Employee number does not exist', 400);
		}

		const checkUserNumber = await User.findOne({ employeeNumber }).catch(
			(err) => {
				LogMaker.createLog('error', err.message, username, 'createUser');
				throw new AppError(err.message, 500);
			}
		);
		if (checkUserNumber) {
			LogMaker.createLog(
				'warning',
				'Employee number is owned by another user',
				username,
				'createUser'
			);
			throw new AppError('Employee number is owned by another user', 400);
		}

		const user = await new User({
			username,
			password: this.hashPassword(password),
			employeeNumber,
		})
			.save()
			.catch((err) => {
				LogMaker.createLog('error', err.message, username, 'createUser');
				throw new AppError(err.message, 500);
			});

		logger.info(`User ${user.username} created`);

		LogMaker.createLog(
			'info',
			`User ${user.username} created`,
			user.username,
			'new users registered'
		);

		return res.status(201).json({
			message: 'User created successfully',
			user,
		});
	});

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
			{
				$project: {
					_id: 0,
					username: 1,
					password: 1,
					employee: {
						employeeNumber: 1,
						officeCode: 1,
						reportsTo: 1,
						role: 1,
					},
					createdAt: {
						$dateToString: {
							format: '%Y-%m-%d %H:%M:%S',
							date: '$createdAt',
							timezone: '+07',
						},
					},
					updatedAt: {
						$dateToString: {
							format: '%Y-%m-%d %H:%M:%S',
							date: '$updatedAt',
							timezone: '+07',
						},
					},
				},
			},
		])
			.then((users) => {
				const user = users[0];
				if (user) {
					if (this.isPasswordValid(req.body.password, user.password)) {
						const token = this.generateToken(user);
						logger.info('Authentication successful!');
						LogMaker.createLog(
							'info',
							'Authentication successful!',
							user.username,
							'userLogin'
						);
						return res.json({
							message: 'Authentication successful!',
							token,
							user,
						});
					} else {
						logger.warn('Authentication failed! Incorrect password');
						LogMaker.createLog(
							'warning',
							'Authentication failed! Incorrect password',
							user.username,
							'userLogin'
						);
						return res.status(400).json('Incorrect password');
					}
				} else {
					logger.warn('User not found');
					LogMaker.createLog(
						'warning',
						'User not found',
						user.username,
						'userLogin'
					);
					return res.status(404).json('User not found');
				}
			})
			.catch((err) => {
				logger.error(err);
				return res.status(500).json({
					message: 'Something wrong, please check username & password',
					error: err,
				});
			});
	};
}

module.exports = new Users();
