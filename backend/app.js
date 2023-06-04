require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userRoutes = require('./routes/user');
const playerRoutes = require('./routes/player');
const ticketRoutes = require('./routes/ticket');
const qrRoutes = require('./routes/qr');

const isAdmin = require('./middleware/isAdmin');

app.use('/api/tickets', isAdmin);
app.use('/api/players', isAdmin);

app.use('/api', playerRoutes);
app.use('/api', ticketRoutes);
app.use('/api', userRoutes);
app.use('/api', qrRoutes);

app.get('/api', (req, res) => res.send('ok'));
if (process.env.DEV) {
	app.get('/', (req, res) => res.send('DEVMODE'));
}

module.exports = {
	app,
	http,
	static: express.static,
};
