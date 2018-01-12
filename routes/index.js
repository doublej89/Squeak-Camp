var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get("/", function(req, res) {
	res.render("landing");
});

router.get("/register", function(req, res) {
	res.render("register");
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === 'secretcode') {
      newUser.isAdmin = true;
    }
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
            return res.redirect('/register');
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Successfully Signed Up! Welcome to the club " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {

});

router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

router.get('/forgot', function(req, res) {
	res.render("forgot");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;