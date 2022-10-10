const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./UsersModel');

const DueSchema = new Schema({
  epoch: { type: Boolean, default: false },
  due_type: {
    type: String,
    enum: { values:['Monthly', 'Extra'], message: '{VALUE} is not a supported due type'}
  },
  due_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  desc: { type: String, required: true },
  members_payment: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }]
  }
}, {timestamp: true})

const Due = mongoose.model('Due', DueSchema)
module.exports = Due;
