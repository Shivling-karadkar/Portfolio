var express = require('express');
const passport = require('passport');
var router = express.Router();
var profilerouter =require('./profileroute');

const userModel=require('./users')

const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index');
});



router.post('/register', function (req,res){
   var userdata = new userModel({
     username :req.body.username,
    secret:req.body.secret
 
   });
   

   userModel.register(userdata,req.body.password)
   .then((resgisteduser)=>{
    passport.authenticate("local")(req,res,function(){
      res.status(200).json({message : "Registration SucessFull"}); 
    })
   })
   .catch((err)=>{
    console.log("registeraion error",err);
    res.status(400).send("regestraion fail");
    res.redirect('/')
   })
   
   
});




router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err || !user )
      return res.status(401).json({message : "Login Failed"});

    req.logIn(user,(err)=>{
      if(err)
        return next(err);
      return res.status(200).json({message:"Login Success",user:{
        _id:user._id,
        username:user.username
      }});
    });
    
  })(req,res,next);
})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if (err){
      return next(err);
    }
     res.status(200).json({ message: 'Logout successful' });
  })
})

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}



module.exports = router;
