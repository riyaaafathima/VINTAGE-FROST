const addressModel = require("../../model/user/address");
const cartModel = require("../../model/user/cart");
const orderModel = require("../../model/user/order");
const productModel = require("../../model/admin/product");
const walletModel = require("../../model/user/wallet");
const counterModel = require("../../model/user/counter");
const reviews = require("../../model/user/review");

const userModel = require("../../model/user/user");
const RazorPay = require("razorpay");
const crypto = require("crypto");
const counter = require("../../model/user/counter");
const { type } = require("os");
const couponModel = require("../../model/admin/coupon");
const order = require("../../model/user/order");

async function quantityChecking(productId, kg, quantity) {
  const product = await productModel.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const stockVarient = product.varients.find((item) => item.kg == kg);

  if (stockVarient.stock < quantity) {
    throw new Error(`${product.productName} doesn't have enough stock`);
  }
  stockVarient.stock -= quantity;

  await product.save();
}

const orderPageRender = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const page = parseInt(req.query.page) || 1; 
    const limit = 4; 
    const skip = (page - 1) * limit;
    
    const orders = await orderModel.find({ userId: userId }).sort({createdAt:-1});
    
    let allOrders = orders.flatMap((order) =>
      order.products.map((product) => ({
        ...product.toObject(),
        orderId: order.orderId,
        orderObjectId: order._id,
        paymentStatus: order.paymentStatus,
        totalPrice:order.totalPrice,
        orderDate:order.createdAt
        
      }))
    );
    allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    const totalOrders = allOrders.length; 
    const totalPages = Math.ceil(totalOrders / limit);

    allOrders = allOrders.slice(skip, skip + limit);

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

    res.render("user/order", {
      user,
      cartCount,
      allOrders,
      currentPage: page,
      totalPages,
      
    });
  } catch (error) {
    return res.status(400).json({ error: "something went wrong" });
  }
};


