const { celebrate, Joi } = require('celebrate');

const customerSchema = {
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
};
const customerValidator = celebrate(
	{
		params: Joi.object().keys({}),
		query: Joi.object().keys({}),
		body: Joi.object().keys(customerSchema),
	},
	{
		abortEarly: false,
		convert: false,
		presence: 'required',
		escapeHtml: true,
	}
);
module.exports = customerValidator;
