const mongoose = require('mongoose');
const { promisify } = require('util');
const bcrypt = require('bcrypt');

const genSalt = promisify(bcrypt.genSalt);
const genHash = promisify(bcrypt.hash);

const User = require('./models/User');

mongoose.set('strictQuery', false);
const URI = 'mongodb://127.0.0.1:27017/WIPEQR';

mongoose.connect(URI);

const db = mongoose.connection;

db.once('open', async () => {
	const user = await User.find({ type: 'admin' });
	if (user.length <= 0) {
		const salt = await genSalt(5);
		const hash = await genHash(process.env.ADMIN_PASSWORD, salt);

		await User.create({
			firstName: 'stah',
			lastName: 'stah',
			login: process.env.ADMIN_LOGIN,
			password: hash,
			type: 'admin',
		});
		console.log('created default account');
	}

	console.log('connected with mongoDB');
});
db.on('error', (err) => console.error(err));
