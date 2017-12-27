var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");

var data = [
	{
		name: "Empty Peace",
		image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg",
		description: "wherever, whenever, whichever"
	},
	{
		name: "Retarded Scene",
		image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg",
		description: "Retards do retarded things all the time because they are retards"
	},
	{
		name: "Creepy Vibe",
		image: "https://farm9.staticflickr.com/8161/7360193870_cc7945dfea.jpg",
		description: "You're not sure if your scared or transfixed or both, because it confuses the hell out of your survival instincts"
	}
]

function seedDB() {
	Campground.remove({}, function(err){
		if (err) {
			console.log(err);
		}
		console.log("removed campgrounds!");

		// data.forEach(function(seed) {
		// 	Campground.create(seed, function(err, createdData) {
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			console.log("added a campground");
		// 			Comment.create({
		// 				text: "The place is great, but I wish there was more internet",
		// 				author: "Homer"
		// 			}, function(err, comment) {
		// 				if (err) {
		// 					console.log(err);
		// 				} else {
		// 					createdData.comments.push(comment);
		// 					createdData.save(function(err, d) {
		// 						if (err) {
		// 							console.log(err);
		// 						} else {
		// 							console.log("Comment pushed in");
		// 						}
		// 					});
		// 					console.log("Created new comment");
		// 					//console.log(createdData);
		// 				}
		// 			});
		// 		}
		// 	});
		// });
	});
}

module.exports = seedDB;