const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const churchSchema = new Schema({
  churchName: { type: String, default: null },
  denomination: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
})

const memberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  chapter: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: 'Nigeria' },
  occupation: { type: String, default: null },
  profileImage: { type: String, default: null },
  phone: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  position: { type: String, default: 'Member' },
  church: {
    type: churchSchema,
    default: () => ({})
  },
  marital_status: {
    type: String,
    default: null,
    enum: { values: ['Single', 'Married', 'Clergy', null], message: '{value} is not supported' },
  },
  campus: {
    type: String,
    default: null,
    enum: { values: ["Elele", "Akpugo", "Okija", null], message: '{value} is not a campus'},
  },
  choirPart: {
    type: String,
    default: null,
    enum: { values: ["Soprano", "Alto", "Tenor", "Bass", null], message: '{value} is not a valid choir part' },
  },
  birthday: { type: Date, default: null },
  isCurrentOnDues: { type: Boolean, default: false },
  attendedLastMeeting: { type: Boolean, default: false },
  isRegularized: { type: Boolean, default: false },
  regularizedAt: { type: Date, default: null },
  graduatedAt: { type: Date, default: null },
},
{
  timestamps: true,
})

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
