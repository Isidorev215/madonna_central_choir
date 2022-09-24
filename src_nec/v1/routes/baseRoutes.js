const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');
const { ensureJwtAuthentication } = require('../middlewares/authMiddlewares');
const { UpdateProfileValidation, handleValidationError, createPositionValidation, getUsersValidation, getSingleUserValidation } = require('../middlewares/expressValidator');
const { admin: isAdmin } = require('../middlewares/checkRole');


router.get('/config', ensureJwtAuthentication, baseController.getConfig)

router.get('/users', ensureJwtAuthentication, getUsersValidation(), handleValidationError, baseController.getUsers)

router.get('/user/:user_id', ensureJwtAuthentication, getSingleUserValidation(), handleValidationError, baseController.getSingleUser)

router.post('/create-position', ensureJwtAuthentication, isAdmin, createPositionValidation(), handleValidationError, baseController.createPosition)

router.put('/profile/update', ensureJwtAuthentication, UpdateProfileValidation(), handleValidationError, baseController.updateProfile)

module.exports = router;
