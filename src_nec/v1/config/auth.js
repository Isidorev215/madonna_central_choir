module.exports = {
  ensureAuthentication: function(req, res, next){
    if(req.isAuthenticated()){
      next();
      return;
    }
    let error = new Error('Authorization Error')
    error.code = 403;
    next(error);
    return;
  }
}
