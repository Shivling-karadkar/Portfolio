const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const cors = require('cors');
const passport = require('passport');

// Routers
const profileRouter = require('./routes/profileroute');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userModel = require('./routes/users');
const PORT = process.env.PORT || 5000; 
const app = express();

// ----- CORS Setup -----
const corsOptions = {
  origin: [
    "http://localhost:3001",               // local frontend
    "https://portfolio-1-6xm8.onrender.com", // deployed backend
    "https://shivlingkaradkar.netlify.app"   // deployed frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));

// ----- Express Setup -----
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----- Session & Passport -----
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "Pass@123"
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// ----- Routes -----
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profile', profileRouter);

// ----- Start Server -----
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
module.exports = app;
