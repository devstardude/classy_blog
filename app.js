//jshint esversion:6
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require("bcryptjs");
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const connectMongo = require('connect-mongo');
const methodOverride = require('method-override');

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
const onlineDbLink = String(process.env.MONGO) ;
const localDbLink = "mongodb://localhost:27017/authenticateDB";
mongoose
  .connect(
    onlineDbLink,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload());
// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const mongoStore = connectMongo(session);
// Express session
app.use(
  session({
    secret: 'secret',
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true,
    maxAge : 3600000
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//----------local require
const homepage = require("./controllers/getHomepage");
const getRegister = require("./controllers/getRegisterUser");
const postRegister = require("./controllers/postRegisterUser");
const getLogin = require("./controllers/getLoginUser");
const postLogin = require("./controllers/postLoginUser");
const getLogout = require("./controllers/getLogout");
const getCreatePost = require("./controllers/getCreatePost");
const postCreatePost = require("./controllers/postCreatePost");
const getSinglePost = require("./controllers/getSinglePost");
const getAbout = require("./controllers/getAbout");
const getMyPost = require("./controllers/getMyPost");
const postDeleteArticle = require("./controllers/postDeleteArticle");
const myPostEdit = require("./controllers/myPostEdit");
const putMyPostEdit = require("./controllers/putMyPostEdit");
//----------middleware require
const { ensureAuthenticated, forwardAuthenticated } = require("./middleware/auth");



// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.auth = req.user;
  next();
});

// ----------------Routes
//------------GET 
app.get("/", homepage);
app.get("/users/register", forwardAuthenticated, getRegister);
app.get("/users/login", forwardAuthenticated, getLogin);
app.get("/users/logout", getLogout);
app.get("/posts/new", ensureAuthenticated, getCreatePost);
app.get("/post/:id", getSinglePost);
app.get("/about", getAbout);
app.get("/mypost", ensureAuthenticated, getMyPost);
app.get("/mypost/edit/:id", myPostEdit);
//---------POST
app.post("/users/register", postRegister);
app.post("/users/login", postLogin);
app.post("/posts/new", ensureAuthenticated, postCreatePost);

app.delete("/mypost/:id", postDeleteArticle);

app.put("/mypost/edit/:id", putMyPostEdit);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
