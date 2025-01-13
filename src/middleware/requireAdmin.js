

const requireAdmin=(req,res,next)=>{
    if(req.session.isAdmin){
        next()
    }else{
        return res.redirect('/login')
    }
}
module.exports=requireAdmin