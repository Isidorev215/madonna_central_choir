const { Router } = require('express')
const router = Router();
const { ensureAuthentication } = require('../config/auth');
const baseController = require('../controllers/baseController');


router.get('/config', ensureAuthentication, baseController.getConfig)

module.exports = router;
