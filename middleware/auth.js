const jwt = require('jsonwebtoken');

const auth = (roles) => {
	return (req, res, next) => {
		const authorization = req.headers.authorization;
		const secret = 'mysecretsshhh';
		try {
			const token = authorization.replace('Bearer ', '');
			const decoded = jwt.verify(token, secret);
			const role = decoded.jobTitle;
			if (roles.includes(role)) {
				next();
			} else {
				res.status(401).json('Unauthorized');
			}
		} catch (error) {
			res.status(401).json('Unauthorized C');
		}
	};
};
module.exports = auth;
