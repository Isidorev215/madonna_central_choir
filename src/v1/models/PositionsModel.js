const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./UsersModel');

const positonSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Postion name is required'],
    lowercase: true,
    default: 'Member',
    unique: true
  },
  desc: {
    type: String,
    required: [true, 'Please give a short description'],
    minLength: [10, 'Description must be at least 10 chars long'],
    maxLength: [255, 'Description must be at most 255 chars long'],
  },
  allowedHolders: {
    type: Schema.Types.Mixed,
    default: 'Non'
  },
  duties: {
    type: [{
      type: String,
      minLength: [10, 'Duties must be at least 10 chars long'],
      maxLength: [255, 'Duties must be at most 255 chars long'],
    }],
    required: [true, 'Position Duties is required'],
    validate: [(val) => val.length > 0, 'You must add at least one responsibility'],
    default: ['An ordinary member of the organization']
  },
  holders: {
    type: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }]
  }
}, {timestamps: true})

const Position = mongoose.model('Position', positonSchema);
module.exports = Position;
