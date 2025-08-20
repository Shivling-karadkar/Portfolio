var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession=require('express-session');
const cors = require('cors');
var passport=require('passport')
var profileRouter = require('./routes/profileroute');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userModel = require('./routes/users');


var app = express();
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use(cors({
  origin:[
    "http://localhost:3001",               // local development
    "https://elegant-muffin-173b17.netlify.app"  ,// deployed frontend
    "https://shivlingkaradkar.netlify.app/"
  ],
  credentials: true
}));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"Pass@123"
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profile',profileRouter);

module.exports = app;

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});