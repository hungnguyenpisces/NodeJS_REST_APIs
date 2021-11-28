const { createLogger, format, transports } = require('winston');

const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: 'MMM-DD-YYYY HH:mm:ss',
		}),
		format.printf(
			(info) => `[${[info.timestamp]}]: [${info.level.toUpperCase()}]: ${info.message}`
		)
	),
	transports: [
		new transports.Console({
			level: 'info',
			format: format.combine(
				format.timestamp({
					format: 'MMM-DD-YYYY HH:mm:ss',
				}),
				format.colorize(),
				format.simple(),
				format.printf(
					(info) => `${[info.timestamp]}: ${info.level}: ${info.message}`
				)
			),
			timestamp: true,
		}),
		new transports.File({
			filename: 'info.log',
			level: 'info',
			dirname: 'logs',
		}),
		new transports.File({
			filename: 'warn.log',
			level: 'warn',
			dirname: 'logs',
		}),
		new transports.File({
			filename: 'error.log',
			level: 'error',
			dirname: 'logs',
		}),
	],
});
module.exports = { logger };
