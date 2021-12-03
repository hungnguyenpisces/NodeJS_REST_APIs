const { celebrate, Joi } = require('celebrate');

class Validators {
	user = celebrate(
		{
			body: Joi.object().keys({
				username: Joi.string().required().min(3).max(20),
				password: Joi.string().min(6).max(100).required()
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]/)
					.message(
						'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
					),
                employeeNumber: Joi.number().integer().positive().required(),
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
				employeeNumber: Joi.number().integer().positive().required(),
				lastName: Joi.string().min(3).max(50).trim().invalid('9999').required(),
				firstName: Joi.string().min(3).max(50).trim().required(),
				extension: Joi.string().max(50).trim().required(),
				email: Joi.string().min(10).max(100).email().trim().required(),
				officeCode: Joi.string().required().max(10),
				reportsTo: Joi.number().integer().positive().allow(null),
				jobTitle: Joi.string().required().valid('President', 'Manager', 'Leader', 'Staff'),
				role: Joi.number().integer().valid(1, 2, 3, 4).required(),
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
                customerNumber: Joi.number().integer().positive().required(),
                customerName: Joi.string().min(5).max(50).trim().required(),
                contactLastName: Joi.string().min(3).max(50).trim().required(),
                contactFirstName: Joi.string().min(3).max(50).trim().required(),
                phone: Joi.string().min(8).max(20).trim().required(),
                addressLine1: Joi.string().min(10).max(50).trim().required(),
                addressLine2: Joi.string().min(10).max(50).trim().allow(null).required(),
                city: Joi.string().min(2).max(50).trim().required(),
                state: Joi.string().min(2).max(50).trim().allow(null).required(),
                postalCode: Joi.string().min(5).max(15).trim().allow(null).required(),
                country: Joi.string().min(2).max(50).trim().required(),
                salesRepEmployeeNumber: Joi.number().integer().positive().allow(null).required(),
                creditLimit: Joi.number().precision(2).positive().less(10000000000).allow(null, Joi.number().integer()).optional(),
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
