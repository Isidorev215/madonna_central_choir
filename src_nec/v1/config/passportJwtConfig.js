const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/UsersModel');

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
  issuer: process.env.JWT_ISSUER_BACKEND,
}

const strategy = new JwtStrategy(JwtOptions, async (payload, done) => {
  try {
    let user = await User.findById(payload.sub).select('-password').lean()
    if(user){
      return done(null, user);
    }else{
      // User id is not found in the database: User does not exist
      return done(null, false, { message: 'Invalid credentials'});
    }
  }catch(err){
    return done(err, false, { message: 'Initernal server error' })
  }
})

module.exports = (passport) => {
  passport.use(strategy)
}
