const addressModel = require("../../model/user/address");

const cartModel = require("../../model/user/cart");

const orderModel=require('../../model/user/order')

async function quantityChecking(productId, kg, quantity) {
  const product = await productModel.findById(productId);
  const stockVarient = product.varients.find((item) => item.kg == kg);

  if (stockVarient.stock < quantity) {
    throw new Error("product is insufficient");
  }  
}

const orderPageRender = (req, res) => {
  try {
    res.render("user/order", { user: true });
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
      paymentStatus = "success";
    } else {
      paymentStatus = "pending";
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

  } catch (error) {
    console.log(error);
  }
};

module.exports = { orderPageRender, placeOrder };
