//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(session({
  secret: "MeghaOS is a powerful OS",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/meghaUserDB",{ useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  contact: Number
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.post("/register", function(req,res){
  User.register({name: req.body.name, username: req.body.username, contact:req.body.number},req.body.password, function(err){
    if(err){
      console.log(err);
      res.redirect("/signin");
    }
    else{
        passport.authenticate("local")(req,res, function(){
          res.redirect("/success");
        });
      }
  });
});

app.post("/signin",function(req,res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/success");
      });
    }
  });



});



app.get("/success",function(req,res){

  if(req.isAuthenticated()){
    res.render("success");
  }
    else{
      res.redirect("/signin");
    }
  });


app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});


app.get("/", function(req,res){
  res.render("index");
});

app.get("/products", function(req,res){
  res.render("products");
});

app.get("/careers", function(req,res){
  res.render("careers");
});

app.get("/apply",function(req,res){
  res.render("apply");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/signin",function(req,res){

  if(req.isAuthenticated()){
    res.render("success");
  }
  res.render("signin");
});



app.listen(3000, function(){
  console.log("Server is running on the port 3000");
});
