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

const multer = require("multer");
const preventNavigation = require("../../middleware/preventNavigation");
const {upload} = require("../../config/multer/multer");

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

module.exports = router;
