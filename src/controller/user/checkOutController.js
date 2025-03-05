const userModel = require("../../model/user/user");
const addressModel = require("../../model/user/address");
const cartModel = require("../../model/user/cart");

const checkoutRender = async (req, res) => {
  try {
    const userId = req.session?.user?._id;

    console.log(userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const cart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
    });
    console.log(cart);

     
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    let userAddress = await addressModel.findOne({ user: userId });
    const packagePrice = cart.items.reduce(
      (acc, item) => (acc += item.quantity * 20),
      0
    );

    let user = null; 
    let cartCount=0 
    if (req.session?.user) {
      const id = req.session?.user?._id;
      user = await userModel.findById(id);
      user = user.username;
     const cart =await cartModel.findOne({user:id});
     if(cart){
      cartCount=cart.items.length
     }
    }    
    
    res.render("user/checkout", {
      user,
      userAddress,
      cart,
      cartCount,
      packagePrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { checkoutRender };
