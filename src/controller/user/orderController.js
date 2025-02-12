const addressModel= require('../../model/user/address');
const orderPageRender = (req, res) => {
  try {
    res.render("user/order", { user: true });
  } catch (error) {
    return res.status(400).json({ error: "something went wrong" });
  }
};

const placeOrder = async(req, res) => {
  try {
    const { paymentMethod, addressId } = req.body;
    const userId = req.session?.user?._id;

    if (!userId) {
       res.status(400).json({error:'userId is not found'})
        
    }

    if (!addressId) {
        res.status(400).json({error:'address required'})
         
     }
   
 
    const userAddress= await addressModel.findOne({user:userId})

    if (!address) {
        res.status(400).json({error:'address required'})
         
     }

     const address=userAddress.addresses.find((address)=>{
        address._id.equals(addressId)
     })


   
  } catch (error) {

  }
};

module.exports = { orderPageRender, placeOrder };
