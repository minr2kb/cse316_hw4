var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	location: { type: String, required: true },
});

// // Virtual for bookinstance's URL
// BookInstanceSchema
//     .virtual('url')
//     .get(function () {
//         return '/catalog/bookinstance/' + this._id;
//     });

//Export model
module.exports = mongoose.model("User", UserSchema);
