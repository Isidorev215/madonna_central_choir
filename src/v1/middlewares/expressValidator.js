const { body, validationResult, param, query } = require("express-validator");
const { isValidObjectId } = require('mongoose');

module.exports = {
  handleValidationError: function(req, res, next){
    // express-validatior error code
    const registrationErrorFormatter = ({ msg, param }) => {
      return `${msg}`;
      // return `${param}: ${msg}`;
    };
    const errors = validationResult(req).formatWith(registrationErrorFormatter);

    if (!errors.isEmpty()) {
      console.log(errors)
      const error = new Error("Invalid Form Fields");
      error.details = errors.array();
      error.code = 400;
      next(error);
      return;
    }else{
      next()
    }
  },
  UserLoginValidation: function(){
    return [
      body('email')
        .exists()
        .withMessage('Email is required'),
      body('password')
        .exists()
        .withMessage('Password is required')
    ]
  },
  UserRegistrationValidation: function(){
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
  },
  UpdateProfileValidation: function(){
    return [
      body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First Name must not be an empty string')
      .isString()
      .withMessage('First Name must be a string'),
      body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('must not be an empty string')
      .isString()
      .withMessage('Last Name must be a string'),
      body('occupation')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Occupation must not be an empty string')
      .isString()
      .withMessage('Occupation must be a string'),
      body('phone')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phone must not be an empty string')
      .isString()
      .withMessage('Phone must be a string'),
      body('state')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('State must not be an empty string')
      .isString()
      .withMessage('State must be a string'),
      body('country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country must not be an empty string')
      .isString()
      .withMessage('Country must be a string'),
      body('maritalStatus')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Marital Status must not be an empty string')
      .isString()
      .withMessage('Marital Status must be a string'),
      body('campus')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Campus must not be an empty string')
      .isString()
      .withMessage('Campus must be a string'),
      body('choirPart')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Choir Part must not be an empty string')
      .isString()
      .withMessage('Choir Part must be a string'),
      body('chapter')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Chapter must not be an empty string')
      .isString()
      .withMessage('Chapter must be a string'),
      body('graduatedAt')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Graduation Date must not be an empty string')
      .isISO8601()
      .withMessage('Graduation Date must be a valid date')
      .toDate(),
      body('birthday')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Birthday must not be an empty string')
      .isISO8601()
      .withMessage('Birthday must be a valid date')
      .toDate(),
      // Church is built different, it is an Object
      body('church')
      .optional()
      .isObject()
      .withMessage('Church must be an object'),
    ]
  },
  createPositionValidation: function(){
    return [
      body('name')
      .exists()
      .withMessage('The name of the position is required'),
      body('desc')
      .exists()
      .withMessage('Please give a short description of this positon'),
      body('allowedHolders')
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage('Allowed Holders must not be an empty value')
      .isInt({min: 1})
      .withMessage('Allowed holders should be a number greater than one (1)'),
      body('duties')
      .exists()
      .withMessage('Please define the duties of this position')
      .isArray({min: 1})
      .withMessage('Duties is an array of at least one duty')
    ]
  },
  getUsersValidation: function(){
    return [
      query('page')
      .optional()
      .isInt({min: 1})
      .withMessage('Page must be a number at least 1')
    ]
  },
  getSingleUserValidation: function(){
    return [
      param('user_id')
      .exists()
      .withMessage('user_id is required')
      .custom((value, { req }) => {
        if(!isValidObjectId(value)){
          throw new Error('user_id is required')
        }
        return true;
      })
    ]
  }
}