const placeOrder = async (req, res) => {
  try {
    const { paymentMethod, addressId,  isPaymentFailed} = req.body;
    const userId = req.session?.user?._id;

    if (!userId) {
      res.status(400).json({ error: "userId is not found" });
    }

    if (!addressId) {
      return res.status(400).json({ error: "address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "payment method is required" });
    }

    const userCart = await cartModel.findOne({ user: userId }).populate([{
      path: "items.product"},
      {path:'coupon',populate:{path:'offerAmount'}}
    ]);

    const products = userCart.items.map((item) => ({
      product: item.product.productName,
      productId: item.product._id,
      kg: item.kg,
      image: item.product.image,
      actualPrice: item.actualPrice,
      price: item.price,
      offerPrice:item.offerPrice,
      quantity: item.quantity,
      message: item.message,
      instruction: item.instruction,
      isEggless: item.isEggless,
    }));

    const userAddress = await addressModel.findOne({ user: userId });

    if (!userAddress) {
      res.status(400).json({ error: "address required" });
    }

    const address = userAddress.addresses.find((address) =>
      address._id.equals(addressId)
    );

    if (!address) {
      res.status(404).json({ message: "Address not found" });
    }

    const userName = req.session?.user?.username;

    const updatedAddress = {
      ...address.toObject(),
      name: userName,
    };

    const totalQuantity = userCart.items.reduce(
      (acc, item) => (acc += item.quantity),
      0
    );
    const packagingPrice = userCart.items.reduce(
      (acc, item) => (acc += item.quantity * 20),
      0
    );

    let paymentStatus = "";

    if (paymentMethod === "wallet" || (paymentMethod === "razorPay" && !isPaymentFailed) ) {
      paymentStatus = "Success";
    } else if(isPaymentFailed){
      paymentStatus='Failed'
    }
     else {
      paymentStatus = "Pending";
    }

    let couponCode=null
    let couponDiscount=null
    let totalPrice =null
    if (userCart?.coupon) {
      const coupon=await couponModel.findById(userCart.coupon)
      couponCode=coupon.couponCode
      couponDiscount=coupon.offerAmount
      totalPrice=  (userCart.total + packagingPrice) - ((userCart.total + packagingPrice) * couponDiscount / 100)
    }
 
   

    const orderData = {
      userId: userId,
      address: updatedAddress,
      paymentMethod,
      products,
      totalQuantity,
      subTotal: userCart.subTotal,
      totalPrice: totalPrice ? totalPrice:userCart.total,
      packagingPrice,
      couponCode,
      couponDiscount,
      paymentStatus,
    };
console.log("orderData==================",orderData);
    const updateProductPromises = userCart.items.map((item) => {
      return quantityChecking(item.product, item.kg, item.quantity);
    });

    await Promise.all(updateProductPromises);

    const order = await new orderModel(orderData);
    await order.save();

    if (paymentMethod == "Wallet") {
      const isWalletExists = await walletModel.findOne({ user: userId });
      if (!isWalletExists) {
        return res.status(401).json({ message: "wallet not found" });
      }

      let counter = await counterModel.findOne({
        model: "Wallet",
        field: "transaction_id",
      });

      if (counter) {
        counter.count += 1;
        await counter.save();
      } else {
        counter = await counterModel.create({
          model: "Wallet",
          field: "transaction_id",
        });
      }

      let wallet = {};
      wallet = await walletModel.findByIdAndUpdate(isWalletExists._id, {
        $inc: {
          balance: -order.totalPrice,
        },
        $push: {
          transaction: {
            transaction_id: counter.count + 1,
            amount: order.totalPrice,
            type: "Debit",
            description: "Product Ordered",
            order: order._id,
          },
        },
      });
    }

    if (order && userCart) {
      await userCart.deleteOne();
    }

    res.status(200).json({ order: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createRazorPayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new RazorPay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: amount * 100,        
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        throw Error(error);       
      }
      res.status(200).json(order);
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

const getKey = async (req, res) => {
  return res.status(200).json(process.env.KEY_ID);
};
const viewOrderDetails = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    console.log(orderId, productId);

    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const orderDetails = await orderModel.findById(orderId);

    if (!orderDetails) {
      return res.status(404).json({ error: "Order not found" });
    }


    const review = await reviews.findOne({ userId: userId, product: productId });

    const productDetails = orderDetails.products.find(
      (product) => product._id.toString() === productId
    );

    const otherProducts = orderDetails.products.filter(
      (product) => product._id.toString() !== productId
    );

    if (!productDetails) {
      return res.status(404).json({ error: "Product not found in order" });
    }

    const userDetails = await userModel.findById(userId);

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

    let order = {
      orderId: orderDetails.orderId,
      _id: orderDetails._id,
      date: orderDetails.createdAt,
      address: orderDetails.address,
      selectedProduct: productDetails,
      items: otherProducts,
      totalPrice:orderDetails.totalPrice,
      subtotal:orderDetails.subTotal,


    };

    res.render("user/userOrder", {
      user: userDetails,
      order,
      cartCount,
      review

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const cancelProduct = async (req, res) => {
  try {
    const { orderId, productId, itemId } = req.params;
    const { reason } = req.body;
    const userId = req.session?.user?._id;
    console.log("userId", userId);

    console.log(orderId, productId, itemId, reason);

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderdProduct = order.products.id(itemId);

    if (!orderdProduct) {
      return res.status(404).json({ message: "Product not found in order" });
    }
    const product = await productModel.findById(productId);
    console.log(product);

    if (!product) {
      throw new Error("Product not found");
    }

    const stockVarient = product.varients.find(
      (item) => item.kg == orderdProduct.kg
    );    

    stockVarient.stock += orderdProduct.quantity;

    await product.save();

    if (orderdProduct.status === "Cancelled") {
      return res.status(400).json({ message: "Product is already cancelled" });
    }
    orderdProduct.reason = reason;

    orderdProduct.status = "Cancelled";

    await order.save();

    if (order.paymentMethod != "COD") {
      const isWalletExists = await walletModel.findOne({ user: userId });

      let counter = await counterModel.findOne({
        model: "Wallet",
        field: "transaction_id",
      });

      if (counter) {
        counter.count += 1;
        await counter.save();
      } else {
        counter = await counterModel.create({
          model: "Wallet",
          field: "transaction_id",
        });
      }

      if (isWalletExists) {
        wallet = await walletModel.findByIdAndUpdate(isWalletExists._id, {
          $inc: {
            balance: +orderdProduct.price,
          },
          $push: {
            transaction: {
              transaction_id: counter.count + 1,
              amount: orderdProduct.price,
              type: "Credit",
              description: " Ordered cancellation Refund",
              order: order._id,
              product: orderdProduct._id,
            },
          },
        });
      } else {
        wallet = await walletModel.create({
          user: userId,
          balance: orderdProduct.price,
          transaction: [
            {
              transaction_id: counter.count + 1,
              amount: orderdProduct.price,
              type: "Credit",
              description: "Order Cancellation Refund",
              orderId: order._id,
              product: orderdProduct._id,
            },
          ],
        });
      }
    }

    return res.status(200).json({ message: "Product cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const mongoose = require("mongoose");

const verifyPayment = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      throw Error("Invalid Signature sent");
    }

    // Check if orderId is a valid MongoDB ObjectId before querying
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      const order = await orderModel.findByIdAndUpdate(
        orderId, 
        { paymentStatus: 'Success' }, 
        { new: true }
      );
    } else {
      console.log("Invalid MongoDB Order ID:", orderId);
    }

    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  orderPageRender,
  placeOrder,
  viewOrderDetails,
  cancelProduct,
  getKey,
  createRazorPayOrder,
  verifyPayment,
};
