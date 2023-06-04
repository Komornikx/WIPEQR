const { Router } = require('express');
const router = Router();

const controller = require('../controllers/player');

router.get('/players', controller.get);

router.put('/players', controller.update);

router.delete('/players', controller.drop);

router.get('/players/csv', controller.export);

router.post('/players/csv', controller.import);

router.get('/players/:id', controller.getById);

module.exports = router;
