const {
  signupRender,
  signupconteroller,
  serveOtpController,
  verifyOtpController,
  loginRender,
  loginController,
  resendOtp,
  logoutUser,
} = require("../../controller/user/authController");

const {
  homePageRender,
  productPageRender,
  productView,
} = require("../../controller/user/productController");    

const {
  verifyUser,
  isBlock,
  isOtpUser,
} = require("../../middleware/requireUser");

const {addToCart, renderCart,updatesCartQuantity}=require('../../controller/user/cartController')
const router = require("express").Router();

router.get("/home-page", isBlock, homePageRender);

//authentication route//
router.get("/signup", verifyUser, isBlock, isOtpUser, signupRender);
router.post("/signup", signupconteroller);
router
  .route("/otp-page")
  .get(verifyUser, serveOtpController)
  .post(verifyOtpController);

router
  .route("/login")
  .get(verifyUser, isBlock, loginRender)
  .post(loginController);
router.get("/logout", logoutUser);
router.get("/all-products", isBlock, productPageRender);

router.get("/product/:id", isBlock, productView);
router.put("/resendotp", resendOtp);  


router.post('/addTo-cart',addToCart)
router.get('/cart',renderCart)
router.post('/update-cart',updatesCartQuantity)

module.exports = router;
