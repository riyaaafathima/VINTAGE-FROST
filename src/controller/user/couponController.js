const coupon = require("../../model/admin/coupon");
const Coupon = require("../../model/admin/coupon");
const cartModel = require("../../model/user/cart");
const mongoose = require("mongoose");

const couponBadge = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    const { couponCode, couponId } = req.body;

    console.log(req.body);
    const currentDate = new Date();
    console.log(currentDate);

    const coupon = await Coupon.findOne({
      _id: new mongoose.Types.ObjectId(couponId),
      expiryDate: { $gt: currentDate },
    });
console.log("coupon===",coupon);

    if (!coupon) {
      return res.status(404).json("no coupon is found");
    }

    const cart = await cartModel.findOne({ user:userId });
    if (!cart) {
      return res.status(404).json("cart not found");
    }

    if (cart.total < coupon.minimumPurchaseAmount) {
      return res
        .status(403)
        .json("Coupon Minimum Purchase Amount is not reached");
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          coupon: coupon._id,
          couponCode: couponCode,
          couponDiscount: coupon.offerAmount,
        },
      }
    );

    if (!updatedCart) {
      return res.status(404).json("Cart could not update!");
    }

    return res.status(200).json({
      discount: coupon.offerAmount,
      couponCode,
    });
  } catch (error) {
    console.log(error);
  }
};



const removeCoupon=async(req,res)=>{
    try {
        const userId= req.session?.user?._id
        const updatedCart=await cartModel.findOneAndUpdate(
           {user:userId},
           {
            $set:{
                coupon:null,
                couponCode:null,
                couponDiscount:null

            },
           },
           {new:true}   
        );
        if (!updatedCart) {
            return res.status(404).json('mot found')
        }
       return res.status(200).json({message:'successfully removed',updatedCart})
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = { couponBadge,removeCoupon };
