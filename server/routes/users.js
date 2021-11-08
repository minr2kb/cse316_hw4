const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const { wrapAsync } = require("../utils/helper");
const { requireLogin } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
	"/register",
	wrapAsync(async function (req, res) {
		const { password, email, name } = req.body;
		const user = new User({
			email,
			password,
			name,
			location: "",
			profile_url: "",
		});
		await user.save();
		req.session.userId = user._id;
		// Note: this is returning the entire user object to demo, which will include the hashed and salted password.
		// In practice, you wouldn't typically do this – a success status would suffice, or perhaps just the user id.
		res.json(user);
	})
);

router.post(
	"/login",
	wrapAsync(async function (req, res) {
		const { password, email } = req.body;
		const user = await User.findAndValidate(email, password);
		if (user) {
			req.session.userId = user._id;
			res.sendStatus(204);
		} else {
			res.sendStatus(401);
		}
	})
);

router.post(
	"/logout",
	wrapAsync(async function (req, res) {
		req.session.userId = null;
		res.sendStatus(204);
	})
);

router.put(
	"/api/users/:id",
	requireLogin,
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		console.log(
			"PUT with id: " + id + ", body: " + JSON.stringify(req.body)
		);
		await User.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				location: req.body.location,
				profile_url: req.body.profile_url,
			},
			{ runValidators: true }
		);
		res.sendStatus(204);
	})
);

router.delete(
	"/api/users/:id",
	requireLogin,
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		const result = await User.findByIdAndDelete(id);
		console.log("Deleted successfully: " + result);
		res.json(result);
	})
);

router.get(
	"/api/users/:id",
	wrapAsync(async function (req, res, next) {
		let id = req.params.id;
		if (mongoose.isValidObjectId(id)) {
			const user = await User.findById(id);
			if (user) {
				res.json(user);
				return;
			} else {
				throw new Error("User Not Found");
			}
		} else {
			throw new Error("Invalid user Id");
		}
	})
);

module.exports = router;
