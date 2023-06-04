require('dotenv').config();
const path = require('path');
// const { loadNuxt, build } = require('nuxt');
const { http, app, static } = require('./app.js');
const os = require('os');

// const nuxtConfig = require('../nuxt.config');

const dev = process.env.DEV === 'true';
const electron = process.env.ELECTRON === 'true';

global.domain = os.hostname();
global.port = process.env.PORT || 3010;
global.devNuxtPort = process.env.NUXTPORT || 3000;

(async () => {
	http.listen(global.port, (err) => {
		// console.log(this.address().port);
		if (err) {
			return console.log(err);
		}
		console.log(`Server listening at: http://${global.domain}:${global.port}`);
	});
})();
