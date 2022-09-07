const Admin = require('../models/AdminModel');
const Member = require('../models/MemberModel');


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
  let payload = req.body;
  let user;
  try {
    if(req.user?.isAdmin){
      user = await Admin.findById(req.user._id);
      Object.assign(user, payload);
    }else{
      user = await Member.findById(req.user._id);
      Object.assign(user, payload);
    }
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
