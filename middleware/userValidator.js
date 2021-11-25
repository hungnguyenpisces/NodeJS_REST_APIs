const { celebrate, Joi } = require('celebrate');

const userSchema = {
	username: Joi.string().required().min(3).max(20),
	password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/),
	employeeNumber: Joi.number().required().positive(),
};
const userValidator = celebrate(
    {
        params: Joi.object().keys({}),
        query: Joi.object().keys({}),
        body: Joi.object().keys(userSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: 'required',
        escapeHtml: true,
    },
);
module.exports = userValidator;
