const Transaction = require ("./transaction");
User 			  = require ("./user");
Ticket 	  		  = require ("./ticket");
Job 	   		  = require ("./job");
Client 			  = require ("./client");

mongoose          = require("mongoose");

// =======================Ticket Schema

var ticketSchema = new mongoose.Schema({
	ticket_name: String,
	description: String,
	created_by: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
	assigned_user: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
	completed_by_user: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
	due_date: {type: Date},
	completed_date: {type: Date},
	completed_description: String,
	date_added: {type: Date}
});

module.exports = mongoose.model("Ticket", ticketSchema);