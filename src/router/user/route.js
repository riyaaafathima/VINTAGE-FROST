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
  productView,
  logoutUser,
} = require("../../controller/user/controller");
const preventNavigation = require("../../middleware/preventNavigation");
const {verifyUser,isBock} = require("../../middleware/requireUser")
const router = require("express").Router();

router.get("/home-page",isBock, homePageRender);

//authentication route//
router.get("/signup",verifyUser, signupRender);
router.post("/signup", signupconteroller);
router
  .route("/otp-page")
  .get(verifyUser,serveOtpController)
  .post(verifyOtpController);
     
router
  .route("/login")
  .get(verifyUser, loginRender)
  .post(loginController);
router.get('/logout',logoutUser)
router.get("/all-products", productPageRender);

router.get("/product/:id", productView);
router.put("/resendotp", resendOtp);
   

module.exports = router;
