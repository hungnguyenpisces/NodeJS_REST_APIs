const { celebrate, Joi } = require('celebrate');

class Validators {
	user = celebrate(
		{
			body: Joi.object().keys({
				username: Joi.string().required().min(3).max(20),
				password: Joi.string()
					.required()
					.regex(
						/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/
					)
					.message(
						'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
					),
				employeeNumber: Joi.number().required().positive(),
			}),
		},
		{
			abortEarly: false,
			convert: false,
			presence: 'required',
			escapeHtml: true,
		}
	);

	employee = celebrate(
		{
			body: Joi.object().keys({
				employeeNumber: Joi.number().required().positive(),
				lastName: Joi.string().required().min(3).max(20),
				firstName: Joi.string().required().min(3).max(20),
				extension: Joi.string().required().min(3).max(20),
				email: Joi.string().required().email(),
				officeCode: Joi.string().required().min(3).max(20),
				reportsTo: Joi.number().positive(),
				jobTitle: Joi.string()
					.required()
					.valid('President', 'Manager', 'Leader', 'Staff'),
			}),
		},
		{
			abortEarly: false,
			convert: false,
			presence: 'required',
			escapeHtml: true,
		}
	);

	customer = celebrate(
		{
			body: Joi.object().keys({
				customerNumber: Joi.number().required().positive(),
				customerName: Joi.string().required().min(3).max(50),
				contactLastName: Joi.string().required().min(3).max(50),
				contactFirstName: Joi.string().required().min(3).max(50),
				phone: Joi.string().required().min(8).max(20),
				addressLine1: Joi.string().required().max(50),
				addressLine2: Joi.string().max(50).allow(null).optional(),
				city: Joi.string().required().min(2).max(50),
				state: Joi.string().min(2).max(50).allow(null).optional(),
				postalCode: Joi.string().min(2).max(50).allow(null).optional(),
				country: Joi.string().required().min(2).max(50),
				salesRepEmployeeNumber: Joi.number().required().positive(),
				creditLimit: Joi.number().positive().allow(null).optional(),
			}),
		},
		{
			abortEarly: false,
			convert: false,
			presence: 'required',
			escapeHtml: true,
		}
	);
}
module.exports = new Validators();
