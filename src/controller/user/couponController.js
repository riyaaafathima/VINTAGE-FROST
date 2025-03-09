
const Coupon= require('../../model/admin/coupon')
const cartModel=require('../../model/user/cart')


const couponBadge=async(req,res)=>{
    try {
        const userId=req.session?.user?._id
        const {couponCode}=req.body

    console.log(req.body);
    
       const coupon = await Coupon.findOne({
            couponCode,
            expiryDate: { $gt: currentDate },
          });

          if(!coupon){
     return res.status(404).json('no coupon is found')
          }

          if (coupon.currentUsageCount === coupon.maximumUses) {
            return res.status(404).json("Coupon Usage Limit Reached")
        }


        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json('cart not found')
        }

        if (cart.grandTotal < coupon.minimumPurchaseAmount) {
            return res.status(404).json('Coupon Minimum Purchase Amount is not reached')
        }

        
    const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cart._id },
        {
          $set: {
            coupon: coupon._id,
            couponCode:couponCode,
            couponDiscount: coupon.offerAmount,
          },
        }
      );
    

      if (!updatedCart) {
        return res.status(404).json('Cart could not update!')
    }

      res.status(200).json({
        discount: coupon.offerAmount,
        couponCode: code,
      });
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={couponBadge}