const User = require("../models/User");
const { wrapAsync } = require("../utils/helper");

module.exports.requireLogin = (req, res, next) => {
	if (!req.session.userId) {
		throw new Error("Need to login first");
	}
	next();
};

module.exports.isCreator = wrapAsync(async (req, res, next) => {
	const id = req.params.id;
	const note = await Note.findById(id);
	if (note.creator && !note.creator.equals(req.session.userId)) {
		throw new ExpressError("Not an authorized user for this note", 401);
	}
	next();
});
