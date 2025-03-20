const orderModel = require("../../model/user/order");
const excelJs = require("exceljs");
const PDFDocument = require("pdfkit-table");
const csv = require("csv");
const Stringify = csv.stringify;
const User = require("../../model/user/user");

const safeGet = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || "N/A";
};



const generateOrderExcel = async (req, res) => {
  const { reportType, startingDate, endingDate } = req.body;

  try {
    const filter = {};

    // Apply date filters based on reportType
    const now = new Date();
    if (reportType === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    } else if (reportType === "weekly") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date();
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)
      endOfWeek.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (reportType === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1st
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // Dec 31st
      filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
    } else if (reportType === "custom") {
      if (startingDate) filter.createdAt = { $gte: new Date(startingDate) };
      if (endingDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endingDate) };
    }

    // Fetch Orders
    const orders = await orderModel.find(filter).populate([
      { path: "userId", select: "username email" },
      { path: "products.productId", select: "productName" },
    ]);

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Define Columns
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 15 },
      // { header: "User ID", key: "userId", width: 30 },
      { header: "User Name", key: "username", width: 20 },
      { header: "Number", key: "phoneNumber", width: 20 },
      { header: "User Email", key: "userEmail", width: 30 },
      { header: "Address", key: "address", width: 30 },
      { header: "District", key: "district", width: 15 },
      { header: "Products", key: "products", width: 55 },
      { header: "Subtotal", key: "subTotal", width: 15 },
      { header: "Shipping", key: "shipping", width: 15 },
      { header: "Coupon Discount", key: "discount", width: 15 },
      { header: "Total Price", key: "totalPrice", width: 15 },
    ];

    // Safe Getter Function
    const safeGet = (obj, path, defaultValue = "N/A") =>
      path.split(".").reduce((acc, key) => acc && acc[key], obj) || defaultValue;

    // Populate Rows
    orders.forEach((item) => {
      const row = {
        orderId: safeGet(item, "orderId"),
        // userId: safeGet(item, "userId._id"),
        userName: safeGet(item, "userId.username"),
        phoneNumber: safeGet(item, "address.phoneNumber"),
        userEmail: safeGet(item, "userId.email"),
        address: safeGet(item, "address.address"),
        district: safeGet(item, "address.city"), 
        products: item.products
          .map(
            (product) =>
              `${safeGet(product, "productId.productName")} (${Number(product.quantity) || 0} units, ₹${Number(product.price) || "N/A"} each)`
          )
          .join("\n"),
        subTotal: Number(item.subTotal) || 0,
        shipping: "Free",
        discount: Number(item.couponDiscount) || 0,
        totalPrice: Number(item.totalPrice) || 0,
      };

      worksheet.addRow(row);
    });

    // Response Headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    // Send Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);

  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(400).json({ error: error.message });
  }
};



const generateOrderCSV = async (req, res) => {
  const { startingDate, endingDate } = req.body;

  try {
    const filter = {};
    if (startingDate) filter.createdAt = { $gte: new Date(startingDate) };
    if (endingDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(endingDate) };

    const orders = await orderModel.find(filter).populate([
      { path: "userId", select: "name email" }, // Populating user details
      { path: "products.productId", select: "product" }, // Populating product details
    ]);

    const csvData = [
      [
        "Order ID",
        "User ID",
        "User Name",
        "Number",
        "User Email",
        "Address",
        "City",
        "Products",
        "Subtotal",
        "Shipping",
        "Discount",
        "Total Price",
      ],
    ];

    orders.forEach((item) => {
      const productsDetails = item.products
        .map(
          (product) =>
            `${safeGet(product, "productId.product")} (${
              product.quantity
            } units, ₹${product.price} each)`
        )
        .join("; ");

      const row = [
        safeGet(item, "orderId"),
        safeGet(item, "userId._id"),
        safeGet(item, "userId.name"),
        safeGet(item, "address.phoneNumber"),
        safeGet(item, "userId.email"),
        safeGet(item, "address.address"),
        safeGet(item, "address.city"), // Changed from `district` to `city`
        productsDetails,
        item.subTotal || "N/A",
        "free",
        item.discount || "N/A",
        item.totalPrice || "N/A",
      ];

      csvData.push(row);
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");

    Stringify(csvData, { quoted: true }, (err, output) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate CSV" });
      }
      res.send(output);
    });
  } catch (error) {
    console.error("CSV generation error:", error);
    res.status(400).json({ error: error.message });
  }
};

