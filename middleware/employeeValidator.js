const { celebrate, Joi } = require('celebrate');
const jobTitle = ['President', 'Manager', 'Leader', 'Staff'];

const employeeSchema = {
	employeeNumber: Joi.number().required().positive(),
	lastName: Joi.string().required().min(3).max(50),
	firstName: Joi.string().required().min(3).max(50),
	extension: Joi.string().required().min(1).max(50),
	email: Joi.string().required().max(100).email(),
	officeCode: Joi.string().required().max(10),
	reportsTo: Joi.number().positive().allow(null).optional(),
	jobTitle: Joi.string()
		.required()
		.valid(...jobTitle),
};
const employeeValidator = celebrate(
	{
		params: Joi.object().keys({}),
		query: Joi.object().keys({}),
		body: Joi.object().keys(employeeSchema),
	},
	{
		abortEarly: false,
		convert: false,
		presence: 'required',
		escapeHtml: true,
	}
);

module.exports = employeeValidator;
