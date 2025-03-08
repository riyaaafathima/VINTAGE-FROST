const couponModel = require("../../model/admin/coupon");

const couponListPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page number from query, default to 1
    const limit = 5; 
    const skip = (page - 1) * limit; 

    const coupons = await couponModel.find().skip(skip).limit(limit);

    // Get total count for pagination
    const totalCoupons = await couponModel.countDocuments();
    const totalPages = Math.ceil(totalCoupons / limit);

    res.render("admin/coupon-list", {
      coupons,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.log(error);
  }
};
;


const addCoupon =async (req, res) => {
    try {
      const {name,
        couponCode,
        expiryDate,
        offerAmount,
        startDate,
        minimumPurchaseAmount,
        maximumUses,


    } = req.body

    const isCouponExist=await couponModel.findOne({
        name
    })
    if (isCouponExist) {
        return res.status(409).json("coupon already exist");
 
    }

    const newCoupon= new couponModel({
        name,
        couponCode,
        expiryDate,
        offerAmount,
        startDate,
        minimumPurchaseAmount,
        maximumUses

    })
      
      await newCoupon.save();
      return res.status(200).json("coupon added successfully");

    } catch (error) {
      console.log(error);
    }
  };


const createCouponPage = (req, res) => {
  try {
   return res.render("admin/add-Coupon");
  } catch (error) {
    console.log(error);
  }
};



const editCoupon = async (req, res) => {
    try {
      const couponId = req.params.id;
      const coupon = await couponModel.findById(couponId);
      if (!coupon) {
        return res.status(404).send('Coupon not found');
      }
      res.render('admin/edit-coupon', { coupon });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  };
  
  

const updateCoupon=async(req,res)=>{
    try {
        const {
            couponCode,
            name,
            expiryDate,
            startDate,
            minimumPurchaseAmount,
            offerAmount,
            maximumUses,
          } = req.body;
      
          const { id } = req.params;
      
          const coupon = await couponModel.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                couponCode,
                name,
                expiryDate,
                startDate,
                minimumPurchaseAmount,
                offerAmount,
                maximumUses,
              },
            },
            { new: true }
          );
      
          if (!coupon) {
return res.status(401).json('couponn not found')
         }
return res.status(200).json("sucess");
 
        } catch (error) {
          console.log(error);
          
        } 
    
}

const removeCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await couponModel.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.status(200).json({ message: 'Coupon permanently deleted' });
    
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { couponListPage, addCoupon,createCouponPage,editCoupon,updateCoupon,removeCoupon };  
