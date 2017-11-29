var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds");
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;

	var newCampground = { name: name, image: image };

	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});
app.listen(3000, function() {
	console.log("SqueakCamp begins");
});