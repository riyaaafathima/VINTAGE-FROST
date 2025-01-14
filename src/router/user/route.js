const {
  signupRender,
  signupconteroller,
  serveOtpController,
  homePageRender,
  verifyOtpController,
  loginRender,
  loginController,
  resendOtp
} = require("../../controller/user/controller");
const preventNavigation = require("../../middleware/preventNavigation");

const router = require("express").Router();

router.get("/home-page", homePageRender);

//authentication route//
router.get("/signup",preventNavigation, signupRender);
router.post("/signup",signupconteroller);
router.route("/otp-page").get(preventNavigation,serveOtpController).post(verifyOtpController);
router.route('/login').get(preventNavigation,loginRender).post(loginController)
router.put('/resendotp',resendOtp);

module.exports = router;
