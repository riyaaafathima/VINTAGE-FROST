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
  requireUser,
} = require("../../middleware/requireUser");

const {addToCart, renderCart,updatesCartQuantity, removeCart}=require('../../controller/user/cartController');
const { userProfileRender, editUserProfile, userAddressRender, getUserAddress, editAddress, getEditAddress, recentPasswordPage } = require("../../controller/user/userProfileController");

const {userUpload}=require('../../config/multer/multer')
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
router.get("/all-products", productPageRender);

router.get("/product/:id", isBlock, productView);
router.put("/resendotp", resendOtp);  


router.post('/addTo-cart',addToCart)
router.get('/cart',renderCart)
router.post('/update-cart',updatesCartQuantity)
router.post('/remove-cart',removeCart)

router.get('/user-profile',requireUser,userProfileRender)
router.post('/edit-profile',userUpload.single("image"),editUserProfile)
router.get('/user-address',requireUser,userAddressRender)
router.post('/save-address',getUserAddress)
router.put('/edit-address',editAddress)

router.get('/recent-password',recentPasswordPage)
// router.get('/getedit-address/:id',getEditAddress); 
module.exports = router;
   