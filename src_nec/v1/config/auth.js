module.exports = {
  ensureLocalAuthentication: function(req, res, next){
    if(req.isAuthenticated()){
      next();
      return;
    }
    let error = new Error('Please login to continue')
    error.code = 403;
    next(error);
    return;
    // if(!req.cookies[`connect.sid`]){
    //   let error = new Error('Please login to continue')
    //   error.code = 403;
    //   next(error);
    // }
    // next();
  }
}
