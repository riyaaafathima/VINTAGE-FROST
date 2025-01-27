
const userModel = require("../../model/user/user");
const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");
const { default: mongoose } = require("mongoose");


const homePageRender = async (req, res) => {
  try {
  const Products = await productModel
    .find({ isActive: true })
    .populate({ path: "category", match: { isActive: true } });

    const allProducts = Products.filter((product) => product.category);
    
    let user = null;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
    }

    res.render("user/homepage", { allProducts, user });
  } catch (error) {
    console.log(error);
  }
};

const productPageRender = async (req, res) => {
  try {
    const { page = 1, category, minprice, maxprice } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const limit = 9;

    let filter = { isActive: true };

    filter["varients.price"] = { $gte: 100, $lte: 7000 };

    if (category) {
      filter.category = { $in: category };
    }
    if (minprice || maxprice) {
      filter["varients.price"] = {}; // Use dot notation to target price within the array
      if (minprice) filter["varients.price"].$gte = parseFloat(minprice);
      if (maxprice) filter["varients.price"].$lte = parseFloat(maxprice);
    }

    console.log(filter);

    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const skip = (currentPage - 1) * limit;

    const Products = await productModel.find(filter).populate({
      path: "category",
      match: { isActive: true }, // Ensure only active categories are populated
    }).skip(skip)
    .limit(limit);


    const allProducts = Products.filter(product => product.category !== null);

    const categories = await categoryModel.find({ isActive: true });

    let user = null;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
    }

    res.render("user/allProduct", {
      allProducts,
      totalPages,
      currentPage,
      totalProducts,
      categories,
      selectedCategory: category,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const productView = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.render("common/404");
    }

    const product = await productModel
      .findOne({ _id: id, isActive: true })
      .populate({
        path: "category",
        match: { isActive: true }, // Only populate active categories
      });
    console.log("dfyghu", product);

    if (!product || !product.category) {
      return res.render("common/404");
    }

    const categoryId = product.category._id;
    const relatedProducts = await productModel.find({
      category: categoryId, // Match products with the same category
      _id: { $ne: id }, // Exclude the current product by its ID
    });

    console.log(relatedProducts);

    res.render("user/singleProduct", { product, relatedProducts });
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
 
  homePageRender,
  productPageRender,
  productView,
};
