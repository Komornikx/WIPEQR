const QRCode = require('qrcode');
const AdmZip = require('adm-zip');
const fs = require('fs').promises;
const path = require('path');
const { createReadStream } = require('fs');

const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Player = require('../models/Player');

module.exports.get = async function (req, res) {
	try {
		const { id } = req.params;
		const user = await User.findOne({ _id: id });

		if (user) {
			return res.json(user);
		}

		const ticket = await Ticket.findOne({ _id: id });

		if (ticket) {
			return res.json(ticket);
		}

		const player = await Player.findOne({ _id: id });

		if (player) {
			return res.json(player);
		}

		return res.status(404).end('User/Ticket Not found');
	} catch (err) {
		return res.status(500).json({
			message: 'Unknown error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.generatePlayersQR = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		const players = await Player.find(query);
		const zip = new AdmZip();

		for (const player of players) {
			const QR = await QRCode.toDataURL(
				`http://${global.domain}:${global.port}/api/qr/scan/${player._id}`
			);
			const buffer = new Buffer.from(
				QR.replace('data:image/png;base64,', ''),
				'base64'
			);

			zip.addFile(
				`${`${player.firstName} ${player.lastName}` || player.nick}.png`,
				buffer
			);
		}

		const zipPath = path.join(
			__dirname,
			`../temp/${query.type || !query.registered ? 'unregistered' : 'registered'
			}QR.zip`
		);
		zip.writeZip(zipPath);
		createReadStream(zipPath).pipe(res);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.generateTicketsQR = async function (req, res) {
	try {
		const query = {
			...req.query,
		};

		const tickets = await Ticket.find(query);
		const zip = new AdmZip();

		for (const ticket of tickets) {
			const QR = await QRCode.toDataURL(
				`http://${global.domain}:${global.port}/api/qr/scan/${ticket._id}`
			);
			const buffer = new Buffer.from(
				QR.replace('data:image/png;base64,', ''),
				'base64'
			);

			zip.addFile(`${!ticket.firstName ? ticket._id : `${ticket.firstName} ${ticket.lastName}`}.png`, buffer);
		}
		const zipPath = path.join(
			__dirname,
			`../temp/${!query.registered ? 'unregistered' : 'registered'
			}viewersQR.zip`
		);
		zip.writeZip(zipPath);
		createReadStream(zipPath).pipe(res);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.generateUsersQR = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		const users = await User.find(query);
		const zip = new AdmZip();

		for (const user of users) {
			const QR = await QRCode.toDataURL(
				`http://${global.domain}:${global.port}/api/qr/scan/${user._id}`
			);
			const buffer = new Buffer.from(
				QR.replace('data:image/png;base64,', ''),
				'base64'
			);

			zip.addFile(`${user.login}.png`, buffer);
		}
		const zipPath = path.join(__dirname, '../temp/usersQR.zip');
		zip.writeZip(zipPath);
		createReadStream(zipPath).pipe(res);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.scan = async function (req, res) {
	try {
		const { id } = req.params;
		const ticket = await Ticket.findOne({ _id: id });
		const user = await User.findOne({ _id: id });
		const player = await Player.findOne({ _id: id });

		if (ticket?.registered || user || player) {

			// return res.json(ticket || user || player)
			return res.redirect(
				`http://${global.domain}:${process.env.DEV ? global.devNuxtPort : '80'
				}/qr/${ticket?._id || user?._id || player?._id}`
			);
		}

		if (!ticket) {
			return res.status(404).json({ message: 'User with that id not found' });
		}

		// return res.json(ticket || user || player)

		return res.redirect(
			`http://${global.domain}:${process.env.DEV ? global.devNuxtPort : '80'
			}/qr/${ticket._id}/rejestracja`
		);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.setPresence = async function (req, res) {
	try {
		const { id } = req.params;

		//todo refactor xdd...
		let player = await Player.findOne({ _id: id });
		let ticket = await Ticket.findOne({ _id: id });

		if (player) {
			const presencesToUpdate = player.presence.filter(
				(el) => !el.from || !el.to
			);

			if (presencesToUpdate.length <= 0) {
				player.presence.push({
					from: null,
					to: null,
				});
			}

			for (const presence of player.presence) {
				if (!presence.from && !presence.to) {
					presence.from = Date.now();
				} else if (presence.from && !presence.to) {
					presence.to = Date.now();
				}
			}
			await player.save();
		} else if (ticket) {

			const presencesToUpdate = ticket.presence.filter(
				(el) => !el.from || !el.to
			);

			if (presencesToUpdate.length <= 0) {
				ticket.presence.push({
					from: null,
					to: null,
				});
			}

			for (const presence of ticket.presence) {
				if (!presence.from && !presence.to) {
					presence.from = Date.now();
				} else if (presence.from && !presence.to) {
					presence.to = Date.now();
				}
			}
			await ticket.save();
		}


		res.end();
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};
