const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
// const app_host = process.env.APP_HOST;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const methodOverride = require("method-override");
const indexRouter = require("./api/v1/routes/index");
const session = require("express-session");


app.set("views", path.join(__dirname, "api/v1/Views"));
app.use(express.static(__dirname + "/public"));



app.set("view engine", "ejs");
app.use(express.json()); //parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({
  origin: '*',

}));



app.use(express.static(__dirname + "/public"));
app.use("/uploads",express.static(__dirname + "/uploads"));
app.use(methodOverride("_method"));

app.get("/a", (req,res)=>{
    res.render("index");
});

app.get("/", (req,res)=>{
  res.status(200).send("i am working fine");
})
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});