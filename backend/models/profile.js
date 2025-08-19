var express = require('express');
var router = express.Router();
const mongoose=require('mongoose')



const profileSchema=mongoose.Schema({
  profilepic:{
    type:String,
    require:true
  },
  name : {
    type:String,
    require:true
  },

  contact :{
    type:String,
    require:true
  },
  email :{
    type:String,
    require:true
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    require :true
  }
});


module.exports = mongoose.model("profile",profileSchema);
