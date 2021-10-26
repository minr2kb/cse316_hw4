var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	location: { type: String, required: true },
	img: { type: String },
});

//Export model
module.exports = mongoose.model("User", UserSchema);
