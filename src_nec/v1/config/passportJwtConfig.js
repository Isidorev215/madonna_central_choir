const fs = require('fs');
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { findUserbyId } = require('../models/UsersModel')();
// const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
// const RSA_PUBLIC_KEY = fs.readFileSync(pathToKey, 'utf-8');

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
  issuer: process.env.JWT_ISSUER_BACKEND,
  // algorithms: ['RS256']
}

const strategy = new JwtStrategy(JwtOptions, (payload, done) => {
  findUserbyId(payload.sub)
  .then(user => {
    if(user){
      return done(null, user);
    }else{
      // User id is not found in the database: User does not exist
      return done(null, false, { message: 'Invalid credentials.'});
    }
  })
  .catch(err => {
    done(err, false, { message: 'Internal server error.'});
  })
})

module.exports = (passport) => {
  passport.use(strategy)
}
