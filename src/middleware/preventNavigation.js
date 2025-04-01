const preventNavigation = (req, res, next) => {
  if (req.session.isAdmin) {
    // If neither admin nor user is logged in, proceed to the next middleware
    next();
    return;
  }

  if (req.session.user) {
    return res.redirect("/");
  }
  return res.redirect("/login");
};

module.exports = preventNavigation;
   