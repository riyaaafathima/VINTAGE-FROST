const cartModel = require("../model/user/cart");
const Coupon = require("../model/admin/coupon");

exports.checkCoupon = async (userId) => {
  try {
    const cart = await cartModel.findOne({ user: userId });

    if (cart.coupon) {
      const coupon = await Coupon.findOne({ _id: cart.coupon });
      console.log(coupon, "ghjkl;");

      if (
        coupon.minimumPurchaseAmount &&
        coupon.minimumPurchaseAmount > cart.total
      ) {
        cart.coupon = null;
        (cart.couponCode = null),
          (cart.couponDiscount = null),
          await cart.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
