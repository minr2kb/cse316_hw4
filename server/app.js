const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const User = require("./models/User");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Set up mongoose connection
var mongoDB = "mongodb://localhost:27017/MyNote"; // insert your database URL here
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Changing this setting to avoid a Mongoose deprecation warning:
// See: https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set("useFindAndModify", false);

// This is a function we can use to wrap our existing async route functions so they automatically catch errors
// and call the next() handler
function wrapAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch(e => next(e));
	};
}

// This is middleware that will run before every request
app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	// Calling next() makes it go to the next function that will handle the request
	next();
});

// There can be multiple middleware – this one only triggers if this route is accessed
app.use("/api/users/:id", (req, res, next) => {
	console.log("Request involving a specific author");
	next(); // Try commenting out this next() and accessing a specific author page
});

app.get(
	"/api/users/:id",
	wrapAsync(async function (req, res, next) {
		let id = req.params.id;
		if (mongoose.isValidObjectId(id)) {
			const user = await User.findById(id);
			if (user) {
				res.json(user);
				return;
			} else {
				// The thrown error will be handled by the error handling middleware
				throw new Error("Author Not Found");
			}
		} else {
			throw new Error("Invalid Author Id");
		}
	})
);

app.post(
	"/api/users",
	wrapAsync(async function (req, res) {
		console.log("Posted with body: " + JSON.stringify(req.body));
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			location: req.body.location,
		});
		// Calling save is needed to save it to the database given we aren't using a special method like the update above
		await newUser.save();
		res.json(newUser);
	})
);

app.put(
	"/api/users/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		console.log(
			"PUT with id: " + id + ", body: " + JSON.stringify(req.body)
		);
		// This below method automatically saves it to the database
		// findByIdAndUpdate by default does not run the validators, so we need to set the option to enable it.
		await User.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				email: req.body.email,
				location: req.body.location,
			},
			{ runValidators: true }
		);
		// Status 204 represents success with no content
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
		res.sendStatus(204);
	})
);

app.delete(
	"/api/users/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		const result = await User.findByIdAndDelete(id);
		console.log("Deleted successfully: " + result);
		res.json(result);
	})
);

app.use("/api/notes/:id", (req, res, next) => {
	console.log("Request involving a specific author");
	next(); // Try commenting out this next() and accessing a specific author page
});

app.get(
	"/api/notes",
	wrapAsync(async function (req, res) {
		const notes = await Note.find({});
		res.json(notes);
	})
);

// The React app does not call the below methods, but these are further examples of using Express
app.post(
	"/api/notes",
	wrapAsync(async function (req, res) {
		console.log("Posted with body: " + JSON.stringify(req.body));
		const newNote = new Note({
			text: req.body.text,
			lastUpdatedDate: req.body.lastUpdatedDate,
		});
		// Calling save is needed to save it to the database given we aren't using a special method like the update above
		await newNote.save();
		res.json(newNote);
	})
);

app.put(
	"/api/notes/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		console.log(
			"PUT with id: " + id + ", body: " + JSON.stringify(req.body)
		);
		// This below method automatically saves it to the database
		// findByIdAndUpdate by default does not run the validators, so we need to set the option to enable it.
		await Note.findByIdAndUpdate(
			id,
			{
				text: req.body.text,
				lastUpdatedDate: new Date.now(),
			},
			{ runValidators: true }
		);
		// Status 204 represents success with no content
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
		res.sendStatus(204);
	})
);

app.delete(
	"/api/notes/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		const result = await Note.findByIdAndDelete(id);
		console.log("Deleted successfully: " + result);
		res.json(result);
	})
);

app.use((err, req, res, next) => {
	console.log("Error handling called");
	// If want to print out the error stack, uncomment below
	// console.error(err.stack)
	// Updating the statusMessage with our custom error message (otherwise it will have a default for the status code).
	res.statusMessage = err.message;

	if (err.name === "ValidationError") {
		res.status(400).end();
	} else {
		// We could further interpret the errors to send a specific status based more error types.
		res.status(500).end();
	}
});

port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log("server started!");
});
