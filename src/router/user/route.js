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
  checkCart,
} = require("../../middleware/requireUser");

const {
  couponBadge,
  removeCoupon,
} = require("../../controller/user/couponController");

const { createReview, getReview, updateReview, editReview } = require("../../controller/user/reviewController");

const {
  addToCart,
  renderCart,
  updatesCartQuantity,
  removeCart,
  updateInstruction,
  updateMessage,
} = require("../../controller/user/cartController");
const {
  userProfileRender,
  editUserProfile,
  userAddressRender,
  getUserAddress,
  editAddress,
  recentPasswordPage,
  deleteAddress,
  updatePassword,
} = require("../../controller/user/userProfileController");
const {
  orderPageRender,
  placeOrder,
  viewOrderDetails,
  cancelProduct,
  getKey,     
  createRazorPayOrder,
  verifyPayment,
  downloadInvoice,
} = require("../../controller/user/orderController");
const {
  checkoutRender,
  checkoutAddressRender,
} = require("../../controller/user/checkOutController");

const { userUpload } = require("../../config/multer/multer");
const {
  whishlistPageRender,
  addToWhishList,
  getWishlist,
  removeWishList,
} = require("../../controller/user/whishListController");

const{walletPageRender}=require('../../controller/user/walletController')
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

router.post("/addTo-cart", addToCart);
router.get("/cart", requireUser, renderCart);
router.post("/update-cart", updatesCartQuantity);
router.post("/remove-cart", removeCart);
router.post("/update-instruction", updateInstruction);
router.post("/update-message", updateMessage);

router.get("/user-profile", requireUser, userProfileRender);
router.post("/edit-profile", userUpload.single("image"), editUserProfile);

router.get("/user-address", requireUser, userAddressRender);
router.post("/save-address", getUserAddress);
router.put("/edit-address", editAddress);
router.delete("/delete-address/:id", deleteAddress);

router.get("/order", requireUser, orderPageRender);

router.get("/checkout", checkCart, requireUser, checkoutRender);

router
  .route("/recent-password")
  .get(requireUser, recentPasswordPage)
  .post(updatePassword);

router.post("/place-order", placeOrder);
router.get(
  "/view-orderDetails/:orderId/:productId",
  requireUser,
  viewOrderDetails
);
router.patch("/order/cancel/:orderId/:productId/:itemId", cancelProduct);

router.get("/whishlist-page", requireUser, whishlistPageRender);
router.post("/add-wishlist", addToWhishList);
router.get("/wishlist", getWishlist);
router.post("/wishlist-remove", removeWishList);

router.get("/razor-key", getKey);
router.post("/razor-order", createRazorPayOrder);
router.post("/razor-verify", verifyPayment);


router.post("/coupon", couponBadge);

router.delete("/remove-coupon", removeCoupon);

router.post("/review", createReview);
router.post('/edit-review', editReview);


//wallet//
router.get('/wallet-page',walletPageRender)

//invoice//
router.get('/order-invoice/:id',downloadInvoice)


module.exports = router;
