const sendMail = require("../../service/email/service");
const generateOtp = require("../../service/otp/service");
const userModel = require("../../model/user/user");
const bcrypt = require("bcrypt");

const signupRender = (req, res) => {
  try {
    res.render("user/signup");
  } catch (error) {}
};

const homePageRender = (req, res) => {
  try {
    res.render("user/homepage");
  } catch (error) {
    console.log(error);
  }
};
const loginRender = (req, res) => {
  try {
    res.render("user/login");
  } catch (error) {}
};


const loginController = async (req, res) => {

  console.log(req.body);


  try {
    const { email, password } = req.body;

    const isMailExist = await userModel.findOne({ email });

    if (!isMailExist) {
      return res
        .status(400)
        .json({ error: "email is not exist", type: "email" });
    }

    const isMatch = await bcrypt.compare(password, isMailExist.password);
    if (!isMatch) {
     return res.status(400).json({ error: "incorrect Password" });
    }

    if (isMailExist.isAdmin) {

      req.session.isAdmin = isMailExist;
     return res.status(200).json({redirecturl:'/admin/dashboard'})

    }
     req.session.user = isMailExist;
    res.status(200).json({redirecturl:'/home-page'})

  } catch (error) {
    res.status(500).json(error);
  }

};

const signupconteroller = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isMailExist = await userModel.findOne({ email });

    if (isMailExist) {
      throw new Error("email aready exist");
    }

    if (email) {
      const otp = generateOtp();
      sendMail(email, otp);
      console.log(otp, email);

      req.session.otpUsersData = {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        otp,
      };

      setTimeout(() => {
        req.session.otpUsersData.otp = null;
      }, 30000);

      res.status(200).json("success");


    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const resendOtp = (req, res) => {
  try {
    const resendOtp = generateOtp();
    const email = req.session.otpUsersData.email;
    sendMail(email, resendOtp);

    req.session.otpUsersData.otp = resendOtp;

    setTimeout(() => {
      req.session.otpUsersData.otp = null;
    }, 30000);

    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
};

const serveOtpController = (req, res) => {
  try {
    const email = req.session.otpUsersData.email;
    res.render("user/otpPage", { email });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const inputOtp = req.body.inputData;
    const recievedOtp = req.session.otpUsersData.otp;

    if (inputOtp == recievedOtp) {
      const { username, password, email } = req.session.otpUsersData;

      const users = await userModel.find({});

      const isFirstDoc = users.length == 0;

      const user = new userModel({
        username,
        password: password,
        email,
        isAdmin: isFirstDoc ? true : false,
      });
    

      await user.save();

      req.session.otpUsersData = null;
      req.session.user = user;
      res.status(200).json("success");
    }
  } catch (error) {
    console.log(error);

    res.status(500).json("error");
  }
};

module.exports = {
  signupRender,
  signupconteroller,
  serveOtpController,
  resendOtp,
  homePageRender,
  verifyOtpController,
  loginRender,
  loginController,
};
