const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const { createFirstUserAsAdmin, findUser } = require("../models/UsersModel")();


function UserLoginValidation(){
  return [
    body('email')
      .exists()
      .withMessage('Email is required'),
    body('password')
      .exists()
      .withMessage('Password is required')
  ]
}
function UserRegistrationValidation(){
  return [
    body("firstName")
    .exists()
    .withMessage("First name is required")
    .isString()
    .withMessage('First name must be a string')
    .notEmpty()
    .withMessage('First name must not be empty')
    .trim(),
  body("lastName")
    .exists()
    .withMessage("Last name is required")
    .isString()
    .withMessage('Last name must be a string')
    .notEmpty()
    .withMessage('Last name must not be empty')
    .trim(),
  body("email")
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage("Email provided is not valid")
    .normalizeEmail()
    .withMessage('Invalid Email'),
  body("password")
    .exists()
    .withMessage("Password field is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .trim(),
  body("password_confirm")
    .exists()
    .withMessage("Password Confirmation field is required")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]
}


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
router.post("/register", UserRegistrationValidation(), async (req, res, next) => {
  // express-validatior error code
  const registrationErrorFormatter = ({ msg, param }) => {
    return `${msg}`;
    // return `${param}: ${msg}`;
  };
  const errors = validationResult(req).formatWith(registrationErrorFormatter);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid Registration Fields");
    error.details = errors.array();
    error.code = 400;
    next(error);
    return;
  }

  // Create the user
  findUser({ email: req.body.email }).then((user) => {
    if (user) {
      const error = new Error("Email is already registered");
      error.code = 400;
      throw error;
    } else {

      // remove password_confirm
      delete req.body.password_confirm;

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;

          // set password as hashed value
          req.body.password = hash;
          // Save to db
          createFirstUserAsAdmin(req.body)
            .then((result) => {
              res.status(201).send({
                status: "OK",
                data: result,
              });
              return;
            })
            .catch((err) => {
              next(err);
              return;
            });
        });
      });
    }
  })
  .catch(err => {
    next(err);
    return;
  });
});

router.post('/login', UserLoginValidation(), (req, res, next) => {
  let{ email, password } = req.body;

  findUser({ email: email})
  .then(user => {
    if(!user){

      // check if user is awaiting approval..........................................
      findUser({ isAdmin: true })
      .then(admin => {
        if(!admin){
          let error = new Error('Admin account not created')
          error.code = 401
          next(error);
          return;
        }
        if(admin.hasOwnProperty('pending_nec_members')){
          let nec_member = admin?.pending_nec_members?.find(nec_member => nec_member.email == email)
          if(nec_member != undefined){
            let error = new Error('Please hold for admin approval')
            error.code = 401
            next(error);
            return;
          }else{
            // The provided email is not in the pending_nec_users
            let error = new Error('Invalid Credentials..')
            error.code = 401
            next(error);
            return;
          }
        }else{
          // No User has submitted registration ('Please submit registration)
          let error = new Error('Invalid Credentials...')
          error.code = 401
          next(error);
          return;
        }
      })
      .catch(err => {
        // internal server error from findingUser
        next(err);
        return;
      })
      return;
    }

    // Check the password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if(err) next(err);
      if(isMatch){
        // The only point were a user is sent. Create and issue the JWT
        // remember, JWT payload takes time in seconds. I am converting back to ms in the response
        const _id = user._id;
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
        const payload = {
          sub: _id,
          iat: Math.floor(Date.now() / 1000),
          exp: expiresIn,
          iss: process.env.JWT_ISSUER_BACKEND,
        }
        // const jwt = jsonwebtoken.sign(payload, process.env.RSA_PRIVATE_KEY, { expiresIn: expiriesIn, algorithm: 'RS256' });
        const jwt = jsonwebtoken.sign(payload, process.env.PASSPORT_SECRET);
        res.status(200).send({
          status: 'OK',
          data: {
            token: `Bearer ${jwt}`,
            expires: (expiresIn * 1000),
          }
        })
      }else{
        // Password Incorrect
        let error = new Error('Invalid Credentials')
        error.code = 401
        next(error);
        return;
      }
    })

  })
  .catch(err => {
    next(err);
    return;
  })

})

module.exports = router;
