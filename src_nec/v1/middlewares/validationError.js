const { validationResult } = require("express-validator");

module.exports = {
  handleValidationError: function(req, res, next){
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
    }else{
      next()
    }
  }
}
