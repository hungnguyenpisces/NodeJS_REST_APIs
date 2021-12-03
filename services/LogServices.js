const Logger = require('../models/Logger.js');
const { AppError, handleError } = require('../utils/errorshandle.js');
const { logger } = require('../utils/logger.js');

class LogServices {
	getAllLogs = async (req, res) => {
        console.log(new Date().toString());
		try {
			const logs = await Logger.aggregate([
				{
					$project: {
						_id: 0,
						level: 1,
						message: 1,
						user: 1,
						action: 1,
						timestamp: {
							$dateToString: {
								format: '%Y-%m-%d %H:%M:%S',
								date: '$timestamp',
								timezone: '+07',
							},
						},
					},
				},
			]);
			res.status(200).json({
				total: logs.length,
				logs,
			});
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	};

	getLogsByLevel = async (req, res) => {
		try {
			const logs = await Logger.aggregate([
				{
					$match: { level: req.params.level },
				},
				{
					$project: {
						_id: 0,
						level: 1,
						message: 1,
						user: 1,
						action: 1,
						timestamp: {
							$dateToString: {
								format: '%Y-%m-%d %H:%M:%S',
								date: '$timestamp',
								timezone: '+07',
							},
						},
					},
				},
			]);
			res.status(200).json({
				total: logs.length,
				logs,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	getLogsByTimePeriod = async (req, res) => {
		const start = new Date(req.query.start);
		const end = new Date(req.query.end);
		try {
			const logs = await Logger.aggregate([
				{
					$match: {
						timestamp: {
							$gte: start,
							$lte: end,
						},
					},
				},
				{
					$project: {
						_id: 0,
						level: 1,
						message: 1,
						user: 1,
						action: 1,
						timestamp: {
							$dateToString: {
								format: '%Y-%m-%d %H:%M:%S',
								date: '$timestamp',
								timezone: '+07',
							},
						},
					},
				},
			]);
			res.status(200).json({
				total: logs.length,
				logs,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
}
module.exports = new LogServices();
