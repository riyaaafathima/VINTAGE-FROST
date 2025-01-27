const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.render("commmon/404");
    }

    const oldProduct = await productModel.findById(id);
    const oldValue = oldProduct.isActive; 
    await productModel.findByIdAndUpdate(
      id,
      { $set: { isActive: !oldValue } },
      { new: true }
    );
    return res.status(200).json({message:"updated",isActive:!oldValue});
  } catch (error) {
    console.log("error");
    return res.status(600).json("success");
  }
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
    const { productName, varients, category, description, preperationHour } =
      req.body;
    const LowerCasedProductName = productName.toLowerCase();
    const isProductExist = await productModel.findOne({
      productName: LowerCasedProductName,
    });

    if (isProductExist) {
      return res.status(409).json("product already exist");
    }

    console.log(req.files);
    const allImages = req.files.map((item) => {
      return item.filename;
    });

    const newProduct = new productModel({
      productName: LowerCasedProductName,
      varients: JSON.parse(varients),
      category,
      description,
      preperationHour,
      image: allImages,
    });
    await newProduct.save();
    return res.status(200).json("product added successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("produc already exist");
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      res.render("commmon/404");
    }

    const product = await productModel.findById(productId).populate("category");

    const category = await categoryModel.find({ isActive: true });

    res.render("admin/edit-product", { product, category });
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productName, varients, category, description } = req.body;

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.render("commmon/404");
    }

    const LowerCasedProductName = productName.toLowerCase();
    console.log(LowerCasedProductName);

    const isProductExist = await productModel.findOne({
      productName: LowerCasedProductName,
      _id: { $ne: id },
    });

    if (isProductExist) {
      return res.status(409).json("product already exist");
    }

    const allImages = req.files.map((item) => {
      return item.filename;
    });

    const exisitingProduct = await productModel.findById(id);
    const exisitingImages = exisitingProduct.image;

    const filePath = path.join(
      __dirname,
      "../../../public/uploads",
      exisitingImages[0]
    );
    console.log("enter");

    await productModel.findByIdAndUpdate(id, {
      $set: {
        productName: LowerCasedProductName,
        varients: JSON.parse(varients),
        category: category || exisitingProduct.category,
        description,

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

module.exports = {
  getAllproducts,
  addProduct,
  addProductController,
  editProduct,
  updateProduct,
  softDelete,
};
