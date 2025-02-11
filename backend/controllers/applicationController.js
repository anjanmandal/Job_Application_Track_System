const path = require('path');
const Application = require('../models/Application');
const Recruiter = require('../models/Recruiter');
const Alumni = require('../models/Alumni');

exports.createApplication = async (req, res) => {
  try {
    const { 
      companyName, 
      position, 
      location, 
      status, 
      dateApplied, 
      notes, 
      recruiters, 
      alumni,
      applicationLink
    } = req.body;

    // 1) Validate required basic info
    if (!companyName || !position || !location || !status || !dateApplied ||!applicationLink) {
      return res.status(400).json({
        message: 'companyName, position, location, status, and dateApplied are required.'
      });
    }

    // 2) Parse recruiters/alumni if they are JSON strings
    let parsedRecruiters = [];
    if (recruiters) {
      if (typeof recruiters === 'string') {
        try {
          parsedRecruiters = JSON.parse(recruiters);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid recruiters data.' });
        }
      } else {
        parsedRecruiters = recruiters;
      }
    }

    let parsedAlumni = [];
    if (alumni) {
      if (typeof alumni === 'string') {
        try {
          parsedAlumni = JSON.parse(alumni);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid alumni data.' });
        }
      } else {
        parsedAlumni = alumni;
      }
    }

    // 3) Validate recruiter/alumni entries if they exist
    for (let i = 0; i < parsedRecruiters.length; i++) {
      if (!parsedRecruiters[i].name?.trim()) {
        return res.status(400).json({
          message: 'Recruiter name is required if recruiter is added.'
        });
      }
    }

    for (let i = 0; i < parsedAlumni.length; i++) {
      if (!parsedAlumni[i].name?.trim()) {
        return res.status(400).json({
          message: 'Alumni name is required if alumni is added.'
        });
      }
    }

    // 4) Create recruiters and alumni if they do not exist
    let recruiterIds = [];
    for (const rec of parsedRecruiters) {
      let recruiter = await Recruiter.findOne({ email: rec.email });
      if (!recruiter) {
        // Create new recruiter if not found
        recruiter = new Recruiter(rec);
        await recruiter.save();
      }
      recruiterIds.push(recruiter._id);
    }

    let alumniIds = [];
    for (const al of parsedAlumni) {
      let alumnus = await Alumni.findOne({ email: al.email });
      if (!alumnus) {
        // Create new alumnus if not found
        alumnus = new Alumni(al);
        await alumnus.save();
      }
      alumniIds.push(alumnus._id);
    }

    // 5) Create application in DB
    const newApplication = {
      user: req.user._id,
      companyName,
      position,
      location,
      status,
      dateApplied,
      notes,
      applicationLink,
      recruiters: recruiterIds,
      alumni: alumniIds
    };

    const savedApp = await Application.create(newApplication);
    return res.status(201).json(savedApp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplications = async (req, res) => {
  try {
    // If admin, get all. If user, get only their apps
    let query = {};
    if (req.user.role === 'user') {
      query.user = req.user._id;
    }
    const apps = await Application.find(query)
      .populate('recruiters')
      .populate('alumni')
      .sort({ dateApplied: -1 });
    return res.status(200).json(apps);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('recruiters')
      .populate('alumni');
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // If user is not admin, ensure ownership
    if (req.user.role === 'user' && app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.role === 'user' && app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      companyName,
      position,
      location,
      status,
      dateApplied,
      notes,
      applicationLink,
      recruiters,
      alumni
    } = req.body;

    // 4) Validate required fields
    if (!companyName || !position || !location || !status || !dateApplied) {
      return res.status(400).json({
        message: 'companyName, position, location, status, and dateApplied are required.'
      });
    }

    // 5) Handle recruiter and alumni validations
    if (recruiters) {
      let recData = [];
      if (typeof recruiters === 'string') {
        if (recruiters.trim() !== '') {
          try {
            recData = JSON.parse(recruiters);
          } catch (e) {
            return res.status(400).json({ message: 'Invalid recruiters JSON.' });
          }
        }
      } else if (Array.isArray(recruiters)) {
        recData = recruiters;
      }

      if (recData.length > 0) {
        for (const rec of recData) {
          if (!rec.name?.trim()) {
            return res.status(400).json({ message: 'Recruiter name is required if recruiter is added.' });
          }
        }
      }
    }

    if (alumni) {
      let alData = [];
      if (typeof alumni === 'string') {
        if (alumni.trim() !== '') {
          try {
            alData = JSON.parse(alumni);
          } catch (e) {
            return res.status(400).json({ message: 'Invalid alumni JSON.' });
          }
        }
      } else if (Array.isArray(alumni)) {
        alData = alumni;
      }

      if (alData.length > 0) {
        for (const al of alData) {
          if (!al.name?.trim()) {
            return res.status(400).json({ message: 'Alumni name is required if alumni is added.' });
          }
        }
      }
    }

    // Update the application fields
    app.companyName = companyName;
    app.position = position;
    app.location = location;
    app.status = status;
    app.dateApplied = dateApplied;
    app.applicationLink=applicationLink;
    app.notes = notes;

    // Handle recruiters and alumni
    if (recruiters) {
      let recruiterIds = [];
      for (const rec of recruiters) {
        let recruiter = await Recruiter.findOne({ email: rec.email });
        if (!recruiter) {
          recruiter = new Recruiter(rec);
          await recruiter.save();
        }
        recruiterIds.push(recruiter._id);
      }
      app.recruiters = recruiterIds;
    }

    if (alumni) {
      let alumniIds = [];
      for (const al of alumni) {
        let alumnus = await Alumni.findOne({ email: al.email });
        if (!alumnus) {
          alumnus = new Alumni(al);
          await alumnus.save();
        }
        alumniIds.push(alumnus._id);
      }
      app.alumni = alumniIds;
    }

    await app.save();
    return res.status(200).json({ message: 'Application updated', application: app });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Application.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
