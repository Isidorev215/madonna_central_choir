const passport = require("passport");

module.exports = {
  ensureJwtAuthentication: function(req, res, next){
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
      if(err) return next(err);
      if(!user){
        let error = new Error(info.message)
        error.code = 403;
        next(error);
        return;
      }
      // We remove the hashed password so it is not in the front-end
      delete user.password;
      req.user = user;
      next();
    })(req, res, next);
  }
}
