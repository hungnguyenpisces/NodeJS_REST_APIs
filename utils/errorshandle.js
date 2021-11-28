const { logger } = require('../utils/logger.js');

class AppError extends Error {
	constructor(message, statusCode, status) {
		super(message);

		this.statusCode = statusCode;
		this.status = status;
		Error.captureStackTrace(this, this.constructor);
	}
}

const handleError = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const handleErrors = (error, req, res, next) => {
	const { statusCode = 500, status = 'error', message } = error;

	logger.error(error);

	return res.status(statusCode).json({
		status,
		message,
        error,
	});
};

module.exports = {
	AppError,
	handleError,
	handleErrors,
};
