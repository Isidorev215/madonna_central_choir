const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');
const { ensureJwtAuthentication } = require('../middlewares/authMiddlewares');
const { UpdateProfileValidation, handleValidationError } = require('../middlewares/expressValidator');


router.get('/config', ensureJwtAuthentication, baseController.getConfig)
router.put('/profile/update', ensureJwtAuthentication, UpdateProfileValidation(), handleValidationError, baseController.updateProfile)

module.exports = router;
