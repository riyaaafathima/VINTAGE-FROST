const sendMail = require("../../service/email/service");
const generateOtp = require("../../service/otp/service");
const userModel = require("../../model/user/user");
const bcrypt = require("bcrypt");
const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");
const { default: mongoose } = require("mongoose");

const signupRender = (req, res) => {
  try {
    res.render("user/signup");
  } catch (error) {}
};

const homePageRender = async (req, res) => {
  const allProducts = await productModel.find({});
  try {
    let user = null;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
    }

    res.render("user/homepage", { allProducts, user });
  } catch (error) { 
    console.log(error);
  }
};
const productPageRender = async (req, res) => {
  try {

    const { page = 1, category,minprice, maxprice } = req.query; 
    const currentPage = parseInt(page, 10) || 1;
    const limit = 9

    let filter = {isActive:true}

filter['varients.price'] = { $gte: 100, $lte: 7000 };

    if (category) {
    filter.category={$in:category}
    }
    if (minprice || maxprice) {
      filter['varients.price'] = {}; // Use dot notation to target price within the array
      if (minprice) filter['varients.price'].$gte = parseFloat(minprice);
      if (maxprice) filter['varients.price'].$lte = parseFloat(maxprice);
    }
   
    console.log(filter);
    
    
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const skip = (currentPage - 1) * limit;

    const allProducts = await productModel.find(filter).skip(skip).limit(limit);

    const categories = await categoryModel.find({isActive:true})

    let user = null;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
    }

    res.render("user/allProduct", { allProducts, totalPages, currentPage,totalProducts,categories, selectedCategory: category,user });

  } catch (error) {
    console.log(error);   
  }         
};

const productView = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.render("common/404");
    }

    const product = await productModel.findById(id).populate("category");

    const categoryId = product.category._id;
    const relatedProducts = await productModel.find({
      category: categoryId, // Match products with the same category
      _id: { $ne: id }, // Exclude the current product by its ID
    });

    console.log(relatedProducts);

    res.render("user/singleProduct", { product, relatedProducts });
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

      return res.status(200).json({ redirecturl: "/admin/dashboard" });
    }
    req.session.user = isMailExist;
    console.log(req.session);

    res.status(200).json({ redirecturl: "/home-page" });
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
    console.log(error);    
    res.status(500).json(error.message);
  }
};

// const validateOtp = (req, res) => {
//   try { 
//     const { inputData } = req.body; // The OTP entered by the user
//     const storedOtp = req.session.otpUsersData.otp;
//     const otpTimestamp = req.session.otpUsersData.otpTimestamp;

//     // Check if OTP exists and if it is expired (30 seconds timeout)
//     if (!storedOtp || Date.now() > otpTimestamp + 30000) {
//       return res.status(400).json("OTP expired or not generated");
//     }

//     // Check if OTP matches
//     if (inputData !== storedOtp) {
//       return res.status(400).json("Incorrect OTP");
//     }

//     // OTP is valid
//     req.session.otpUsersData.otp = null;  // Clear OTP after validation
//     res.status(200).json("OTP validated successfully");
//   } catch (error) {    
//     console.log(error);
//     res.status(500).json("Error validating OTP");
//   }
// };

const resendOtp = (req, res) => {
  try {
    const resendOtp = generateOtp();
    const email = req.session.otpUsersData.email;
    sendMail(email, resendOtp);

    req.session.otpUsersData.otp = resendOtp;
    req.session.otpUsersData.otpTimestamp = Date.now();  // Store the timestamp when OTP is generated
    console.log("New OTP", resendOtp);

    setTimeout(() => {
      req.session.otpUsersData.otp = null;  // Expire OTP after 30 seconds
    }, 30000);

    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
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

const logoutUser = (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/home-page");
  } catch (error) {}
};

module.exports = {
  logoutUser,
  signupRender,
  signupconteroller,
  serveOtpController,
  resendOtp,
  homePageRender,
  verifyOtpController,
  loginRender,
  loginController,
  productPageRender,
  productView,
};
