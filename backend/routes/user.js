const { Router } = require('express');
const router = Router();

const controller = require('../controllers/user');

const isAdmin = require('../middleware/isAdmin');

router.get('/users', isAdmin, controller.get);

router.put('/users', isAdmin, controller.update);

router.get('/users/csv', isAdmin, controller.export);

//todo maybe isLoggedIn middleware
router.get('/me', controller.me);

router.post('/login', controller.login);

router.post('/register', isAdmin, controller.register);


module.exports = router;
