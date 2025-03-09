const categoryOfferModel = require("../../model/admin/categoryOffer");
const productOfferModel = require("../../model/admin/productOffer");
const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");

const categoryOfferPage = async (req, res) => {
  try {
    const categoryOffers = await categoryOfferModel
      .find({})
      .populate({ path: "category_id", match: { isActive: true } });

    res.render("admin/categoryOffer-list", { categoryOffers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const createCategoryOffer = async (req, res) => {
  try {
    const { category_id, offerPercentage, expiryDate } = req.body;

    const isCategoryOfferExist = await categoryOfferModel.findOne({
      category_id,
    });
    if (isCategoryOfferExist) {
      return res
        .status(409)
        .json({ message: "Offer already exists for this category" });
    }

    const newCategoryOffer = await categoryOfferModel.create({
      category_id,
      offerPercentage,
      expiryDate,
    });

    const products = await productModel.find({ category: category_id });

    // Resolve promises inside map using Promise.all
    const bulkOperations = await Promise.all(
      products.map(async (product) => {
        if (product.productOfferModel) {
          const existingProductOffer = await productOfferModel.findById(
            product.productOfferModel
          );

          // If existing product offer is less than new category offer, update category offer
          if (
            existingProductOffer &&
            existingProductOffer.offerPercentage <
              newCategoryOffer.offerPercentage
          ) {
            return {
              updateOne: {
                filter: { _id: product._id },
                update: {
                  $set: {
                    categoryOfferModel: newCategoryOffer._id,
                    offerPercentage: newCategoryOffer.offerPercentage,
                    productOfferModel: null,
                  },
                },
              },
            };
          }
        } else {
          return {
            updateOne: {
              filter: { _id: product._id },
              update: {
                $set: {
                  categoryOfferModel: newCategoryOffer._id,
                  offerPercentage: newCategoryOffer.offerPercentage,
                },
              },
            },
          };
        }
        return null;
      })
    );

    // Remove null entries
    const validBulkUpdates = bulkOperations.filter((op) => op !== null);

    // Execute bulk update only if there are valid updates
    if (validBulkUpdates.length > 0) {
      await productModel.bulkWrite(validBulkUpdates);
    }

    return res.status(201).json({ message: "Offer added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addOfferPage = async (req, res) => {
  try {
    const category = await categoryModel.find();
    console.log("category==========", category);

    return res.render("admin/add-categoryOffer", { category });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

const renderEditOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    console.log(offerId);

    const offer = await categoryOfferModel
      .findById(offerId)
      .populate({ path: "category_id", match: { isActive: true } });

    console.log(offer);

    if (!offer) {
      return res.status(404).send("offer not found");
    }
    const categories = await categoryModel.find();

    res.render("admin/edit-categryOffer", { offer, categories });
  } catch (error) {
    console.log(error);
  }
};

const updateCategoryOffer = async (req, res) => {
  try {
    const { category_id, expiryDate, offerPercentage } = req.body;
    const { id } = req.params;

    console.log(req.body);

    // Update the category offer
    const offer = await categoryOfferModel.findOneAndUpdate(
      { _id: id },
      { $set: { category_id, expiryDate, offerPercentage } },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Find all products associated with this category offer
    const products = await productModel.find({ categoryOfferModel: id });

    // Resolve promises inside map using Promise.all
    const bulkOperations = await Promise.all(
      products.map(async (product) => {
        if (product.productOfferModel) {
          const existingOffer = await productOfferModel.findById(
            product.productOfferModel
          );

          // Update only if category offer is higher than product offer
          if (
            existingOffer &&
            existingOffer.offerPercentage < offer.offerPercentage
          ) {
            return {
              updateOne: {
                filter: { _id: product._id },
                update: {
                  $set: {
                    categoryOfferModel: offer._id,
                    offerPercentage: offer.offerPercentage,
                    productOfferModel: null,
                  },
                },
              },
            };
          }
        } else {
          return {
            updateOne: {
              filter: { _id: product._id },
              update: {
                $set: {
                  offerPercentage: offer.offerPercentage,
                  categoryOfferModel: offer._id,
                },
              },
            },
          };
        }
        return null;
      })
    );

    // Remove null entries
    const validBulkUpdates = bulkOperations.filter((op) => op !== null);

    console.log("bulkUpdate=====", validBulkUpdates);

    // Execute bulk update only if there are valid updates
    if (validBulkUpdates.length > 0) {
      await productModel.bulkWrite(validBulkUpdates);
    }

    return res.status(200).json({ message: "Offer updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeCategoryOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryOffer = await categoryOfferModel.findByIdAndDelete(id);
    if (!categoryOffer) {
      return res.status(400).json({ message: "categoryOffer is not found" });
    }
    return res
      .status(200)
      .json({ message: "categoryOffer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const renderProductOfferPage = async (req, res) => {
  try {
    const productOffers = await productOfferModel
      .find({})
      .populate("product_id");
    res.render("admin/productOffer-list", { productOffers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addProductOfferPage = async (req, res) => {
  try {
    const products = await productModel.find();

    return res.render("admin/add-productOffer", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

const createProductOffer = async (req, res) => {
  try {
    const { product_id, offerPercentage, expiryDate } = req.body;
    console.log("==========================================", req.body);

    const isProductOfferExist = await productOfferModel.findOne({
      product_id,
    });

    if (isProductOfferExist) {
      return res
        .status(409)
        .json({ message: "Offer already exists for this category" });
    }

    const newProductOffer = new productOfferModel({
      product_id,
      offerPercentage,
      expiryDate,
    });

    await newProductOffer.save();
    const product = await productModel.findById(product_id);

    if (product.categoryOfferModel) {
      if (product.offerPercentage < newProductOffer.offerPercentage) {
        product.categoryOfferModel = null;
        product.productOfferModel = newProductOffer._id;
        product.offerPercentage = newProductOffer.offerPercentage;
      }
    } else {
      product.productOfferModel = newProductOffer._id;
      product.offerPercentage = newProductOffer.offerPercentage;
    }

    product.save();

    return res.status(201).json({ message: "Offer added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editProductOffer = async (req, res) => {
  try {
    const { expiryDate, offerPercentage } = req.body;
    console.log(req.body);

    const { id } = req.params;
    const newProductOffer = await productOfferModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          expiryDate,
          offerPercentage,
        },
      },
      { new: true }
    );

    if (!newProductOffer) {
      return res.status(401).json("offer not found");
    }

    const product = await productModel.findById(id);

    if (product.categoryOfferModel) {
      if (product.offerPercentage < newProductOffer.offerPercentage) {
        product.categoryOfferModel = null;
        product.productOfferModel = newProductOffer._id;
        product.offerPercentage = newProductOffer.offerPercentage;
      }
    } else {
      product.productOfferModel = newProductOffer._id;
      product.offerPercentage = newProductOffer.offerPercentage;
    }

    product.save();

    return res.status(200).json("sucess");
  } catch (error) {
    console.log(error);
  }
};

const editProductOfferPage = async (req, res) => {
  try {
    const offerId = req.params.id;
    console.log("offerId", offerId);

    const offer = await productOfferModel
      .findById(offerId)
      .populate({ path: "product_id", match: { isActive: true } });

    console.log(offer);

    if (!offer) {
      return res.status(404).send("offer not found");
    }
    const products = await productModel.find();

    res.render("admin/edit-productOffer", { offer, products });
  } catch (error) {
    console.log("edit pro", error);
  }
};

const removeProductOffer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params, "dmd,dm,fm");

    const productOffer = await productOfferModel.findByIdAndDelete(id);
    if (!productOffer) {
      return res.status(400).json({ message: "ProductOffer is not found" });
    }
    return res
      .status(200)
      .json({ message: "ProductOffer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  categoryOfferPage,
  createCategoryOffer,
  createCategoryOffer,
  addOfferPage,
  renderEditOffer,
  updateCategoryOffer,
  renderProductOfferPage,
  addProductOfferPage,
  createProductOffer,
  editProductOffer,
  editProductOfferPage,
  removeProductOffer,
  removeCategoryOffer,
};
