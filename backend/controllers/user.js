const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const path = require('path')
const fs = require('fs').promises;
const { createReadStream } = require('fs');

const genSalt = promisify(bcrypt.genSalt);
const genHash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);
const sign = promisify(jwt.sign);

const User = require('../models/User');

const getIdFromToken = require('../utils/getIdFromToken');

module.exports.get = async function (req, res) {
	try {
		const users = await User.find({}, '-password');
		return res.json(users);
	} catch (err) {
		return res.status(500).json({
			message: 'Unknown error!',
		});
	}
};

module.exports.update = async function (req, res) {
	try {
		const { users, usersToRemove } = req.body;

		const updateUsers = users.filter((el) => el._id);
		const newUsers = users.filter((el) => !el._id);

		for (const user of newUsers) {
			const salt = await genSalt(5);
			user.password = await genHash(user.password, salt);
		}

		if (usersToRemove.length > 0) {
			await User.deleteMany({ _id: { $in: usersToRemove } });
		}

		if (newUsers.length > 0) {
			await User.insertMany(newUsers);
		}

		if (updateUsers.length > 0) {
			for (const user of updateUsers) {
				let oldData = await User.findOne({ _id: user._id })

				if (user.password) {
					const salt = await genSalt(5);
					oldData.password = await genHash(user.password, salt)
				}

				oldData.firstName = user.firstName
				oldData.lastName = user.lastName
				oldData.login = user.login
				oldData.type = user.type

				await oldData.save()
			}
		}

		return res.end('Done!');
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.me = async function (req, res) {
	try {
		const token = req.headers.authorization.replace(/^Bearer\s/, '');

		const _id = await getIdFromToken(token);

		const user = await User.findOne({ _id });
		if (!user) {
			return res.status(401).json({
				message: 'Unauthorized!',
			});
		}

		return res.json({
			_id: user._id,
			login: user.login,
			type: user.type,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Unknown error!',
		});
	}
};

module.exports.login = async function (req, res) {
	try {
		const { login, password } = req.body;

		const user = await User.findOne({ login });
		if (!user) {
			return res.status(401).json({
				message: 'Wrong login or password',
			});
		}
		const validPass = await compare(password, user.password);

		if (!validPass) {
			return res.status(401).json({
				message: 'Wrong login or password',
			});
		}

		const token = await sign(
			{ _id: user._id, login: user.login, type: user.type },
			process.env.SECRET
		);

		return res.json({
			user: {
				_id: user._id,
				login: user.login,
				type: user.type,
			},
			token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Unknown error!',
		});
	}
};

module.exports.register = async function (req, res) {
	try {
		const { firstName, lastName, login, password, type } = req.body;

		const salt = await genSalt(5);
		const hashedPass = await genHash(password, salt);

		await User.create({ firstName, lastName, login, password: hashedPass });
		return res.json({ message: 'Created!' });
	} catch (err) {
		return res.status(500).json({
			message: 'Unknown error!',
		});
	}
};

module.exports.export = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		const users = await User.find(query);
		let csvoutput = '';

		for (const user of users) {
			for (const key of Object.keys(user._doc)) {
				csvoutput += `${user[key]},`;
			}
			csvoutput += '\n';
		}

		const buffer = new Buffer.from(csvoutput, 'binary');
		const CSVpath = path.join(__dirname, '../temp/users.csv');
		await fs.writeFile(CSVpath, buffer);

		createReadStream(CSVpath).pipe(res);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};