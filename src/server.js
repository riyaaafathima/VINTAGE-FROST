const connectDb = require("./config/db/dbConnection");
const app = require("./index");

(function init() {
    connectDb();

    const PORT= 4000              

    app.listen(PORT,()=>{
        // console.log(`server is running 👽 ${PORT}`);
        console.log(`server is start on http://localhost:${PORT}/home-page`); 
    })  
    
})()            
    
       