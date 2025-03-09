const userModel = require("../../model/user/user");
const productModel = require("../../model/admin/product");
const categoryModel = require("../../model/admin/category");
const cartModel = require("../../model/user/cart");
const { default: mongoose } = require("mongoose");
const wishlistModel = require("../../model/user/wishlist");
const wishlist = require("../../model/user/wishlist");

const homePageRender = async (req, res) => {
  try {
    const Products = await productModel
      .find({ isActive: true })
      .populate({ path: "category", match: { isActive: true } });

    const allProducts = Products.filter((product) => product.category);

    const latestProducts = await productModel
      .find({ isActive: true })
      .populate({ path: "category", match: { isActive: true } })
      .sort({ createdAt: -1 })
      .limit(8);

    const topRated = await productModel
      .find({ isActive: true })
      .sort({ rating: -1 })
      .limit(10);

    let user = null;
    let cartCount = 0;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
      const cart = await cartModel.findOne({ user: id });
      if (cart) {
        cartCount = cart.items.length;
      }
    }

    res.render("user/homepage", {
      allProducts,
      user,
      latestProducts,
      topRated,
      cartCount,
    });
  } catch (error) {
    console.log(error);
  }
};

const productPageRender = async (req, res) => {
  try {
    const { page = 1, category, minprice, maxprice, search, sort } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const limit = 9;

    let filter = { isActive: true };

    filter["varients.price"] = { $gte: 100, $lte: 7000 };

    if (category) {
      filter.category = { $in: category };
    }
    if (minprice || maxprice) {
      filter["varients.price"] = {};
      if (minprice) filter["varients.price"].$gte = parseFloat(minprice);
      if (maxprice) filter["varients.price"].$lte = parseFloat(maxprice);
    }
    if (search) {
      filter.productName = { $regex: new RegExp(search, "i") };
    }

    let sortOptions = {};
    if (sort === "LowtoHigh") {
      sortOptions["varients.price"] = 1; // Sort by price in ascending order
    } else if (sort === "HightoLow") {
      sortOptions["varients.price"] = -1; // Sort by price in descending order
    } else if (sort === "Newest") {
      sortOptions.createdAt = -1; // Sort by creation date in descending order
    } else if (sort === "aToz") {
      sortOptions.productName = 1; // Sort by product name in ascending order
    } else if (sort === "zToa") {
      sortOptions.productName = -1; // Sort by product name in descending order
    }
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const skip = (currentPage - 1) * limit;

    const Products = await productModel
      .find(filter)
      .populate({ 
        path: "category",
        match: { isActive: true }, // Ensure only active categories are populated
      })
      .sort(sortOptions) // Apply sorting here
      .skip(skip)
      .limit(limit);

    const allProducts = Products.filter((product) => product.category !== null);

    const categories = await categoryModel.find({ isActive: true });

console.log(allProducts);


    let user = null;
    let cartCount = 0;
    let wishlist=[]
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
      const cart = await cartModel.findOne({ user: id });
      if (cart) {
        cartCount = cart.items.length;
      }
      let items = await wishlistModel.findOne({ user: id });
      if(items){
        wishlist=items.products
      }

    }

    res.render("user/allProduct", {
      allProducts,
      totalPages,
      currentPage,
      totalProducts,
      categories,
      selectedCategory: category,
      user,
      cartCount,
      wishlist:wishlist
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
        match: { isActive: true },
      });

    if (!product || !product.category) {
      return res.render("common/404");
    }

    let user = null;
    let cartCount = 0;
    let wishlist = null;

    if (req.session?.user) {
      const userId = req.session.user._id;

      const userData = await userModel.findById(userId);
      user = userData?.username || null;

      const cart = await cartModel.findOne({ user: userId });
      cartCount = cart ? cart.items.length : 0;

      wishlist = await wishlistModel.findOne({ user: userId });
    }

    const relatedProducts = await productModel.find({
      category: product.category._id,
      _id: { $ne: id },
    });

    res.render("user/singleProduct", {
      product,
      relatedProducts,
      user,
      cartCount,
      wishlist:wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("common/500"); // Optional: handle server errors
  }
};


module.exports = {
  homePageRender,
  productPageRender,
  productView,
};
