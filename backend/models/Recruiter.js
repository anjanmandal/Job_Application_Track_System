const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  notes: String,
  profileLink:String,
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
