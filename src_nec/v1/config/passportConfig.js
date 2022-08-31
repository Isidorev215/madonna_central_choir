const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { findUser, findUserbyId } = require('../models/UsersModel')();

module.exports = function(passport){
  passport.use(new localStrategy({ usernameField: 'email'}, (email, password, done) => {
    findUser({ email: email })
    .then(user => {
      if(!user){

        // check if user is awaiting approval..........................................
        findUser({ isAdmin: true })
        .then(admin => {
          if(!admin){
           return done(null, false, { message: 'Admin account not created' })
          }
          if(admin.hasOwnProperty('pending_nec_members')){
            let nec_member = admin?.pending_nec_members?.find(nec_member => nec_member.email == email)
            if(nec_member != undefined){
              return done(null, false, { message: 'Please hold for admin approval' })
            }else{
              // The provided email is not in the pending_nec_users
              return done(null, false, { message: 'Invalid Credentials..' })
            }
          }else{
            // No User has submitted registration ('Please submit registration)
            return done(null, false, { message: 'Invalid Credentials..' })
          }
        })
        .catch(err => {
          return done(null, false, { message: 'Server Error.' })
        })
        // Check if user is awaiting approval...........................................

        // Email not registered
        // return done(null, false, { message: 'Invalid Credentials..'});
        return;
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          // The only point were a user is sent
          return done(null, user);
        }else{
          // Password Incorrect
          return done(null, false, { message: 'Invalid Credentials'})
        }
      })
    })
    .catch(err => {
      console.log(err)
      return done(null, false, { message: 'Server Error' })
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    findUserbyId(id)
    .then(user => {
      delete user.password;
      done(null, user);
    })
  })
}

