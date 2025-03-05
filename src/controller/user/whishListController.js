const wishlistModel = require("../../model/user/wishlist");
const userModel = require("../../model/user/user");
const cartModel = require("../../model/user/cart");


const whishlistPageRender = (req, res) => {
  try {
   return res.render("user/wishlist",{user:true});
  } catch (error) {
    console.log(error);
   return res.status(500).send("Internal Server Error");
  }
};      

const addToWhishList=async(req,res)=>{
    try {
        const userId=req.session?.user?._id
        const{productId}=req.body       
         console.log(userId,productId);
         
        let wishlist=await wishlistModel.findOne({user:userId})     
         
         if(!wishlist){
             wishlist=new wishlistModel({
                 user:userId, 
                 products:[productId] 
                })      
            }else{
              if(!wishlist.products.includes(productId)){
                   wishlist.products.push(productId);
              }
            }
   
       await wishlist.save()
       console.log(wishlist);
       
      return res.status(200).json({user:true,wishlist})
    } catch (error) {     
        console.log(error);
       return res.status(500).json({error})
    } 
}     

const getWishlist=async(req,res)=>{
try {
  const userId=req.session?.user?._id

  const wishlist=await wishlistModel.findOne({user:userId}).populate('products')
    
 
  if(!wishlist){
    return res.status(401).json({message:'no wishlist'})   
  }
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
  
 
 return res.render("user/wishlist",{user,cartCount,wishlist:wishlist});
} catch (error) {
  console.log(error);
  return res.status(500).json({message:error.message})
}
}



const removeWishList=async(req,res)=>{
  try {
    const userId=req.session?.user?._id
    const{ productId}=req.body
    console.log(productId);
    
    const wishlist=await wishlistModel.findOne({user:userId})


    if(!wishlist){
      return res.status(400).json({message:'no wishlist'})
    }
    wishlist.products=wishlist.products.filter((id)=>id)

    wishlist.products=wishlist.products.filter(
      (id)=>
        id.toString()!==productId.toString()
    );
    await wishlist.save()

    return res.status(200).json({message:'product removed'})
  } catch (error) {
    console.log(error);    
    return res.status(500).json({error})
    
  }
}            




module.exports = { whishlistPageRender,addToWhishList,getWishlist,removeWishList };
