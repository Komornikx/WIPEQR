const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtVerify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.replace(/^Bearer\s/, '');

		try {
			const verified = await jwtVerify(token, process.env.SECRET);
			if (!verified || verified.type !== 'admin') {
				return res.status(401).json({
					message: 'Unauthorized!',
				});
			}
		} catch (err) {
			return res.status(401).json({
				message: 'Unauthorized!',
			});
		}

		next();
	} else {
		res.status(401).json({
			message: 'Unauthorized!',
		});
	}
};
