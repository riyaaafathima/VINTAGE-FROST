const cartModel = require("../../model/user/cart");
const productModel = require("../../model/admin/product");
const userModel = require("../../model/user/user");
const { checkCoupon } = require("../../service/checkcartQty");

async function quantityChecking(productId, kg, quantity) {
  const product = await productModel.findById(productId);
  const stockVarient = product.varients.find((item) => item.kg == kg);

  if (stockVarient.stock < quantity) {
    throw new Error("product is insufficient");
  }
}

const addToCart = async (req, res) => {
  try {
    const { price, kg, eggpeference, instruction, message, productId } =
      req.body;

    const userId = req.session?.user?._id;

    if (!userId) {
      res.status(404).json("please login");
    }
    const isEggless = eggpeference === "EGG" ? true : false;
    const isCartAvailable = await cartModel.findOne({ user: userId });

    if (!isCartAvailable) {
      try {
        await quantityChecking(productId, kg, 1);
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      const product = await productModel.findById(productId);
      let offerPrice = price;
      let off = null;
      if (product.offerPercentage) {
        offerPrice = price - (price * product.offerPercentage) / 100;
        off = price - (price * product.offerPercentage) / 100;
      }
      const cart = new cartModel({
        user: userId,
        items: [
          {
            product: productId,
            kg,
            actualPrice: price,
            price: offerPrice,
            offerPrice: off,
            instruction,
            message,
            isEggless,
            quantity: 1,
          },
        ],
        subTotal: price,
        total: offerPrice,
      });

      await cart.save();
      return res
        .status(200)
        .json({ message: "items added", cartCount: cart.items.length });
    } else {
      const oldItem = isCartAvailable.items.find(
        (item) => item.kg == kg && item.product.toString() === productId
      );

      if (oldItem) {
        try {
          await quantityChecking(productId, kg, oldItem.quantity + 1);
        } catch (error) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }

        oldItem.quantity++;
        isCartAvailable.total += parseInt(price);
        isCartAvailable.subTotal += parseInt(oldItem.actualPrice);
        await isCartAvailable.save();

        return res.status(200).json({
          message: "items added",
          cartCount: isCartAvailable.items.length,
        });
      }

      const product = await productModel.findById(productId);
      let off = null;
      let offerPrice = price;
      if (product.offerPercentage) {
        offerPrice = price - (price * product.offerPercentage) / 100;
        off = price - (price * product.offerPercentage) / 100;
      }
      const item = {
        product: productId,
        kg,
        price: offerPrice,
        instruction,
        actualPrice: price,
        offerPrice: off,
        message,
        isEggless,
        quantity: 1,
      };

      isCartAvailable.items.push(item);
      isCartAvailable.total += parseInt(price);
      isCartAvailable.subTotal += parseInt(price);

      await isCartAvailable.save();
      return res.status(200).json({
        message: "items added",
        cartCount: isCartAvailable.items.length,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const renderCart = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.redirect("/login");
    }
    const cart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
      model: "products",
      match: { isActive: true },
    });

    console.log("after", cart);

    const cartItem = cart.items.filter((item) => item.product !== null);
    cart.items = cartItem;
    console.log("before", cart);

    if (!cart || cart.items.length == 0) {
      return res.render("user/cart", {
        cart: null,
        cartCount: cart.items.length,
        user: true,
        packagePrice: 0,
      });
    }

    const packagePrice = cart.items.reduce(
      (acc, item) => (acc += item.quantity * 20),
      0
    );

    let user = null;
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
    }

    if (cart?.coupon) {
      checkCoupon(userId);
    }

    res.render("user/cart", {
      cart,
      user,
      packagePrice,
      cartCount: cart.items.length,
    });
  } catch (error) {
    console.error(error);
  }
};

const updatesCartQuantity = async (req, res) => {
  try {
    const { productId, quantity, kg } = req.body;
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please log in" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.kg == kg
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    try {
      await quantityChecking(productId, kg, quantity);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("========", quantity, item.price, quantity * item.price);

    item.quantity = quantity;

    if (item.offerPrice) {
      item.price = quantity * item.offerPrice;
    }else{
      item.price = quantity * item.actualPrice;
    }



    cart.total = cart.items.reduce((sum, i) => sum + i.price, 0);
    cart.subTotal = cart.items.reduce(
      (sum, i) => sum + i.actualPrice * i.quantity,
      0
    );
    await cart.save();
    checkCoupon(userId);

    res.status(200).json({ success: true, message: "Quantity updated", item });
  } catch (error) {
    console.error("errorrrrrrrrr", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeCart = async (req, res) => {
  try {
    const { productId, kg } = req.body;

    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) =>
        !(item.product.toString() === productId && item.kg.toString() === kg)
    );

    // cart.total = cart.items.reduce(
    //   (sum, item) => sum + item.actualPrice * item.quantity,
    //   0
    // );
    cart.total = cart.items.reduce((sum, i) => sum + i.price, 0);
    cart.subTotal = cart.items.reduce(
      (sum, i) => sum + i.actualPrice * i.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed",
      cartCount: cart.items.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

const updateInstruction = async (req, res) => {
  try {
    const { instruction, productId, kg } = req.body;

    const userId = req.session?.user?._id;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json({ error: "cart not found" });
    }

    const item = cart.items.find(
      (item) => item.kg == kg && item.product.toString() == productId
    );
    console.log("intrr", instruction);

    item.instruction = instruction;
    await cart.save();
    console.log("edit inster  ", cart);

    return res.status(200).json({ message: "save changes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { message, productId, kg } = req.body;
    console.log(message, productId, kg);

    const userId = req.session?.user?._id;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json({ error: "cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() == productId && item.kg == kg
    );

    item.message = message;
    await cart.save();
    console.log("edit messagge", cart);

    return res.status(200).json({ message: "save changes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error " });
  }
};

module.exports = {
  addToCart,
  renderCart,
  updatesCartQuantity,
  removeCart,
  updateInstruction,
  updateMessage,
};
