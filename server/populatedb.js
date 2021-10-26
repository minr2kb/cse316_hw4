#! /usr/bin/env node

console.log(
	"This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
// var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
const Note = require("./models/Note");
const User = require("./models/User");

var mongoose = require("mongoose");
var mongoDB = "mongodb://localhost:27017/MyNote";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var notes = [];
var users = [];

function userCreate(name, email, location, cb) {
	userdetail = {
		name: name,
		email: email,
		location: location,
	};

	var user = new User(userdetail);

	user.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New User: " + user);
		users.push(user);
		cb(null, user);
	});
}

function noteCreate(text, lastUpdatedDate, cb) {
	var note = new Note({ text: text, lastUpdatedDate, lastUpdatedDate });

	note.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Note: " + note);
		notes.push(note);
		cb(null, note);
	});
}

function createUsers(cb) {
	async.series(
		[
			function (callback) {
				userCreate(
					"Kyungbae Min",
					"kyungbae.min@stonybrook.edu",
					"Cheongju-si",
					callback
				);
			},
		],
		// optional callback
		cb
	);
}

function createNotes(cb) {
	async.parallel(
		[
			function (callback) {
				noteCreate(
					"# My First Note \n## By. Kyungbae Min",
					new Date(),
					callback
				);
			},
		],
		// optional callback
		cb
	);
}

async.series(
	[createUsers, createNotes],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log("FINAL ERR: " + err);
		} else {
			// console.log("BOOKInstances: " + bookinstances);
		}
		// All done, disconnect from database
		mongoose.connection.close();
	}
);
