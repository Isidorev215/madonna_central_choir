const express = require("express");
const router = express.Router();
const { UserLoginValidation, UserRegistrationValidation } = require('../config/validationChains');
const { handleValidationError } = require('../middlewares/validationError');
const AuthController = require('../controllers/AuthController')




/**
 * @openapi
 * /api/v1/register:
 *   post:
 *     description: Registers user to the application
 *     tags:
 *       - Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             password_confirm:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                      type: string
 *                      example: User Successfully Added
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Error Detail 1", "Error Details 2"]
 */
router.post("/register", UserRegistrationValidation(), handleValidationError, AuthController.registration);

router.post('/login', UserLoginValidation(), handleValidationError, AuthController.login)

module.exports = router;
