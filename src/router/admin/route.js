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

const{
  orderListController,
  orderDetailsController,
  updateOrderStatus
}=require('../../controller/admin/orderController')

const multer = require("multer");
const preventNavigation = require("../../middleware/preventNavigation");
const {upload} = require("../../config/multer/multer");
const product = require("../../model/admin/product");

const router = require("express").Router();

router.get("/dashboard", preventNavigation, dashboardRender);

router
  .route("/add-category")
  .get(getAllCategory)
  .post(addCategory);

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

router.get('/order-list',preventNavigation,orderListController)

router.get('/order-Details/:orderId',preventNavigation,orderDetailsController)

router.post('/update-status/:orderId/:productId',updateOrderStatus)

module.exports = router;
