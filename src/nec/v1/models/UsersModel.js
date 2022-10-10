const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Meeting = require('./MeetingsModel');
const Due = require('./DuesModel');

const churchSchema = new Schema({
  churchName: { type: String, default: null },
  denomination: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
})

const singleMeetingSchema = new Schema({
  details: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Meeting',
  },
  attended: { type: Boolean, default: false }
}, {timestamps: true})

const singleDueSchema = new Schema({
  details: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Due',
  },
  paid: { type: Boolean, default: false }
}, {timestamps: true})

const userSchema = new Schema({
  firstName: { type: String, required: true, },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, },
  isApproved: { type: Boolean, default: false },
  approvedAt: { type: Date, default: null },
  chapter: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: 'Nigeria' },
  occupation: { type: String, default: null },
  profileImage: { type: String, default: null },
  coverImage: { type: String, default: null },
  phone: { type: String, default: null },
  roles: {
    type: [String],
    enum: { values: ['Admin', 'User'], message: '{VALUE} is not a supported role'},
    default: ['User']
  },
  membersPosition: { type: String, default: 'Member' },
  church: {
    type: churchSchema,
    default: () => ({})
  },
  maritalStatus: {
    type: String,
    default: null,
    enum: { values: ['Single', 'Married', 'Clergy', null], message: '{VALUE} is not supported' },
  },
  campus: {
    type: String,
    default: null,
    enum: { values: ["Elele", "Akpugo", "Okija", null], message: '{VALUE} is not a campus'},
  },
  choirPart: {
    type: String,
    default: null,
    enum: { values: ["Soprano", "Alto", "Tenor", "Bass", null], message: '{VALUE} is not a valid choir part' },
  },
  birthday: { type: Date, default: null },
  meetings: {
    type: [singleMeetingSchema]
  },
  dues: {
    type: [singleDueSchema]
  },
  isRegularized: { type: Boolean, default: false },
  regularizedAt: { type: Date, default: null },
  graduatedAt: { type: Date, default: null },
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;
