const app = require("./index");
(function init() {
    const PORT= 3001

    app.listen(PORT,()=>{
        // console.log(`server is running 👽 ${PORT}`);
        console.log(`server is start on http://localhost:${PORT}`);
        
        
    })  
    
})()
   

