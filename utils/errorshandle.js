const { logger } = require('../utils/logger.js');
const LogMaker = require('../services/LogMaker.js');
const { isCelebrateError } = require('celebrate');
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
	const { statusCode, status, message } = error;
    
	if (error.statusCode >= 400 && error.statusCode < 500) {
		LogMaker.createLog('warning', error.message, 'system', 'handleErrors');
	}
	if (error.statusCode >= 500) {
		LogMaker.createLog('error', error.message, 'system', 'handleErrors');
	}
    
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
