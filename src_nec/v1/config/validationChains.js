const { body } = require("express-validator");

module.exports = {
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
}
