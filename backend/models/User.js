const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	login: { type: String, required: true },
	password: { type: String, required: true },
	type: {
		type: String,
		enum: ['admin', 'normal'],
	},
});

module.exports = model('user', userSchema);
