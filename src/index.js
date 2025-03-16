const express = require("express");
const multer=require('multer')
const session = require("express-session");
const googleRouter= require('./router/user/google')
const userRouter = require("./router/user/route");
const adminRouter=require('./router/admin/route')
const connectDb = require("./config/db/dbConnection");
const passport=require('passport')


const path = require("path");

const app = express();

const upload=multer()

// app.use(upload.none())           

 
app.use(
  session({
    secret: "hihellobrry",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1200000,
      sameSite: true,
    },
  })
);

app.use(passport.initialize());  

app.use(passport.session());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

    


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}); 


    
app.use('/admin',adminRouter);
app.use(userRouter);
app.use('/auth',googleRouter)

app.get("*",(req,res)=>{
  res.render('common/404')
})



connectDb();     

module.exports = app;
    


