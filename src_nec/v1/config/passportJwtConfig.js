const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { findUserById } = require('../models/dynamicUserModel')();

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
  issuer: process.env.JWT_ISSUER_BACKEND,
}

const strategy = new JwtStrategy(JwtOptions, (payload, done) => {
  findUserById(payload.role, payload.sub)
  .then(user => {
    if(user){
      return done(null, {...user, role: payload.role});
    }else{
      // User id is not found in the database: User does not exist
      return done(null, false, { message: 'Invalid credentials'});
    }
  })
  .catch(err => {
    done(err, false, { message: 'Internal server error.'});
  })
})

module.exports = (passport) => {
  passport.use(strategy)
}
