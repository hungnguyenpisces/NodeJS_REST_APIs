const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorshandle.js');

const auth = (roles) => {
	return (req, res, next) => {
		const authorization = req.headers.authorization;
		const secret = process.env.TOKEN_SECRET;
		try {
			const token = authorization.replace('Bearer ', '');
			if (!token) {
				throw new Error();
			}

			const data = jwt.verify(token, secret);

			const role = data.jobTitle;
			if (!role) {
				throw new Error();
			}

			if (roles.includes(role)) {
				res.locals.auth = data;
				return next();
			}

			throw new AppError('Forbidden.', 403);
		} catch (error) {
			throw new AppError('Unauthorized.', 401);
		}
	};
};
module.exports = auth;
