const Transaction = require ("./transaction");
User 			  = require ("./user");
Ticket 	  		  = require ("./ticket");
Job 	   		  = require ("./job");
Client 			  = require ("./client");

mongoose          = require("mongoose");

// =======================Job Schema

var jobSchema = new mongoose.Schema({
	job_name: String,
	created_by: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
	street: String,
	city: String,
	state: String,
	zip: String,
	description: String,
	billing_price: mongoose.Decimal128,
	client: {type: mongoose.Schema.Types.ObjectID, ref: "Client"},
	transactions: [{type: mongoose.Schema.Types.ObjectID, ref: "Transaction"}],
	start_date: {type: Date},
	end_date: {type: Date},
	date_added: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Job", jobSchema);