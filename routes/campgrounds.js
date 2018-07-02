var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");
var geocoder = require("geocoder");
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("only image files are allowed"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dzube23xx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res) {
  var perPage = 8;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Campground.find({ name: regex })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function(err, allCampgrounds) {
        Campground.count({ name: regex }).exec(function(err, count) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            if (allCampgrounds.length < 1) {
              noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("campgrounds/index", {
              campgrounds: allCampgrounds,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search
            });
          }
        });
      });
  } else {
    // get all campgrounds from DB
    Campground.find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function(err, allCampgrounds) {
        Campground.count().exec(function(err, count) {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/index", {
              campgrounds: allCampgrounds,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false
            });
          }
        });
      });
  }
});

router.post("/", middlewareObj.isLoggedIn, upload.single("image"), function(
  req,
  res
) {
  geocoder.geocode(req.body.location, function(err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;

    cloudinary.uploader.upload(req.file.path, function(result) {
      console.log(req.file.path);
      var name = req.body.name;
      var image = result.secure_url;
      var desc = req.body.description;
      var price = req.body.price;
      var author = {
        id: req.user._id,
        username: req.user.username
      };
      var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author,
        price: price,
        location: location,
        lat: lat,
        lng: lng
      };
      Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
          req.flash("error", "Could not create resort!");
          res.redirect("back");
        } else {
          res.redirect("/campgrounds/" + newlyCreated.id);
        }
      });
    });
  });
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
  res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Item not found!");
        res.redirect("/campgrounds");
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

router.put(
  "/:id",
  middlewareObj.checkCampgroundOwnership,
  upload.single("image"),
  function(req, res) {
    geocoder.geocode(req.body.location, function(err, data) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;

      cloudinary.uploader.upload(req.file.path, function(result) {
        var name = req.body.name;
        var image = result.secure_url;
        var desc = req.body.description;
        var price = req.body.price;
        var author = {
          id: req.user._id,
          username: req.user.username
        };
        var newData = {
          name: name,
          image: image,
          description: desc,
          author: author,
          price: price,
          location: location,
          lat: lat,
          lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, { $set: newData }, function(
          err,
          campground
        ) {
          if (err) {
            req.flash("error", "Couldn't update campground: " + err.message);
            res.redirect("back");
          } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      });
    });
  }
);

router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      req.flash("error", "Couldn't remove the item!");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
