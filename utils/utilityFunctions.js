const mongoose = require('mongoose');

module.exports = {
  // this accepts two arrays.
  checkReqIsInMatchedData: (required_array, provided_array) => {
    return provided_array.every(key => {
      return required_array.includes(key)
    })
  },
  handleMongooseError: (argError) => {
    if(argError){
      if(argError instanceof mongoose.Error.ValidationError){
        let details = [];
        for(field in argError.errors){
          details.push(argError.errors[field].properties.message)
        }
        const error = new Error(argError._message);
        error.details = details;
        error.code = 400;
        return error;
      }else if(argError.code && argError.code == 11000){
        const field = Object.keys(argError.keyValue)
        const error = new Error(`${argError.keyValue[field]} already exists`);
        error.code = 409;
        return error
      }else{
        return argError
      }
    }else{
      return argError
    }
  }
}
