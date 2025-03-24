const sendMail = require("../../service/email/service");
const generateOtp = require("../../service/otp/service");
const userModel = require("../../model/user/user");
const walletModel=require('../../model/user/wallet');
const counterModel=require('../../model/user/counter')
const cartModel=require('../../model/user/cart')
const bcrypt = require("bcrypt");


 async function earnedMoneyByREfer(userId) {
  try {
console.log("earnedMoneyByREfer called");

const reward = 500;


      const isWalletExists = await walletModel.findOne({ user: userId });

      let counter = await counterModel.findOne({
        model: "Wallet",
        field: "transaction_id",
      });

      if (counter) {
        counter.count += 1;
        await counter.save();
      } else {
        counter = await counterModel.create({
          model: "Wallet",
          field: "transaction_id",
        });
      }

      if (isWalletExists) {
        wallet = await walletModel.findByIdAndUpdate(isWalletExists._id, {
          $inc: {
            balance: +reward,
          },
          $push: {
            transaction: {
              transaction_id: counter.count + 1,
              amount: reward,
              type: "Credit",
              description: " referal link reward",
             
            },
          },
        });
      } else {
        wallet = await walletModel.create({
          user: userId,
          balance: reward,
          transaction: [
            {
              transaction_id: counter.count + 1,
              amount: reward,
              type: "Credit",
              description: "referal link Reward",
             
            },
          ],
        });
      }
    
  } catch (error) {
    
  }
  
}

const signupRender = (req, res) => {
  try {
    res.render("user/signup");
  } catch (error) {}
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

      return res.status(200).json({ redirecturl: "/admin/dashboard" });
    }
    req.session.user = isMailExist;

    res.status(200).json({ redirecturl: "/home-page" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const signupconteroller = async (req, res) => {
  try {
    const { username, email, password,isReferedUser } = req.body;

    const isMailExist = await userModel.findOne({ email });

    if (isMailExist) {
      throw new Error("email aready exist");
    }

    if (email) {
      const otp = generateOtp();
      const otpExpiry = Date.now() + 30000; // OTP expires in 30 seconds
      
      sendMail(email, otp);
      console.log(otp, email);

      req.session.otpUsersData = {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        otp,
        otpExpiry,
        isReferedUser
      };

      res.status(200).json("OTP sent to email. Expires in 30 seconds.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const resendOtp = (req, res) => {
  try {
    if (!req.session.otpUsersData) {
      return res.status(400).json("Session expired or no OTP request found.");
    }

    const resendOtp = generateOtp();
    const email = req.session.otpUsersData.email;

    // Send new OTP to email
    sendMail(email, resendOtp);

    // Update session with new OTP and timestamp
    req.session.otpUsersData.otp = resendOtp;
    req.session.otpUsersData.otpExpiry = Date.now() + 30000; // 30 seconds from now

    console.log("New OTP", resendOtp);

    res
      .status(200)
      .json("New OTP sent successfully. It expires in 30 seconds.");
  } catch (error) {
    console.log(error);
    res.status(500).json("An error occurred while resending OTP.");
  }
};

const serveOtpController = (req, res) => {
  try {
    const email = req.session?.otpUsersData?.email;
    res.render("user/otpPage", { email });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const inputOtp = req.body.inputData;
    const { otp, otpExpiry } = req.session.otpUsersData;

    if (Date.now() > otpExpiry) {
      throw new Error("OTP has expired. Please request a new one.");
    }
    console.log(inputOtp, otp);

    if (inputOtp != otp) {
      throw new Error("Invalid OTP");
    }

    if (inputOtp == otp) {
      const { username, password, email,isReferedUser } = req.session.otpUsersData;

      const users = await userModel.find({});

      const isFirstDoc = users.length == 0;

      const user = new userModel({
        username,
        password: password,
        email,
        isAdmin: isFirstDoc ? true : false,
      });

      user.referalLink = `http://localhost:4000/signup?userid=${user._id}`

      await user.save();

if(isReferedUser){

  earnedMoneyByREfer(isReferedUser)
}

      req.session.otpUsersData = null;
      req.session.user = user;

      res.status(200).json("success");
    }
  } catch (error) {
    console.log(error);

    res.status(400).json(error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/home-page");
  } catch (error) {}
};

const contactPageRender= async(req,res)=>{
  try {
     let user = null;
        let cartCount = 0;
        if (req.session?.user) {
          const id = req.session?.user?._id;
          user = await userModel.findById(id);
          user = user.username;
          const cart = await cartModel.findOne({ user: id });
          if (cart) {
            cartCount = cart.items.length;
          }
        }
    res.render('user/contactPage',{user,cartCount})
  } catch (error) {
    console.log();
    
  }
}

module.exports = {
  logoutUser,
  signupRender,
  signupconteroller,
  serveOtpController,
  resendOtp,
  verifyOtpController,
  loginRender,
  loginController,
  contactPageRender
};
