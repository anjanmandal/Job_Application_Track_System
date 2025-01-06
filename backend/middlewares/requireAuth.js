// server/middleware/requireAuth.js
const passport = require('passport');

/**
 * Custom middleware that uses passport-jwt to verify JWT in the HttpOnly cookie.
 */
const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Attach user to the request object
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = requireAuth;
