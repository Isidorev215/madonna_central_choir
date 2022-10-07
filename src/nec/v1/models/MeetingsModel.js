const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./UsersModel');

const meetingSchema = new Schema({
  epoch: { type: Boolean, default: false },
  venue: { type: String, required: true },
  desc: { type: String },
  scheduledDate: { type: Date, required: true },
  attendance: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }]
  },
}, {timestamp: true})

const Meeting = mongoose.model('Meeting', meetingSchema)
module.exports = Meeting;

