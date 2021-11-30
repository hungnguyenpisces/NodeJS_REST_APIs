const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { user } = require('../middleware/validators.js');
const Employee = require('../models/Employee.js');
const User = require('../models/User.js');
const { AppError, handleError } = require('../utils/errorshandle.js');
const salt = process.env.SALT;
const secret = process.env.TOKEN_SECRET;
const { logger } = require('../utils/logger.js');
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

	createUser = handleError(async (req, res) => {
		const { username, password, employeeNumber } = req.body;

		const checkUsername = await User.findOne({ username }).catch((err) => {
			throw new AppError(err.message, 500);
		});
		if (checkUsername) {
			throw new AppError('Username already exists', 400);
		}

		const checkEmployee = await Employee.findOne({ employeeNumber }).catch(
			(err) => {
				throw new AppError(err.message, 500);
			}
		);
		if (!checkEmployee) {
			throw new AppError('Employee number does not exist', 400);
		}

		const checkUserNumber = await User.findOne({ employeeNumber }).catch(
			(err) => {
				throw new AppError(err.message, 500);
			}
		);
		if (checkUserNumber) {
			throw new AppError('Employee number is owned by another user', 400);
		}

		const user = await new User({
			username,
			password: this.hashPassword(password),
			employeeNumber,
		})
			.save()
			.catch((err) => {
				throw new AppError(err.message, 500);
			});
		logger.info(`User ${user.username} created`);
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
						jobTitle: 1,
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
						return res.json({
							message: 'Authentication successful!',
							token,
							user,
						});
					} else {
						logger.warn('Authentication failed! Incorrect password');
						return res.status(400).json('Incorrect password');
					}
				} else {
					logger.warn('User not found');
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
