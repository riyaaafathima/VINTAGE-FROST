const couponModel = require("../../model/admin/coupon");

const couponListPage = async(req, res) => {
  try {
  const coupons=await couponModel.find({})

    res.render("admin/coupon-list",
    {coupons}
   );
  } catch (error) {
    console.log(error);
  }
};


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
  
  
module.exports = { couponListPage, addCoupon,createCouponPage,editCoupon,updateCoupon };  
