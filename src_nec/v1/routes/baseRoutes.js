const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');

const { ensureJwtAuthentication } = require('../middlewares/authMiddlewares');


router.get('/config', ensureJwtAuthentication, baseController.getConfig)

module.exports = router;
