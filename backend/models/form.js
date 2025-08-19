var express = require('express');
var router = express.Router();
const mongoose=require('mongoose')



const contactus=mongoose.Schema({
  name:{
    type:String,
    require:true
  },

  email :{
    type:String,
    require:true
  },
  position :{
    type:String,
    require:true
  },

  bio:{
    type:String,
    require :true
  },
   user: { type: mongoose.Schema.Types.ObjectId, ref: "user"}
});


module.exports = mongoose.model("contactus",contactus);
