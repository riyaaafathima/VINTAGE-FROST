const userModel = require("../../model/user/user");
const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const dashboardRender = (req, res) => {
  try {
    res.render("admin/index");
  } catch (error) {
    console.log(error);
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName, isActive } = req.body;
    console.log(req.body);

    const iscategoryexist = await categoryModel.find({ categoryName });

    if (!iscategoryexist) {
      return res.status(409).json("categoryName already exist");
    }
    const newCategory = await categoryModel.create({
      categoryName,
      isActive,
    });
    console.log("Created category:", newCategory);

    res.status(200).json(newCategory);
  } catch (error) {
    console.log(error);
  }
};
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      console.log("404");
    }

    const category = await categoryModel.findById(id);
    res.render("admin/edit-category", { category });
  } catch (error) {
    console.log;
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryName, _id } = req.body;

    await categoryModel.findByIdAndUpdate(_id, { categoryName }, { new: true });

    return res.status(200).json("sucess");
  } catch (error) {
    console.log(error);
    return res.status(600).json("sucess");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

  
    const preCategory = await categoryModel.findById(id);

    if (!preCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    
    const oldValue = preCategory.isActive;
    await categoryModel.findByIdAndUpdate(
      id,
      { $set: { isActive: !oldValue } },
      { new: true } // Return the updated document
    );

    return res.status(200).json({ message: 'Category status updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating the category status' });
  }
};


const softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const oldProduct = await productModel.findById(id);
    const oldValue = oldProduct.isActive;
    await productModel.findByIdAndUpdate(
      id,
      { $set: { isActive: !oldValue } },
      { new: true }
    );
    return res.status(200).json("updated");
  } catch (error) {
    console.log("error");
    return res.status(600).json("success");
  }
};

const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    res.render("admin/add-category", { allCategory });
  } catch (error) {}
};


const getAllproducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    res.render("admin/page-products-list", { allProducts });
  } catch (error) {}
};

const addProduct = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    res.render("admin/add-product", { allCategory });
  } catch (error) {}
};

const addProductController = async (req, res) => {
  try {
    console.log(req.body, "this is req.body");
    const { productName, price, stock, category, description, quantity } =
      req.body;

    const isProductExist = await productModel.findOne({
      productName: productName,
    });

    if (isProductExist) {
      return res.status(409).json("product already exist");
    }

    console.log(req.files);
    const allImages = req.files.map((item) => {
      return item.filename;
    });

    const newProduct = new productModel({
      productName,
      price: JSON.parse(price),
      stock,
      category,
      description,
      quantity,
      image: allImages,
    });
    await newProduct.save();
    return res.status(200).json("product added successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("produc already exist");
  }
};

const userDetailsRender = async (req, res) => {
  try {
    const allUser = await userModel.find({});

    res.render("admin/page-user-list", {
      allUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    const category = await categoryModel.find({});

    res.render("admin/edit-product", { product, category });
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productName, price, stock, category, description, quantity } =
      req.body;
    console.log(req.body);

    const { id } = req.params;

    console.log(req.files);
    const allImages = req.files.map((item) => {
      return item.filename;
    });

    const exisitingProduct = await productModel.findById(id);
    const exisitingImages = exisitingProduct.image;
    console.log("exisitingImages", exisitingImages);

    const filePath = path.join(
      __dirname,
      "../../../public/uploads",
      exisitingImages[0]
    );
    console.log("filepath", filePath);

    const updateProduct = await productModel.findByIdAndUpdate(id, {
      $set: {
        productName,
        price: JSON.parse(price),
        stock,
        category: category || exisitingProduct.category,
        description,
        quantity,
        image: allImages,
      },
    });
    if (exisitingProduct.productName !== productName) {
      // if the existing productname is !==to the newproduct we should change imagename also as per the change in prdct name
      exisitingImages.forEach((img) => {
        const filePath = path.join(
          __dirname,
          "../../../src/public/uploads",
          img
        );
        fs.unlink(filePath, (err) => console.log(err));
      });
    }
    res.status(200).json("product edited successfully");
  } catch (error) {
    console.log(error);
  }
};

const blockuser = async (req, res) => {
  try {
    const userId = req.param.id;

    const updateUser = await user.findByIdAndUpdate(
      userId,
      { $set: { status: false } },
      { new: true } // new return updated doc
    );

    if (!updateUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const action = status ? "blocked" : "unblocked";
    res
      .status(200)
      .json({ message: `user succesfully ${action}`, user: updateUser });
  } catch (error) {
    console.log("error blocking/unvlocking user", error);

    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
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
};
