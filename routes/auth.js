const router = require('express').Router();
const passport = require('passport');

router.get('/google',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Initiate Google OAuth login'
  // #swagger.description = 'Redirects the user to Google for authentication.'
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Google OAuth callback'
  // #swagger.description = 'Google redirects here after authentication. Sets session cookie on success.'
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.status(200).json({
      message: 'Login successful',
      user: req.user
    });
  }
);

router.get('/logout',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log out the current user'
  (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged out successfully' });
    });
  }
);

router.get('/status',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Check authentication status'
  // #swagger.description = 'Returns whether the current session is authenticated and who is logged in.'
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ authenticated: true, user: req.user });
    } else {
      res.status(200).json({ authenticated: false });
    }
  }
);

module.exports = router;
