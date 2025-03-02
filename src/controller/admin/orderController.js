const orderModel= require('../../model/user/order')
const orderListController=async(req,res)=>{
try {
   

    const orderList= await orderModel.find({})
    console.log(orderList[0]);
    
    
    res.render('admin/page-orders-1',{orderList})
    
} catch (error) {
    console.log(error);
    
}
}

const orderDetailsController=async(req,res)=>{
    try {
        const {orderId}=req.params
        const orderDetails=await orderModel.findById(orderId)
        console.log(orderDetails);
          
          
        res.render('admin/order-details',{
            orderDetails
        })
    } catch (error) {
        console.log(error);
        
    }
}



module.exports={
    orderListController,
   orderDetailsController
}