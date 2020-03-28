//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get("/", function(req,res){
  res.render("index");
});

app.get("/products", function(req,res){
  res.render("products");
});

app.get("/careers", function(req,res){
  res.render("careers");
});

app.listen(3000, function(){
  console.log("Server is running on the port 3000");
});
