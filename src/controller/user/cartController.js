const cartModel = require("../../model/user/cart");
const productModel=require('../../model/admin/product')


const   addToCart = async(req, res) => {
  console.log("cart body", req.body);
  try {
    const { price, kg, eggpeference, instruction, message, productId } =
      req.body;

    const userId = req.session?.user?._id;

    if (!userId) {
      res.status(200).json("please login");
    }
const isEggless=eggpeference==='EGG'?true:false
    const isCartAvailable= await cartModel.findOne({user:userId})
    console.log("gfhjhnfh",isCartAvailable);
    
    if (!isCartAvailable) {
        const cart = new cartModel({
            user: userId,
            items: [
              {
                product: productId,
                kg,
                price,
                instruction,
                message,
                isEggless,
                quantity:1
            
              },
            ],
            total: price,
          });

          await cart.save()
          return res.status(200).json('cart is created')
    }else{
        
      const item =  {
            "product": productId,
            kg,
            price,
            instruction,
            message,
            isEggless,
            quantity:1
          }
        isCartAvailable.items.push(item)
        isCartAvailable.total+=price;
        

await isCartAvailable.save()
return res.status(200).json('items added')
    }

  } catch (error) {
    console.log(error);
  }
};

const renderCart = async (req, res) => {
  try {
    const userId = req.session?.user?._id; 
    if (!userId) {
      return res.redirect('/login');  
    }

    const cart = await cartModel.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'products',
      match: { isActive: true }, 
      
    });

    if (!cart) {
    return render('user/cart', { cart:null });
      
    }
    console.log(cart,'cart');
    res.render('user/cart',{cart});
    

  } catch (error) {
    console.error(error);
  }
};   

const updatesCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session?.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please log in" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find the item in the cart and update its quantity 

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0); // Recalculate total
    await cart.save();

    res.json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




module.exports = { addToCart ,renderCart,updatesCartQuantity};
