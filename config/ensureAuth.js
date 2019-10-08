module.exports = {
  ensureAuthLogin: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/home');
    } else {
      return next();
    }
  },
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Please login first');
      res.redirect('/')
    }
  }
};
