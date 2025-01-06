const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // Check if user already exists by username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with that username or email already exists.'
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      role
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

exports.loginUser = (req, res) => {
  // Passport local strategy will have already authenticated user
  return res
    .status(200)
    .json({ message: 'Logged in successfully.', user: req.user });
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error.', error: err });
    }
    return res.status(200).json({ message: 'Logged out successfully.' });
  });
};

exports.getUserProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.status(200).json({ user: req.user });
};
