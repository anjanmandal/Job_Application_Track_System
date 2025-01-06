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
      notes,
      recruiters,
      alumni,
      dateApplied
    } = req.body;

    // If recruiters are provided as JSON in string form
    const recruitersData = recruiters ? JSON.parse(recruiters) : [];
    const alumniData = alumni ? JSON.parse(alumni) : [];

    let recruiterIds = [];
    for (const rec of recruitersData) {
      if (rec._id) {
        recruiterIds.push(rec._id);
      } else {
        const newRecruiter = new Recruiter(rec);
        await newRecruiter.save();
        recruiterIds.push(newRecruiter._id);
      }
    }

    let alumniIds = [];
    for (const al of alumniData) {
      if (al._id) {
        alumniIds.push(al._id);
      } else {
        const newAlumni = new Alumni(al);
        await newAlumni.save();
        alumniIds.push(newAlumni._id);
      }
    }
    const parsedDate = dateApplied ? new Date(dateApplied) : Date.now();

    const newApp = new Application({
      user: req.user._id,
      companyName,
      position,
      location,
      status,
      notes,
      recruiters: recruiterIds,
      alumni: alumniIds,
      resumePath: req.file ? req.file.path : null,
      dateApplied: parsedDate
    });

    await newApp.save();
    return res.status(201).json({ message: 'Application created', application: newApp });
  } catch (error) {
    console.error(error);
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
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (req.user.role === 'user' && app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      companyName,
      position,
      location,
      status,
      notes,
      recruiters,
      alumni
    } = req.body;

    if (companyName) app.companyName = companyName;
    if (position) app.position = position;
    if (location) app.location = location;
    if (status) app.status = status;
    if (notes) app.notes = notes;

    // handle new resume if uploaded
    if (req.file) {
      app.resumePath = req.file.path;
    }

    // recruiters
    if (recruiters) {
      const recData = JSON.parse(recruiters);
      let recruiterIds = [];
      for (const rec of recData) {
        if (rec._id) {
          // possibly update existing
          const existing = await Recruiter.findById(rec._id);
          if (existing) {
            existing.name = rec.name || existing.name;
            existing.email = rec.email || existing.email;
            existing.phone = rec.phone || existing.phone;
            existing.notes = rec.notes || existing.notes;
            await existing.save();
            recruiterIds.push(existing._id);
          }
        } else {
          const newRecruiter = new Recruiter(rec);
          await newRecruiter.save();
          recruiterIds.push(newRecruiter._id);
        }
      }
      app.recruiters = recruiterIds;
    }

    // alumni
    if (alumni) {
      const alData = JSON.parse(alumni);
      let alumniIds = [];
      for (const al of alData) {
        if (al._id) {
          const existingAl = await Alumni.findById(al._id);
          if (existingAl) {
            existingAl.name = al.name || existingAl.name;
            existingAl.email = al.email || existingAl.email;
            existingAl.link = al.link || existingAl.link;
            existingAl.notes = al.notes || existingAl.notes;
            await existingAl.save();
            alumniIds.push(existingAl._id);
          }
        } else {
          const newAlumni = new Alumni(al);
          await newAlumni.save();
          alumniIds.push(newAlumni._id);
        }
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
    await app.remove();
    return res.status(200).json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
