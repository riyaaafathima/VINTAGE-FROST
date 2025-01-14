const preventNavigation = (req, res, next) => {
    console.log(req.session);
  
    // Check if the user is logged in as an admin
    if (req.session.isAdmin) {
      console.log('Redirecting to admin dashboard');
      return res.redirect('/admin/dashboard'); // Ensure return after redirect
    }
  
    // Check if the user is logged in
    if (req.session.user) {
      console.log('Redirecting to home page');
      return res.redirect('/home-page'); // Ensure return after redirect
    }
  
    // If neither admin nor user is logged in, proceed to the next middleware
    next();
  };
  
  module.exports = preventNavigation;
  