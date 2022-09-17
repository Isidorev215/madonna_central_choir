
// These will be useful for the routes that after the database like put/post/delete requests
module.exports = {
  admin: function(req, res, next){
    if(!req.user.roles.includes('Admin')){
      let error = new Error('Access Denied')
      error.code = 403;
      next(error);
      return;
    }
    next();
  },
  user: function(req, res, next){
    if(!req.user.roles.inculdes('User')){
      let error = new Error('Access Denied')
      error.code = 403;
      next(error);
      return;
    }
    next();
  }
}
