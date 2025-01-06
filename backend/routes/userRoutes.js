const express = require('express');
const passport = require('passport');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', passport.authenticate('local'), loginUser);

router.post('/logout', logoutUser);

router.get('/profile', getUserProfile);

module.exports = router;
