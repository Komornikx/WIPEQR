const { Schema, model } = require('mongoose');

const playerSchema = new Schema({
	id: { type: String, required: false },
	email: { type: String, required: false },
	firstName: { type: String, required: true },
	lastName: { type: String, required: false },
	nick: { type: String },
	team: { type: String, required: () => this.category === 'Liga' },
	presence: [
		{
			from: { type: Date },
			to: { type: Date },
		},
	],
	category: {
		type: String,
		required: true,
		enum: ['Liga', 'TFT', 'Fifa'],
	},
});

module.exports = model('Player', playerSchema);
