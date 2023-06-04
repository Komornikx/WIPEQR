const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtVerify = promisify(jwt.verify);

module.exports = async (token) => {
	try {
		const verified = await jwtVerify(token, process.env.SECRET);
		return verified._id;
	} catch (err) {
		throw err;
	}
};
