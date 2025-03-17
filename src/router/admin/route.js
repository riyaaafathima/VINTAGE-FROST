const {
  getAllproducts,
  addProduct,
  addProductController,
  editProduct,
  updateProduct,
  softDelete,
} = require("../../controller/admin/productController");

const {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  updateCategory,
} = require("../../controller/admin/categoryController");

const {
  dashboardRender,
  logoutAdmin,
} = require("../../controller/admin/dashBoardController");

const {
  blockuser,
  userDetailsRender,
} = require("../../controller/admin/userController");

const {
  orderListController,
  orderDetailsController,
  updateOrderStatus,
} = require("../../controller/admin/orderController");

const multer = require("multer");
const preventNavigation = require("../../middleware/preventNavigation");
const { upload } = require("../../config/multer/multer");
const product = require("../../model/admin/product");
const {
  addCouponPage,
  createCouponPage,
  addCoupon,
  editCoupon,
  updateCoupon,
  couponListPage,
  removeCoupon,
} = require("../../controller/admin/couponController");

const {
  categoryOfferPage,
  createCategoryOffer,
  addOfferPage,
  updateCategoryOffer,
  renderProductOfferPage,
  renderEditOffer,
  addProductOfferPage,
  createProductOffer,
  editProductOffer,
  editProductOfferPage,
  removeProductOffer,
  removeCategoryOffer,
} = require("../../controller/admin/offerController");


const{ generateOrderExcel, generateOrderCSV, generateOrderPDF }=require('../../controller/admin/orderlistController')

const router = require("express").Router();

router.get("/dashboard", dashboardRender);

router.route("/add-category").get(getAllCategory).post(addCategory);

router.get("/edit-category/:id", preventNavigation, editCategory);

router.put("/update-category", preventNavigation, updateCategory);

router.put("/delete-category/:id", deleteCategory);

router.get("/edit-product/:id", preventNavigation, editProduct);

router.put("/soft-delete/:id", preventNavigation, softDelete);
 
router.get("/getAllproducts", preventNavigation, getAllproducts);

router.put("/edit-product/:id", upload.array("images", 3), updateProduct);

router.get("/add-Product", preventNavigation, addProduct);

router.get("/users", preventNavigation, userDetailsRender);

router.put("/block-user/:id", blockuser);

router.post("/add-product", upload.array("images", 3), addProductController);

router.get("/logout", logoutAdmin);

router.get("/order-list", preventNavigation, orderListController);

router.get(
  "/order-Details/:orderId",
  preventNavigation,
  orderDetailsController
);

router.post("/update-status/:orderId/:productId", updateOrderStatus);

router.route("/coupon-page").get(couponListPage).post(addCoupon);
router.get("/addcoupon-page", createCouponPage);

router.get("/edit-coupon/:id", editCoupon);

router.put("/update-coupon/:id", updateCoupon);

router.put("/delete-coupon/:id", removeCoupon);

//category offer//

router
  .route("/categoryOffer-page")
  .get(categoryOfferPage)
  .post(createCategoryOffer);

router.get("/addOffer-page", addOfferPage);
router.get("/edit-categryOffer/:id", renderEditOffer);
router.put("/update-categoryOffer-page/:id", updateCategoryOffer);

router.get("/productOffer-page", renderProductOfferPage);
router.get("/addProductOffer-page", addProductOfferPage);
router.post("/prodctOffer-page", createProductOffer);
router.get("/edit-productOffer/:id", editProductOfferPage);
router.put("/update-productOffer/:id", editProductOffer);
router.put('/delete-productoffer/:id',removeProductOffer)
router.put('/delete-categoryoffer/:id',removeCategoryOffer)


router.post("/order-generate-excel", generateOrderExcel);
router.post("/order-generate-csv", generateOrderCSV);
router.post("/order-generate-pdf", generateOrderPDF);

    
module.exports = router;
