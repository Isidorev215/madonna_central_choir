const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');

const { ensureLocalAuthentication } = require('../config/auth');


router.get('/config', ensureLocalAuthentication, baseController.getConfig)

module.exports = router;
