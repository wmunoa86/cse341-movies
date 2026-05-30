const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: 'Unauthorized. Please log in via GET /auth/google to access this endpoint.'
  });
};

module.exports = { isAuthenticated };
