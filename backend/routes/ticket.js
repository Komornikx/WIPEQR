const { Router } = require('express');
const router = Router();

const controller = require('../controllers/ticket');

router.get('/tickets', controller.get);

router.post('/tickets', controller.add);

router.put('/tickets', controller.update);

router.delete('/tickets', controller.drop);

router.get('/tickets/csv', controller.export);

router.post('/tickets/csv', controller.import);

router.get('/tickets/:id', controller.getById);

router.put('/tickets/:id/register', controller.register);

module.exports = router;
