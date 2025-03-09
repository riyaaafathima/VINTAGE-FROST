exports.checkCoupon = async (userId) => {
  try {
    const cart = await cartModel.findOne({ userId });

    if (cart.coupon) {
      const coupon = await Coupon.findOne({ _id: cart.coupon });

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