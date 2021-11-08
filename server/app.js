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

const sessionSecret = process.env.SESSION_SECRET;

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

app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	next();
});

app.use("/api", userRoutes);
app.use("/api", libraryRoutes);

app.use((err, req, res, next) => {
	console.log("Error handling called");
	res.statusMessage = err.message;

	if (err.name === "ValidationError") {
		res.status(400).end();
	} else {
		res.status(500).end();
	}
});

module.exports = app;
