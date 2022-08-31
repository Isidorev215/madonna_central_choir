const passport = require("passport");

module.exports = {
  ensureJwtAuthentication: function(req, res, next){
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
      if(err) return next(err);
      if(!user){
        let error = new Error(info)
        error.code = 403;
        next(error);
        return;
      }
      next();
    })(req, res, next);
  }
}
