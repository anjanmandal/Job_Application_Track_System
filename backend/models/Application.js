const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  position: String,
  location: String,
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offered', 'Rejected', 'On Hold'],
    default: 'Applied'
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  applicationLink:{
    type:String,
    required:true
  },
  recruiters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter'
    }
  ],
  alumni: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni'
    }
  ],
  notes: String
});

module.exports = mongoose.model('Application', applicationSchema);
