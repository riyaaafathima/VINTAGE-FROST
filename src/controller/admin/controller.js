const userModel = require("../../model/user/user");



const dashboardRender = (req, res) => {
  try {
    res.render("admin/index");
  } catch (error) {
    console.log(error);
  }
};


const getAllproducts=(req,res)=>{
  try {
    res.render('admin/page-products-list')
  } catch (error) {
    
  }
}

const addProduct=(req,res)=>{
  try{
    res.render('admin/add-product')

  }catch(error){
 
  }
}

const addProductController=(req,res)=>{
  try{
  console.log(req.body,'this is req.body');

  console.log(req.file)

 
 
  
  
  }catch(error){
    console.log(error);
    

  }
}

const userDetailsRender = async (req, res) => {
  try {
    const allUser = await userModel.find({});

    res.render("admin/page-user-list", {
      allUser,
    });
  } catch (error) {
    console.log(error);
  }
};


const blockuser= async(req,res)=>{
  try {
    const userId=req.param.id
  
    const updateUser= await user.findByIdAndUpdate(
      userId,{$set:{status:false}},{new:true}  // new return updated doc
      
    );

    if (!updateUser) {

      return res.status(404).json({message:'user not found'})
    }


    const action= status?'blocked':'unblocked'
    res.status(200).json({message:`user succesfully ${action}`,user:updateUser})
  } catch (error) {
    console.log('error blocking/unvlocking user',error);

  res.status(500).json({message:'server error'})
    
    
    
  }
}

module.exports = { dashboardRender, userDetailsRender,blockuser,getAllproducts,addProduct,addProductController };
