const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  link: String,
  notes: String
});

module.exports = mongoose.model('Alumni', alumniSchema);
