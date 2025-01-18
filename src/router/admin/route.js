const {
  dashboardRender,
  userDetailsRender,
  blockuser,
  getAllproducts,
  addProduct,
  addProductController,
  addCategory,
  getAllCategory,
  editProduct,
  updateProduct,
  editCategory,
  updateCategory,
  softDelete,
  deleteCategory
} = require("../../controller/admin/controller");
const multer =require('multer');
const preventNavigation = require("../../middleware/preventNavigation");
const upload = require("../../config/multer/multer");


const router = require("express").Router();

router.get("/dashboard",preventNavigation, dashboardRender);

router.route('/add-category').get(getAllCategory).post(addCategory);

router.get('/edit-category/:id',editCategory)

router.put('/update-category',updateCategory)

router.put('/delete-category/:id',deleteCategory)

router.get('/edit-product/:id',editProduct)

router.put('/soft-delete/:id',softDelete)

router.get('/getAllproducts',getAllproducts);

router.put('/edit-product/:id',upload.array('images',3),updateProduct)

router.get('/add-Product',addProduct);

router.get("/users", userDetailsRender);

router.put('/block-user/:id',blockuser)

router.post('/add-product',upload.array('images',3),addProductController)


module.exports = router;
