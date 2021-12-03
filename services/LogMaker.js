const Logger = require('../models/Logger.js');
const { AppError, handleError } = require('../utils/errorshandle.js');

class LogMaker {
	createLog = async (level, message, user, action) => {
		try {
			await new Logger({
				level,
				message,
				user,
				action,
			})
				.save()
				.then((log) => log)
				.catch((err) => {
					throw new AppError(err.message, 500);
				});
		} catch (error) {
			throw new AppError(error.message, 500);
		}
	};
}
module.exports = new LogMaker();
