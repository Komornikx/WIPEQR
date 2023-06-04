const { Router } = require('express');
const router = Router();

const controller = require('../controllers/qr');

const isAdmin = require('../middleware/isAdmin');
const isScaner = require('../middleware/isScaner');

router.get('/qr/users', isAdmin, controller.generateUsersQR);

router.get('/qr/players', isAdmin, controller.generatePlayersQR);

router.get('/qr/tickets', isAdmin, controller.generateTicketsQR);

router.get('/qr/scan/:id', controller.scan);

router.post('/qr/presence/:id', isScaner, controller.setPresence);

router.get('/qr/:id', isScaner, controller.get);

module.exports = router;
