const fs = require('fs').promises;
const path = require('path');
const { createReadStream } = require('fs');

const Player = require('../models/Player');

module.exports.get = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		const players = await Player.find(query);
		return res.json(players);
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};

module.exports.update = async function (req, res) {
	try {
		const { players, playersToRemove } = req.body;

		const updatePlayers = players.filter((el) => el._id);
		const newPlayers = players.filter((el) => !el._id);

		if (playersToRemove.length > 0) {
			await Player.deleteMany({ _id: { $in: playersToRemove } });
		}

		if (newPlayers.length > 0) {
			await Player.insertMany(newPlayers);
		}

		if (updatePlayers.length > 0) {
			for (const player of updatePlayers) {
				await Player.updateOne({ _id: player._id }, player);
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

module.exports.drop = async function (req, res) {
	try {
		const query = {
			...req.query,
		};
		await Player.deleteMany(query);
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
		const players = await Player.find(query, '-presence');
		let csvoutput = '';

		for (const player of players) {

			const csvArr = [];

			for (const key of Object.keys(player._doc)) {
				csvArr.push(player[key]);
			}
			csvoutput += `${csvArr.join(',')}\n`;
		}

		const buffer = new Buffer.from(csvoutput, 'binary');
		const CSVpath = path.join(__dirname, '../temp/players.csv');
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
		const { players } = req.body;
		console.log(players);

		await Player.insertMany(players);
		return res.end('Done!');
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Error',
			err: JSON.stringify(err),
		});
	}
};

module.exports.getById = async function (req, res) {
	try {
		const { id } = req.params;
		const player = await Player.findOne({ _id: id });
		return res.json(player);
	} catch (err) {
		return res.status(500).json({
			message: 'Error',
			err,
		});
	}
};
