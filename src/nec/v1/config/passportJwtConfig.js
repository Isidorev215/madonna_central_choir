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

    let query = User.findById(payload.sub)
    query.select('-password')
    query.populate({ path: 'meetings.details', select: '-attendance', sort: { createdAt: -1 }, perDocumentLimit: 10 })
    query.populate({ path: 'dues.details', select: '-paid_members', sort: { createdAt: -1 }, perDocumentLimit: 10 })

    query.lean()

    let user = await query
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
