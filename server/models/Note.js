var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	text: { type: String },
	lastUpdatedDate: { type: Date, default: new Date() },
	agent: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

//Export model
module.exports = mongoose.model("Note", NoteSchema);
