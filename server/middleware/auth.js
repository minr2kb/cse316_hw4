const User = require("../models/User");
const { wrapAsync } = require("../utils/helper");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.session.userId) {
		throw new Error("Need to login first");
	}
	next();
};

module.exports.isAgent = wrapAsync(async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id);
	if (user.agent && !user.agent.equals(req.session.userId)) {
		throw new ExpressError("Not an authorized agent for this note", 401);
	}
	next();
});
