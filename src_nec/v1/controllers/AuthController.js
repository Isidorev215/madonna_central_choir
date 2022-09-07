const bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');
const Admin = require('../models/AdminModel');
const Member = require('../models/MemberModel');

const registration = async (req, res, next) => {
  try {
   const admin = await Admin.findOne({email: req.body.email})
   const member = await Member.findOne({email: req.body.email})
    if(admin || member){
      const error = new Error('Email is already in use');
      error.code = 400;
      throw error;
    }

    // remove password_confirm and hash passsword
    delete req.body.password_confirm;
    const hash = await bcrypt.hash(req.body.password, 10)
    req.body.password = hash;

    const adminCount = await Admin.estimatedDocumentCount({})
    if(adminCount === 0){
      await Admin.create(req.body)
      res.status(201).send({
        status: 'OK',
        data: {
          message: 'Admin Successfully Created'
        }
      })
    }else{
      const createdMember = await Member.create(req.body)
      await Admin.updateMany({}, { $push: { pending_nec_members: createdMember._id }}, { runValidators: true })
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
  let{ email, password } = req.body;

  let user_found = {};
  try {
    const anyadmin = await Admin.findOne()
    if(!anyadmin){
      let error = new Error('Admin account not created');
      error.code = 401;
      throw error;
    }else{
      const admin = await Admin.findOne({ email: email })
      if(admin){
        user_found.user = admin;
        user_found.role = 'admins';
      }else{
        const member = await Member.findOne({ email: email })
        if(!member){
          let error = new Error('Invalid credentials');
          error.code = 401;
          throw error;
        }
        if(member && member.isApproved === false){
          let error = new Error('Please hold for admin approval')
          error.code = 401;
          throw error;
        }
        user_found.user = member;
        user_found.role = 'members';
      }
    }

    // bcryt stuff and token issuance
    const isMatch = await bcrypt.compare(password, user_found.user.password)
    if(isMatch){
      const _id = user_found.user._id;
      const role = user_found.role;
      const expiresIn = Math.floor(Date.now() / 1000) + (5 * 60 * 60);
      const payload = {
        sub: _id,
        role: role,
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
          message: `Logged in as ${user_found.role.replace(/[s]$/, '')}`
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
