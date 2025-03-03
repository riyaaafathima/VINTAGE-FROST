const addressModel = require("../../model/user/address");

const cartModel = require("../../model/user/cart");

const orderModel = require("../../model/user/order");
const productModel = require("../../model/admin/product");
const userModel = require("../../model/user/user");
const cart = require("../../model/user/cart");

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

    console.log(userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const orders = await orderModel.find({ userId: userId });
    console.log("orders", orders);

    let allOrders = orders.flatMap((order) =>
      order.products.map((product) => ({
        ...product.toObject(),
        orderId: order.orderId,
        orderObjectId: order._id,
      }))
    );

    console.log("allOrders", allOrders[0]);

    res.render("user/order", {
      user: true,
      allOrders,
    });
  } catch (error) {
    return res.status(400).json({ error: "something went wrong" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { paymentMethod, addressId } = req.body;
    const userId = req.session?.user?._id;
    console.log(addressId, paymentMethod, "===========");

    if (!userId) {
      res.status(400).json({ error: "userId is not found" });
    }

    if (!addressId) {
      return res.status(400).json({ error: "address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "payment method is required" });
    }

    const userCart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
    });

    const products = userCart.items.map((item) => ({
      product: item.product.productName,
      kg: item.kg,
      image: item.product.image,
      actualPrice: item.actualPrice,
      price: item.price,
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

    if (paymentMethod === "wallet" || paymentMethod === "razorPay") {
      paymentStatus = "Success";
    } else {
      paymentStatus = "Pending";
    }

    const orderData = {
      userId: userId,
      address: updatedAddress,
      paymentMethod,
      products,
      totalQuantity,
      subTotal: userCart.subTotal,
      totalPrice: userCart.total,
      packagingPrice,
      paymentStatus,
    };

    const updateProductPromises = userCart.items.map((item) => {
      return quantityChecking(item.product, item.kg, item.quantity);
    });

    await Promise.all(updateProductPromises);

    const order = await new orderModel(orderData);
    await order.save();

    if (order && userCart) {
      await userCart.deleteOne();
    }

    res.status(200).json({ order: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }     
};
const viewOrderDetails = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    console.log(orderId,productId);
    
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const orderDetails = await orderModel.findById(orderId);

    if (!orderDetails) {
      return res.status(404).json({ error: "Order not found" });
    }

    const productDetails = orderDetails.products.find(
      (product) => product._id.toString() === productId
    );

    const otherProducts = orderDetails.products.filter(
      (product) => product._id.toString() !== productId
    );
console.log('============otherppp',otherProducts);

    if (!productDetails) {
      return res.status(404).json({ error: "Product not found in order" });
    }

    const userDetails = await userModel.findById(userId);
console.log("kmfksd",orderDetails);

    let order = {
      orderId:orderDetails.orderId,
      _id: orderDetails._id,
      date: orderDetails.createdAt,
      address: orderDetails.address,
      selectedProduct:productDetails,
      items: otherProducts
    };
    console.log("=========================",productDetails);
    
    console.log("order",order);

    res.render("user/userOrder", {
      user: userDetails, 
      order :{
        orderId:orderDetails.orderId,
        _id: orderDetails._id,
        date: orderDetails.createdAt,
        address: orderDetails.address,
        selectedProduct:productDetails,
        items: otherProducts
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


  const cancelProduct = async (req, res) => {
    try {
      const { orderId, productId } = req.params;
  
      const order = await orderModel.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const product = order.products.id(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found in order" });
      }
  
      if (product.status === "Cancelled") {
        return res.status(400).json({ message: "Product is already cancelled" });
      }
  
      product.status = "Cancelled";
  
      await order.save();
  
      return res.status(200).json({ message: "Product cancelled successfully" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { orderPageRender, placeOrder, viewOrderDetails,cancelProduct };