const generateOrderPDF = async (req, res) => {
  const { startingDate, endingDate, reportType } = req.body; // Include reportType in the request
  console.log("Request Body:", req.body);

  try {
    const filter = {};

    // Handle filters based on report type
    const now = new Date();
    switch (reportType) {
      case "daily":
        filter.createdAt = {
          $gte: new Date(now.setHours(0, 0, 0, 0)), // Start of today
          $lte: new Date(now.setHours(23, 59, 59, 999)), // End of today
        };
        break;

      case "weekly":
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999);

        filter.createdAt = {
          $gte: startOfWeek,
          $lte: endOfWeek,
        };
        break;

      case "yearly":
        filter.createdAt = {
          $gte: new Date(now.getFullYear(), 0, 1), // January 1st of this year
          $lte: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999), // December 31st of this year
        };
        break;

      case "custom":
        if (startingDate) filter.createdAt = { $gte: new Date(startingDate) };
        if (endingDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endingDate) };
        break;

      default:
        return res.status(400).json({ error: "Invalid report type" });
    }

    // Fetch orders based on filter
    const orders = await orderModel.find(filter).populate([
      { path: "userId", select: "username email" },
      { path: "products.productId", select: "productName" },
    ]);

    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=sales_report_${reportType}.pdf`);

    doc.pipe(res);

    // Title
    doc.fontSize(18).text(`Sales Report (${reportType.toUpperCase()})`, { align: "center" });
    doc.moveDown();

    const safeGet = (obj, path, defaultValue = "N/A") =>
      path.split(".").reduce((acc, key) => acc && acc[key], obj) || defaultValue;

    // Table Data
    const tableData = {
      title: "Orders",
      headers: [
        "Order ID",
        "Customer Name",
        "Email",
        "Phone",
        "Address",
        "Products",
        "Subtotal",
        "Coupon Discount",
        "Total Price",
        "Payment Method",
        "Order Date",
      ],
      rows: orders.map((order) => [
        order.orderId || "N/A",
        safeGet(order, "userId.username"),
        safeGet(order, "userId.email"),
        safeGet(order, "address.phoneNumber"),
        safeGet(order, "address.address"),
        order.products
          .map(
            (product) =>
              `${safeGet(product, "productId.productName")} (${product.quantity || 0})`
          )
          .join(", "),
        order.subTotal || 0,
        order.couponDiscount || 0,
        order.totalPrice || 0,
        order.paymentMethod || "N/A",
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
      ]),
    };

    const tableOptions = {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(8);
        if (indexColumn === 0) {
          doc.addBackground(rectRow, indexRow % 2 ? "white" : "black", 0.15);
        }
      },
    };

    await doc.table(tableData, tableOptions);

    // Total display
    const salesTotal = orders.reduce((sum, order) => sum + (order.subTotal || 0), 0);
    const discountTotal = orders.reduce((sum, order) => sum + (order.couponDiscount || 0), 0);
    const revenueTotal = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica-Bold").text("Subtotal Summary", { underline: true });

    doc.moveDown();
    doc.fontSize(10).text(`Sales Total:  ${salesTotal.toFixed(2)} INR`);
    doc.text(`Coupon Discount Total: ${discountTotal.toFixed(2)}%`);
    doc.text(`Revenue Total:  ${revenueTotal.toFixed(2)} INR`);

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { generateOrderCSV, generateOrderExcel, generateOrderPDF };
