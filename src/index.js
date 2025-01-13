const express = require("express");
const session = require("express-session");
const userRouter = require("./router/user/route");
const adminRouter=require('./router/admin/route')
const connectDb = require("./config/db/dbConnection");

const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");


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

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use('/admin',adminRouter);
app.use(userRouter);

connectDb();

module.exports = app;
