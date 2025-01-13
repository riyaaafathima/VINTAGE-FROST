const preventNavigation=(req,res,next)=>{
    if(req.session.user ){
        res.redirect('/home-page')
      
    }else if(req.session.isAdmin){
      res.redirect('/dashboard')
       
    }else{
        next()
    }

}

module.exports=preventNavigation

