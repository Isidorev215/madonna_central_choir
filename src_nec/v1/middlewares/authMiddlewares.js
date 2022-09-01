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
      // We remove the hashed password so it is not in the front-end
      delete user.password;
      if(user.isAdmin){
        if(user.hasOwnProperty('pending_nec_members') && user.pending_nec_members.length > 0){
          user.pending_nec_members.forEach(member => {
            delete member.password;
          });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  }
}
