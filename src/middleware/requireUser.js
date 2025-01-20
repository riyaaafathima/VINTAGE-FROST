const UserDB = require("../model/user/user");

const requireUser = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/login");
  }
};

const verifyUser = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    return res.redirect("/home-page");
  }
};

const isBock = async (req, res,next) => {
  if (req.session?.user) {
    const exitUser = await UserDB.findOne({ _id: req.session?.user?._id });
console.log("use",exitUser);

    if (!exitUser?.status) {
      return res.render("common/blockPage");
    } else {
      next();
    }
  } else {
    next(); 
  }
};
module.exports = { requireUser, verifyUser, isBock };
