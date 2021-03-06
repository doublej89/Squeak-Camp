require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localPass = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine", "ejs");

//seedDB();
app.locals.moment = require("moment");

app.use(
  require("express-session")({
    secret: "Kuttar Bachcha is a stupid bitch!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPass(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log("SqueakCamp begins");
});
