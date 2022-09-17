const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');
const { ensureJwtAuthentication } = require('../middlewares/authMiddlewares');
const { UpdateProfileValidation, handleValidationError, createPositionValidation } = require('../middlewares/expressValidator');


router.get('/config', ensureJwtAuthentication, baseController.getConfig)

router.get('/users', ensureJwtAuthentication, baseController.getUsers)

router.post('/create-position', createPositionValidation(), handleValidationError, baseController.createPosition)

router.put('/profile/update', ensureJwtAuthentication, UpdateProfileValidation(), handleValidationError, baseController.updateProfile)

module.exports = router;
