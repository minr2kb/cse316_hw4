const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");
const BookInstance = require("../models/bookinstance");
const { requireLogin, isCreator } = require("../middleware/auth");
const { wrapAsync } = require("../utils/helper");

// Multer is middleware for multipart form data: https://www.npmjs.com/package/multer
const multer = require("multer");
// This part is a temporary place to store the uploaded files
// In actual development we would not store it on the local server
const upload = multer({ dest: "uploads/" });

// upload.single('image') tells it we are only uploading 1 file, and the file was named "image" on the front end client.
// router.post(
// 	"/users/:id/file",
// 	upload.single("image"),
// 	wrapAsync(async function (req, res) {
// 		// You can see the file details here – it also gets automatically saved into the uploads folder
// 		// Again, this is an example of how this works but you would do something a little different in production.
// 		console.log("File uploaded of length: " + req.file.size);
// 		console.dir(req.file);
// 		res.json("File uploaded successfully");
// 	})
// );

// Using an async function to be able to use the "await" functionality below, which makes
// the find command run synchronously.
router.get(
	"/api/notes",
	requireLogin,
	wrapAsync(async function (req, res) {
		const notes = await Note.find({ creator: req.session.userId }).sort({
			lastUpdatedDate: 1,
		});
		res.json(notes);
	})
);

// This now calls the isAgent function, which checks if the author has an agent, and if so requires
// the logged in user to be that agent, otherwise the request is denied.

router.delete(
	"/api/notes/:id",
	isCreator,
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		const result = await Note.findByIdAndDelete(id);
		console.log("Deleted successfully: " + result);
		res.json(result);
	})
);

router.put(
	"/api/notes/:id",
	isCreator,
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		console.log(
			"PUT with id: " + id + ", body: " + JSON.stringify(req.body)
		);
		await Note.findByIdAndUpdate(
			id,
			{
				text: req.body.text,
				lastUpdatedDate: new Date(),
			},
			{ runValidators: true }
		);
		res.sendStatus(204);
	})
);

// The React app does not call the below methods, but these are further examples of using Express
router.post(
	"/api/notes",
	requireLogin,
	wrapAsync(async function (req, res) {
		console.log("Posted with body: " + JSON.stringify(req.body));
		const newNote = new Note({
			text: req.body.text,
			lastUpdatedDate: req.body.lastUpdatedDate,
			creator: req.session ? req.session.userId : null,
		});
		await newNote.save();
		res.json(newNote);
	})
);

module.exports = router;
