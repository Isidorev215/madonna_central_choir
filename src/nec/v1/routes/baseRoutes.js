const { Router } = require('express')
const router = Router();
const baseController = require('../controllers/baseController');
const { ensureJwtAuthentication } = require('../middlewares/authMiddlewares');
const {
  UpdateProfileValidation,
  handleValidationError,
  createPositionValidation,
  editPositionValidation,
  editPositionHoldersValidation,
  getUsersValidation,
  getSingleUserValidation,
  updateUserStatusValidation } = require('../middlewares/expressValidator');
const { admin: isAdmin } = require('../middlewares/checkRole');


router.get('/config', ensureJwtAuthentication, baseController.getConfig)

router.get('/users', ensureJwtAuthentication, getUsersValidation(), handleValidationError, baseController.getUsers)

router.get('/user/:user_id', ensureJwtAuthentication, getSingleUserValidation(), handleValidationError, baseController.getSingleUser)

router.post('/create-position', ensureJwtAuthentication, isAdmin, createPositionValidation(), handleValidationError, baseController.createPosition)

router.put('/edit-position/:position_id', ensureJwtAuthentication, isAdmin, editPositionValidation(), handleValidationError, baseController.editPosition)

router.put('/edit-position-holders/:position_id', ensureJwtAuthentication, isAdmin, editPositionHoldersValidation(), handleValidationError, baseController.editPositionHolders)

router.put('/profile/update', ensureJwtAuthentication, UpdateProfileValidation(), handleValidationError, baseController.updateProfile)

router.put('/update-user-status/:user_id', ensureJwtAuthentication, isAdmin, updateUserStatusValidation(), handleValidationError, baseController.updateUserStatus)

module.exports = router;
