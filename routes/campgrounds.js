var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");
var geocoder = require('geocoder');


router.get("/", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else{
			console.log(req.user);
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});	
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	geocoder.geocode(req.body.location, function(err, data) {
		var lat = data.results[0].geometry.location.lat;
	    var lng = data.results[0].geometry.location.lng;
	    var location = data.results[0].formatted_address;
	    var newCampground = { name: name, image: image, description: desc, author: author, price: price, location: location, lat: lat, lng: lng };
	    Campground.create(newCampground, function(err, newlyCreated) {
			if (err) {
				console.log(err);
				req.flash("error", "Could not create resort!");
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds");
			}
		});	
	});	
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
});

router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Item not found!");
			res.redirect("/campgrounds");
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
	geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash("error", "Couldn't remove the item!");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;