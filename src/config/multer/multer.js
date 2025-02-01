const path= require('path')
const fs= require('fs')
const multer=require('multer')


const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null,`${file.originalname||uniqueSuffix}`);
  },
});

const upload = multer({ storage });


const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/uploads/user"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extract file extension
    const baseName = path.basename(file.originalname, ext); // Extract filename without extension
    cb(null, `${baseName}-${uniqueSuffix}${ext}`); // Ensures uniqueness
  },
});

const userUpload = multer({ storage: userStorage });

module.exports={upload,userUpload}