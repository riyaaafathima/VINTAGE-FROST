const orderModel = require("../../model/user/order");

const Order = require("../../model/user/order");

const Category = require("../../model/admin/category");

const Product =require('../../model/admin/product')


const getCategoryRevenue = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails._id",
          categoryName: { $first: "$categoryDetails.categoryName" },
          revenue: { $sum: "$products.price" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }, // Top 5 categories
    ]);

    const categories = orders.map((o) => o.categoryName);
    const revenue = orders.map((o) => o.revenue);

    res.json({ categories, revenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

///////////////////////////

const getChartData = async (req, res) => {
  const { timeframe } = req.query; // "weekly", "monthly", "yearly"
  let groupBy, dateFormat;

  switch (timeframe) {
    case "weekly":
      groupBy = { $week: "$createdAt" };
      dateFormat = "Week $week";
      break;
    case "monthly":
      groupBy = { $month: "$createdAt" };
      dateFormat = "$month";
      break;
    case "yearly":
      groupBy = { $year: "$createdAt" };
      dateFormat = "$year";
      break;
    default:
      return res.status(400).json({ error: "Invalid timeframe" });
  }

  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: groupBy,
          sales: { $sum: { $sum: "$products.quantity" } }, // Total products sold
          orders: { $sum: 1 }, // Total number of orders
          revenue: { $sum: "$totalPrice" }, // Total revenue
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: { $toString: "$_id" }, // Convert to string for labels
          sales: 1,
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    const labels = data.map((d) => (timeframe === "monthly" ? getMonthName(d.label) : `${dateFormat.replace("$week", d.label).replace("$year", d.label)}`));
    const sales = data.map((d) => d.sales);
    const orders = data.map((d) => d.orders);
    const revenue = data.map((d) => d.revenue);

    res.json({ labels, sales, orders, revenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper function to convert month number to name
function getMonthName(monthNum) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[parseInt(monthNum) - 1];
}

const dashboardRender = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" }, 
      {
        $group: {
          _id: "$products.productId", 
          totalQuantitySold: { $sum: "$products.quantity" }, 
          productName: { $first: "$products.product" }, 
          productPrice: { $first: "$products.price" }, 
        },
      },
      { $sort: { totalQuantitySold: -1 } }, 
      { $limit: 5 } 
    ]);





    const topCategories = await Order.aggregate([
      { $unwind: "$products" }, 
      {
        $lookup: {
          from: "products", 
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, 
      {
        $lookup: {
          from: "categories", 
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" }, 
      {
        $group: {
          _id: "$categoryDetails._id", 
          categoryName: { $first: "$categoryDetails.categoryName" }, 
          totalQuantitySold: { $sum: "$products.quantity" }, 
        },
      },
      { $sort: { totalQuantitySold: -1 } }, 
      { $limit: 5 } 
    ]);
    res.render("admin/index", { topProducts,topCategories }); 
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Internal Server Error");
  }
};

///logout controller///
const logoutAdmin = (req, res) => {
  try {
    req.session.isAdmin = null;
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  dashboardRender,
  logoutAdmin,
  getCategoryRevenue,
  getChartData,       

};
