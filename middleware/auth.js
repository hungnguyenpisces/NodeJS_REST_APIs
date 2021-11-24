const jwt = require('jsonwebtoken');

const auth = (roles) => {
	return (req, res, next) => {
		const authorization = req.headers.authorization;
		const secret = process.env.TOKEN_SECRET;
		try {
			const token = authorization.replace('Bearer ', '');
			const data = jwt.verify(token, secret);
			const role = data.jobTitle;
			if (roles.includes(role)) {
				return next(data);
			}
			return res.status(403).json('Forbidden');
		} catch (error) {
			res.status(401).json('Unauthorized');
		}
	};
};
module.exports = auth;
