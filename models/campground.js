var mongoose = require("mongoose");

var campGroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	createdAt: {type: Date, default: Date.Now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
},
{
	usePushEach: true
});

module.exports = mongoose.model("Campground", campGroundSchema);