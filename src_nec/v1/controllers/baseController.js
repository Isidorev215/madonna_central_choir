const { matchedData } = require('express-validator');
const User = require('../models/UsersModel');


// it is the controllers that communicate with the models
const getConfig = (req, res, next) => {
  res.send({
    status: 'OK',
    data: {
      ...req.user
    }
  })
}

const updateProfile = async (req, res, next) => {
  // matchedData so that only the fields defined in the validation chain are used
  const payload = matchedData(req, { locations: ['body'], includeOptionals: true });
  try {
    let user = await User.findById(req.user._id)
    Object.assign(user, payload);
    await user.save();
    res.status(200).send({
      status: 'OK',
      data: {
        message: 'Profile Updated Successfully'
      }
    })
  }catch(error){
    next(error);
    return;
  }
}

module.exports = {
  getConfig,
  updateProfile,
}
