const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isUser } = require('../middlewares/roleMiddleware');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// CRUD routes
router.post('/', isUser, upload.single('resume'), createApplication);
router.get('/', isUser, getApplications);
router.get('/:id', isUser, getApplicationById);
router.put('/:id', isUser, upload.single('resume'), updateApplication);
router.delete('/:id', isUser, deleteApplication);

module.exports = router;
