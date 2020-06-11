const Transaction = require ("./transaction"),
User 			  = require ("./user"),
Ticket 	  		  = require ("./ticket"),
Job 	   		  = require ("./job"),
Client 			  = require ("./client"),
	  
mongoose          = require("mongoose");

// =======================Client Schema

var clientSchema = new mongoose.Schema({
	organization_name: String,
	first_name: String,
	middle_name: String,
	last_name: String,
	email_address: String,
	phone_number: String,
	street: String,
	city: String,
	state: String,
	zip: String,
	description: String,
	active: {type: Boolean, deafult: true},
	date_added: {type: Date},
	created_by: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
	transactions: [{type: mongoose.Schema.Types.ObjectID, ref: "Transaction"}],
	jobs: [{type: mongoose.Schema.Types.ObjectID, ref: "Job"}]
});

module.exports = mongoose.model("Client", clientSchema);