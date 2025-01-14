const {
  dashboardRender,
  userDetailsRender,
  blockuser,
  getAllproducts,
  addProduct,
  addProductController,
} = require("../../controller/admin/controller");
const multer =require('multer');
const preventNavigation = require("../../middleware/preventNavigation");
const path= require('path')
const fs= require('fs')

const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null,` ${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });



const router = require("express").Router();

router.get("/dashboard",preventNavigation, dashboardRender);

router.get('/getAllproducts',getAllproducts)

router.get('/add-Product',addProduct)

router.get("/users", userDetailsRender);

router.put('/block-user/:id',blockuser)

router.post('/add-product',upload.array('images',3),addProductController)


module.exports = router;
