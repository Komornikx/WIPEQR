require('./backend/db');
require('./backend/index');
const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = serve({
	directory: path.join(__dirname, './.output/public'),
});

let win;

async function createWindow() {
	win = new BrowserWindow({
		width: 1600,
		height: 900,
		autoHideMenuBar: true,
		icon: path.join(__dirname, '/public/favicon.ico'),
		// frame: false,
		// titleBarStyle: 'hidden',
		// titleBarOverlay: {
		// 	color: '#2f3241',
		// 	symbolColor: '#74b1be',
		// height: 20,
		// width: 100,
		// },
		// transparent: true,
		// webPreferences: {
		// 	nodeIntegration: true,
		// 	contextIsolation: true,
		// 	worldSafeExecuteJavaScript: true,
		// 	enableRemoteModule: false,
		// preload: path.join(__dirname, 'preload.js'),
		// },
	});

	await loadURL(win);
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
