const bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/UsersModel');

const registration = async (req, res, next) => {
  try {
   const user = await User.findOne({email: req.body.email})
    if(user){
      const error = new Error('Email is already in use');
      error.code = 400;
      throw error;
    }

    // remove password_confirm and hash passsword
    // since express-validator has already used it
    delete req.body.password_confirm;
    const hash = await bcrypt.hash(req.body.password, 10)
    req.body.password = hash;

    const userCount = await User.estimatedDocumentCount({})
    if(userCount === 0){
      // The first user is created as the admin
      await User.create({
        ...req.body,
        roles: ['Admin', 'User'],
        isApproved: true
      })
      res.status(201).send({
        status: 'OK',
        data: {
          message: 'Admin Successfully Created'
        }
      })
    }else{
      // Any subsequent user is just a user
      await User.create(req.body)
      res.status(201).send({
        status: 'OK',
        data: {
          message: 'Member Created. Awaiting Approval'
        }
      })
    }
  }catch(error){
    next(error);
    return;
  }
}

const login = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    const anyAdmin = await User.findOne({}).in('roles', ['Admin'])
    if(!anyAdmin){
      let error = new Error('Admin account not created');
      error.code = 401;
      throw error;
    }

    const user = await User.findOne({ email: email })
    if(!user){
      let error = new Error('Invalid Credentials');
      error.code = 401;
      throw error;
    }
    if(user && user.isApproved === false){
      let error = new Error('Please hold for admin approval')
      error.code = 401;
      throw error;
    }

    // bcryt stuff and token issuance
    const isMatch = await bcrypt.compare(password, user.password)
    if(isMatch){
      const _id = user._id;
      const expiresIn = Math.floor(Date.now() / 1000) + (15 * 60 * 60);
      const payload = {
        sub: _id,
        iat: Math.floor(Date.now() / 1000),
        exp: expiresIn,
        iss: process.env.JWT_ISSUER_BACKEND,
      }

      const jwt = jsonwebtoken.sign(payload, process.env.PASSPORT_SECRET);
      res.status(200).send({
        status: 'OK',
        data: {
          token: `Bearer ${jwt}`,
          expires: (expiresIn * 1000),
          message: `${user.roles[0]} login`
        }
      })
    }else{
      // Password Incorrect
      let error = new Error('Invalid Credentials')
      error.code = 401;
      next(error);
      return;
    }

  }catch(error){
    next(error);
    return;
  }
}


module.exports = {
  registration,
  login
}
