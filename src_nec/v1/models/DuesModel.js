const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./UsersModel');

const extraDueSchema = new Schema({
  epoch: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  desc: { type: String, required: true },
  duesDateFor: { type: Date, required: true },
  paid_members: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }]
  }
}, {timestamp: true})


const DueSchema = new Schema({
  amount: { type: Number, required: true },
  desc: { type: String, required: true },
  paid: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }]
  },
  extraDues : {
    type: [extraDueSchema]
  }
}, {timestamp: true})

const Due = mongoose.model('Due', DueSchema)
module.exports = Due;
