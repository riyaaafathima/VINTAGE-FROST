const orderPageRender=(req,res)=>{
    try {

        res.render('user/order')
        
    } catch (error) {
       return res.status(400).json({error:'something went wrong'})
    }
}








module.exports={orderPageRender}