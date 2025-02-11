const checkoutRender=(req,res)=>{
    try {
        res.render('user/checkout')

        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={checkoutRender}