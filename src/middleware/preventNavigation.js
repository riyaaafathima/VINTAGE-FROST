const preventNavigation = (req, res, next) => {
    console.log(req.session);
  
    
  if (!req.session.isAdmin) {
      console.log('Redirecting to admin dashboard');
      return res.redirect('/login'); 
    }
  
  
    if (req.session.user) {
      console.log('Redirecting to home page');
      return res.redirect('/home-page'); 
    }
  
    // If neither admin nor user is logged in, proceed to the next middleware
    next();
  };     
  
  module.exports = preventNavigation;
  