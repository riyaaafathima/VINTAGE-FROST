const orderModel= require('../../model/user/order')
const orderListController=async(req,res)=>{
try {
   

    const orderList= await orderModel.find({})
    // console.log(orderList[0]);
    
    
    res.render('admin/page-orders-1',{orderList})
    
} catch (error) {
    console.log(error);
    
}
}

const orderDetailsController=async(req,res)=>{
    try {
        const {orderId}=req.params
        const orderDetails=await orderModel.findById(orderId)
        // console.log(orderDetails);   
          
          
        res.render('admin/order-details',{
            orderDetails
        })
    } catch (error) {
        console.log(error);
        
    }
}


const updateOrderStatus=async(req,res)=>{
    try {
        const{orderId,productId}=req.params
        
        const{status}=req.body

        const order= await orderModel.findById(orderId)
        console.log(order);
        

        const product=order.products.id(productId);
        console.log(product,'thus is my isoissiiosiodi');
        

        product.status=status

        
        
        
        await order.save()
        console.log(status,'status');
    return res.status(200).json("status updated succesfully");
   
    } catch (error) {
        console.log(error);
        
    }
}



module.exports={
    orderListController,
   orderDetailsController,
   updateOrderStatus
}