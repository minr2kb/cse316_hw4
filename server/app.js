// const express = require("express");
// const mongoose = require("mongoose");
// const Note = require("./models/Note");
// const User = require("./models/User");

// const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

const express = require("express");
const libraryRoutes = require("./routes/notes");
const userRoutes = require("./routes/users");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB session store

var dbURL = process.env.MONGO_URL || "mongodb://localhost:27017/MyNote";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sessionSecret = "KyungbaeMin";

const store = MongoStore.create({
	mongoUrl: dbURL,
	secret: sessionSecret,
	touchAfter: 24 * 60 * 60,
});

// Changing this setting to avoid a Mongoose deprecation warning:
mongoose.set("useFindAndModify", false);

const sessionConfig = {
	store,
	name: "session",
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		// secure: true,
	},
};

app.use(session(sessionConfig));

function wrapAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch(e => next(e));
	};
}

app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	next();
});

app.use("/api/users/:id", (req, res, next) => {
	next();
});

app.get(
	"/api/users",
	wrapAsync(async function (req, res) {
		const users = await User.find({});
		res.json(users);
	})
);

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
				throw new Error("User Not Found");
			}
		} else {
			throw new Error("Invalid user Id");
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
			img: req.body.img,
		});
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
		await User.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				email: req.body.email,
				location: req.body.location,
			},
			{ runValidators: true }
		);
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
	next();
});

app.get(
	"/api/notes",
	wrapAsync(async function (req, res) {
		const notes = await Note.find({}).sort({ lastUpdatedDate: 1 });
		res.json(notes);
	})
);

app.post(
	"/api/notes",
	wrapAsync(async function (req, res) {
		console.log("Posted with body: " + JSON.stringify(req.body));
		const newNote = new Note({
			text: req.body.text,
			lastUpdatedDate: req.body.lastUpdatedDate,
		});
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
	res.statusMessage = err.message;

	if (err.name === "ValidationError") {
		res.status(400).end();
	} else {
		res.status(500).end();
	}
});

port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}!`);
});
