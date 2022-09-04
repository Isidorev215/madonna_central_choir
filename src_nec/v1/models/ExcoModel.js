const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excoSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  isExco: { type: Boolean, default: true },
  pending_nec_members: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Member'
  }
}, { timestamps: true })

const Exco = mongoose.model('Exco', excoSchema);
module.exports = Exco;
