const wishlistModel = require("../../model/user/wishlist");

const whishlistPageRender = (req, res) => {
  try {
    res.render("user/wishlist",{user:true});
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};      

const addToWhishList=async(req,res)=>{
    try {
        const userId=req.session?.user?._id
        const{productId}=req.body       
        console.log(productId,'product misdndns');
        
        const wishlist=await wishlistModel.findOne({user:userId})     
         
         if(!wishlist){
             wishlist=new wishlistModel({
                 user:userId, 
                 products:[productId]
                })
            }
   
       await wishlist.save()
       res.status(200).json({user:true,wishlist})
    } catch (error) {     
        console.log(error);
        res.status(500).json({error})
    }
}

module.exports = { whishlistPageRender,addToWhishList };
