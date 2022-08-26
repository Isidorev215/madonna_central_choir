const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { createFirstUserAsAdmin, findUser } = require("../models/UsersModel")();

router.post(
  "/register",
  body("email", "Email field is required")
    .isEmail()
    .withMessage("Email provided is not valid")
    .normalizeEmail(),
  body("password", "Password field is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .trim(),
  body("password_confirm", "Password Confirmation field is required")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  async (req, res, next) => {
    // express-validatior code
    const registrationErrorFormatter = ({ msg, param }) => {
      return `${param}: ${msg}`;
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
        // create user Object
        const newUser = {
          email: req.body.email,
          password: req.body.password,
        };

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // set password as hashed value
            newUser.password = hash;
            // Save to db
            createFirstUserAsAdmin(newUser)
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
    });
  }
);

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if(err){ return next(err); }
      if(!user){
        const error = new Error(info.message)
        error.code = 401;
        return next(error)
      }
      res.status(201).send({
        status: "OK",
        data: {
          message: 'Login Successful'
        },
      })
  })(req, res, next);
})

module.exports = router;
