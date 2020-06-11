const Transaction = require ("./transaction");
User 			  = require ("./user");
Ticket 	  		  = require ("./ticket");
Job 	   		  = require ("./job");
Client 			  = require ("./client");

mongoose          = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

// =======================User Schema

var userSchema = new mongoose.Schema({
	first_name: String,
	middle_name: String,
	last_name: String,
	username: String,
	email_address: String,
	phone_number: String,
	street: String,
	city: String,
	state: String,
	zip: String,
	password: String,
	user_permissions: String,
	date_added: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);