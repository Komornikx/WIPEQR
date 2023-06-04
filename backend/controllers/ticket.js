const fs = require('fs').promises;
const path = require('path');
const { createReadStream } = require('fs');

const Ticket = require('../models/Ticket');

module.exports.get = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		const tickets = await Ticket.find(query);
		return res.json(tickets);
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.add = async function (req, res) {
	try {
		const { amount } = req.body;
		for (let i = 0; i < amount; i++) {
			await Ticket.create({ registered: false, type: 'viewer' });
		}
		return res.send('Done!');
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.update = async function (req, res) {
	try {
		const { tickets, ticketsToRemove } = req.body;

		const updateTickets = tickets.filter((el) => el._id);
		const newTickets = tickets
			.filter((el) => !el._id)
			.map((el) => {
				el.registered = true;
				return el;
			});

		if (ticketsToRemove.length > 0) {
			await Ticket.deleteMany({ _id: { $in: ticketsToRemove } });
		}

		if (newTickets.length > 0) {
			await Ticket.insertMany(newTickets);
		}

		if (updateTickets.length > 0) {
			for (const ticket of updateTickets) {
				await Ticket.updateOne({ _id: ticket._id }, ticket);
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
	a;
};

module.exports.drop = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		await Ticket.deleteMany(query);
		return res.end('Done!');
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.export = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		console.log(query)
		const tickets = await Ticket.find(query);
		let csvoutput = '';

		for (const ticket of tickets) {
			for (const key of Object.keys(ticket._doc)) {
				csvoutput += `${ticket[key]},`;
			}
			csvoutput += '\n';
		}

		const buffer = new Buffer.from(csvoutput, 'binary');
		const CSVpath = path.join(__dirname, '../temp/tickets.csv');
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

module.exports.import = async function (req, res) {
	try {
		const { tickets } = req.body;
		console.log(tickets);
		await Ticket.insertMany(tickets);
		return res.end('Done!');
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.getById = async function (req, res) {
	try {
		const { id } = req.params;
		const ticket = await Ticket.findOne({ _id: id });
		return res.json(ticket);
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.register = async function (req, res) {
	const { id } = req.params;
	const { firstName, lastName } = req.body;
	try {
		await Ticket.findOneAndUpdate(
			{ _id: id },
			{ firstName, lastName, registered: true }
		);

		return res.redirect(`http://${global.domain}:3000/qr/${id}`);
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};
