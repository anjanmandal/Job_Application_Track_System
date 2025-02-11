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


// CRUD routes
router.post('/', isUser, createApplication);
router.get('/', isUser, getApplications);
router.get('/:id', isUser, getApplicationById);
router.put('/:id', isUser,updateApplication);
router.delete('/:id', isUser, deleteApplication);

module.exports = router;
