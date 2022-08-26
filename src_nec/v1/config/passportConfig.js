const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { findUser, findUserbyId } = require('../models/UsersModel')();

module.exports = function(passport){
  passport.use(new localStrategy({ usernameField: 'email'}, (email, password, done) => {
    findUser({ email: email })
    .then(user => {
      if(!user){
        return done(null, false, { message: 'This email is not registered'});
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          // Password Incorrect
          return done(null, false, { message: 'Invalid Credentials'})
        }
      })
    })
    .catch(err => {
      return done(null, false, { message: 'Server Error' })
    })
  }))

  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}
