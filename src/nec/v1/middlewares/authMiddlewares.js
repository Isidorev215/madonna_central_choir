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
      req.user = user;
      next();
    })(req, res, next);
  }
}
