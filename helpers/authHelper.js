module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
      req.flash("error_message", "Please login to continue");
      res.redirect("/login");
    }
  },
  isAlreadyLoggedIn: function(req,res,next) {
    if (req.isAuthenticated()) res.redirect("/ideas");
    else {
      next();
    }
  }
};
