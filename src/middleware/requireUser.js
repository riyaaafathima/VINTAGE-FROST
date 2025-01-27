const UserDB = require("../model/user/user");

const requireUser = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/login");
  }
};

const verifyUser = (req, res, next) => {
  if (req.session?.user) {
    return res.redirect("/home-page");
  } else if (req.session?.isAdmin) {
    return res.redirect("/admin/dashboard");
  }else {
    next();
  }
};

const isBlock = async (req, res, next) => {
  if (req.session?.user) {
    const exitUser = await UserDB.findOne({ _id: req.session?.user?._id });
    console.log("use", exitUser);

    if (!exitUser?.status) {
      return res.render("common/blockPage");
    } else {
      next();  
    }
  } else {   
    next();
  }
};

const isOtpUser = (req,res,next)=>{
  if(req.session?.otpUsersData){
    return res.redirect('/otp-page')
  }else{
    next()
  }
}
module.exports = { requireUser, verifyUser, isBlock ,isOtpUser};
