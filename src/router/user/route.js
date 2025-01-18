const {
  signupRender,
  signupconteroller,
  serveOtpController,
  homePageRender,
  verifyOtpController,
  loginRender,
  loginController,
  resendOtp,
  productPageRender,
  productView
} = require("../../controller/user/controller");
const preventNavigation = require("../../middleware/preventNavigation");


const router = require("express").Router();

router.get("/home-page", homePageRender);

//authentication route//
router.get("/signup",preventNavigation, signupRender);
router.post("/signup",signupconteroller);
router.route("/otp-page").get(preventNavigation,serveOtpController).post(verifyOtpController);
router.route('/login').get(preventNavigation,loginRender).post(loginController)
router.get('/all-products',productPageRender)
router.get('/product/:id',productView)
router.put('/resendotp',resendOtp);

module.exports = router;
