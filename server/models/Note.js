var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	text: { type: String, required: true },
	lastUpdatedDate: { type: Date, default: new Date() },
});

// // Virtual for author's full name
// AuthorSchema.virtual("name").get(function () {
// 	return this.family_name + ", " + this.first_name;
// });

// // Virtual for author's lifespan
// AuthorSchema.virtual("lifespan").get(function () {
// 	return (
// 		this.date_of_death.getYear() - this.date_of_birth.getYear()
// 	).toString();
// });

// // Virtual for author's URL
// AuthorSchema.virtual("url").get(function () {
// 	return "/catalog/author/" + this._id;
// });

//Export model
module.exports = mongoose.model("Note", NoteSchema);
