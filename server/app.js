const express = require("express");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const BookInstance = require("./models/bookinstance");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Set up mongoose connection
var mongoDB = "mongodb://localhost:27017/LibraryExample"; // insert your database URL here
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
app.use("/api/authors/:id", (req, res, next) => {
	console.log("Request involving a specific author");
	next(); // Try commenting out this next() and accessing a specific author page
});

// Using an async function to be able to use the "await" functionality below, which makes
// the find command run synchronously.
app.get(
	"/api/authors",
	wrapAsync(async function (req, res) {
		const authors = await Author.find({});
		res.json(authors);
	})
);

app.get(
	"/api/authors/:id",
	wrapAsync(async function (req, res, next) {
		let id = req.params.id;
		if (mongoose.isValidObjectId(id)) {
			const author = await Author.findById(id);
			if (author) {
				res.json(author);
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

app.delete(
	"/api/authors/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		const result = await Author.findByIdAndDelete(id);
		console.log("Deleted successfully: " + result);
		res.json(result);
	})
);

app.put(
	"/api/authors/:id",
	wrapAsync(async function (req, res) {
		const id = req.params.id;
		console.log(
			"PUT with id: " + id + ", body: " + JSON.stringify(req.body)
		);
		// This below method automatically saves it to the database
		// findByIdAndUpdate by default does not run the validators, so we need to set the option to enable it.
		await Author.findByIdAndUpdate(
			id,
			{
				first_name: req.body.first_name,
				family_name: req.body.family_name,
			},
			{ runValidators: true }
		);
		// Status 204 represents success with no content
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
		res.sendStatus(204);
	})
);

// The React app does not call the below methods, but these are further examples of using Express
app.post(
	"/api/authors",
	wrapAsync(async function (req, res) {
		console.log("Posted with body: " + JSON.stringify(req.body));
		const newAuthor = new Author({
			first_name: req.body.first_name,
			family_name: req.body.family_name,
			date_of_birth: req.body.date_of_birth,
			date_of_death: req.body.date_of_death,
		});
		// Calling save is needed to save it to the database given we aren't using a special method like the update above
		await newAuthor.save();
		res.json(newAuthor);
	})
);

app.get(
	"/api/books",
	wrapAsync(async function (req, res) {
		const books = await Book.find({});
		res.json(books);
	})
);

app.get(
	"/api/bookinstances",
	wrapAsync(async function (req, res) {
		// Notice here that this will not only fetch the book instances, but also the book they reference.
		// Try taking out the .populate part of the line and see what changes.
		const bookInstances = await BookInstance.find().populate("book");
		res.json(bookInstances);
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
