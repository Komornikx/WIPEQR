const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
	firstName: { type: String, required: () => this.registered },
	lastName: { type: String, required: () => this.registered },
	registered: {
		type: Boolean,
		default: false,
	},
	nick: { type: String },
	presence: [
		{
			from: { type: Date },
			to: { type: Date },
		},
	],
	type: { type: String, default: 'viewer', enum: ['viewer', 'honorable', 'vip'] },
});

module.exports = model('Ticket', ticketSchema);
