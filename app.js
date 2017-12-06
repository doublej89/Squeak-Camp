var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/sqeak_camp", {
	useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

var campGroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campGroundSchema);
// Campground.create(
// 	{ name: "Random Place", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg" },
// 	function(err, campground){
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED CAMPGROUND: ");
// 			console.log(campground);
// 		}
// 	}
// );


app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	});	
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc };

	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});	
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});

app.get('/campgrounds/:id', function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
	
});

app.listen(3000, function() {
	console.log("SqueakCamp begins");
});