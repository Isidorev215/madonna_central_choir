const { matchedData } = require('express-validator');
const User = require('../models/UsersModel');
const Position = require('../models/PositionsModel');
const { checkReqIsInMatchedData, handleMongooseError } = require('../../../../utils/utilityFunctions');


// it is the controllers that communicate with the models
const getConfig = async (req, res, next) => {
  try {
    let position_query = Position.find()
    position_query.populate({ path: 'holders', select: '_id firstName lastName'})

    const positions = await position_query
    res.send({
      status: 'OK',
      data: {
        ...req.user,
        positions
      }
    })
  }catch(error){
    next(handleMongooseError(error))
    return;
  }
}


const updateProfile = async (req, res, next) => {
  // get the fields defined in the validation chain and make sure req.body has no foreigner
  const definedOnValidationChain = matchedData(req, { locations: ['body'], includeOptionals: true });
  const definedOnValidationChainKeys = Object.keys(definedOnValidationChain);
  const requestBodyKeys = Object.keys(req.body);


  try {
    if(!checkReqIsInMatchedData(definedOnValidationChainKeys, requestBodyKeys)){
      // Something fishy. Fields in req.body are not in the matchedData for the express-validator
      const error = new Error('Invalid form fields');
      error.code = 400;
      throw error;
    }

    // database action
    let user = await User.findById(req.user._id)
    Object.assign(user, req.body);
    await user.save();
    res.status(200).send({
      status: 'OK',
      data: {
        message: 'Profile Updated Successfully'
      }
    })
  }catch(error){
    next(handleMongooseError(error));
    return;
  }
}

const getUsers = async (req, res, next) => {
  const page = req.query.page || 1;
  const usersPerpage = 10;
  let query;
  if(req.user.roles.includes('Admin')){
    query = User.find({}).select('-password')
  }else{
    query = User.find({}).select('-password -email -isApproved -roles -isCurrentOnDues -attendedLastMeeting -isRegularized -regularizedAt')
  }

  try {
    let usersCount = await User.estimatedDocumentCount()
    let docs = await query
    .limit(usersPerpage)
    .skip(usersPerpage * (page - 1))

    res.status(200).send({
      status: 'OK',
      data: {
        total: usersCount,
        perPage: usersPerpage,
        data: docs,
        currentPage: page || 1
      }
    })
  }catch(error){
    next(handleMongooseError(error));
    return;
  }
}

const getSingleUser = async (req, res, next) => {
  const user_id = req.params.user_id;

  let query;
  if(req.user.roles.includes('Admin')){
    query = User.findById(user_id).select('-password')
  }else{
    query = User.findById(user_id).select('-password -email -isApproved -roles -isCurrentOnDues -attendedLastMeeting -isRegularized -regularizedAt')
  }

  try{

    query.populate({ path: 'meetings.details', select: '-attendance', sort: { createdAt: -1 }, perDocumentLimit: 10 })
    query.populate({ path: 'dues.details', select: '-paid_members', sort: { createdAt: -1 }, perDocumentLimit: 10 })

    query.lean()

    let user = await query;
    res.status(200).send({
      status: 'OK',
      data: user
    })
  }catch(error){
    next(handleMongooseError(error));
    return;
  }
}

const createPosition = async (req, res, next) => {
  const payload = req.body;
  try {
    const positionToSave = new Position(payload);

    const position = await positionToSave.save()
    res.status(201).send({
      status: 'OK',
      data: {
        message: `${position.name} created successfully`
      }
    })
  }catch(error){
    next(handleMongooseError(error));
    return;
  }
}

const editPosition = async (req, res, next) => {
  // get the fields defined in the validation chain and make sure req.body has no foreigner
  const definedOnValidationChain = matchedData(req, { locations: ['body'], includeOptionals: true });
  const definedOnValidationChainKeys = Object.keys(definedOnValidationChain);
  const requestBodyKeys = Object.keys(req.body);

  try{
    if(!checkReqIsInMatchedData(definedOnValidationChainKeys, requestBodyKeys)){
      // something is fishy with the req.body
      const error = new Error('Invalid form fields');
      error.code = 400;
      throw error;
    }


    // database action
    let position = await Position.findById(req.params.position_id)
    // check position holders array
    if(Number(position.allowedHolders) !== 0 && req.body.holders.length > Number(position.allowedHolders) ){
      const error = new Error(`This position only allows ${Number(position.allowedHolders)} user(s)`);
      error.code = 400;
      throw error;
    }

    // push new positions


    Object.assign(position, req.body);
    await position.save();
    res.status(200).send({
      status: 'OK',
      data: {
        message: 'Position Updated Successfully'
      }
    })
  }catch(error){
    return next(handleMongooseError(error));
  }
}

module.exports = {
  getConfig,
  updateProfile,
  getUsers,
  getSingleUser,
  createPosition,
  editPosition
}
