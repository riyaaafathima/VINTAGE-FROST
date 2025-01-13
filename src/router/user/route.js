const {
  signupRender,
  signupconteroller,
  serveOtpController,
  homePageRender,
  verifyOtpController,
  loginRender,
  loginController
} = require("../../controller/user/controller");
const preventNavigation = require("../../middleware/preventNavigation");

const router = require("express").Router();

router.get("/signup",preventNavigation, signupRender);

router.post("/signup",signupconteroller);

router.route("/otp-page").get(preventNavigation,serveOtpController).post(verifyOtpController);

router.get("/home-page", homePageRender);

router.route('/login').get(loginRender).post(preventNavigation,loginController)



module.exports = router;
