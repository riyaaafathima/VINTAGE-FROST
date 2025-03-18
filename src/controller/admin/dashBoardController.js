
const Order = require("../../model/user/order");
const User = require("../../model/user/user");
const category=require('../../model/admin/category')

// Modify dashboardRender
const dashboardRender = async (req, res) => {
  try {
    const filter = req.query.filter || "week"; 

    // Define time range based on filter
    let startDate;
    const endDate = new Date();
    switch (filter) {
      case "day":
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7); // Default to week
    }



    
    const totalOrders = await Order.countDocuments();
    const totalCategories = await category.countDocuments();
    const totalUsers=await User.countDocuments()

    const totalProductsData = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: "$products.quantity" }
        }
      }
    ]);
    const totalProducts = totalProductsData.length > 0 ? totalProductsData[0].totalProducts : 0;

    // Fetch users data
    const usersData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: filter === "day" ? "%H" : filter === "week" ? "%Y-%m-%d" : filter === "month" ? "%Y-%m" : "%Y",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ordersData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: "Success"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: filter === "day" ? "%H" : filter === "week" ? "%Y-%m-%d" : filter === "month" ? "%Y-%m" : "%Y",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);



    const productsData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: "Success"
        }
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            $dateToString: {
              format: filter === "day" ? "%H" : filter === "week" ? "%Y-%m-%d" : filter === "month" ? "%Y-%m" : "%Y",
              date: "$createdAt"
            }
          },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const allLabels = [...new Set([
      ...usersData.map(item => item._id),
      ...ordersData.map(item => item._id),
      ...productsData.map(item => item._id)
    ])].sort();

    const chartData = {
      labels: allLabels,
      users: allLabels.map(label => {
        const user = usersData.find(u => u._id === label);
        return user ? user.count : 0;
      }),
      orders: allLabels.map(label => {
        const order = ordersData.find(o => o._id === label);
        return order ? order.count : 0;
      }),
      products: allLabels.map(label => {
        const product = productsData.find(p => p._id === label);
        return product ? product.totalQuantity : 0;
      })
    };

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
      { $limit: 5 },
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
      { $limit: 5 },
    ]);

    console.log("  chartData,",  chartData);
    

    res.render("admin/index", {
      topProducts,
      topCategories,
      chartData,
      filter,
      totalProducts ,
      totalOrders,
      totalCategories,
      totalUsers

    });
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
};
