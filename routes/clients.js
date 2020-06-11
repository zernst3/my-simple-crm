const express    = require("express"),
router			 = express.Router();

// Schemas
const Transaction = require ("../models/transaction");
User 			  = require ("../models/user");
Ticket 	  		  = require ("../models/ticket");
Job 	   		  = require ("../models/job");
Client 			  = require ("../models/client");

// Functions
let numberWithCommas = require("../functions/numberWithCommas");
let isLoggedIn = require("../functions/isLoggedIn");
let isAdministrator = require("../functions/isAdministrator");
let isManager = require("../functions/isManager");

router.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// ========================================================================== index
router.get("/", isLoggedIn, async function(req, res){
	let clients = [];
	try {
		clients = await Client.find({}).populate("transactions").populate("jobs").exec()
	}
	catch (err) {console.log(err);}	
	res.render("clients/clients", {clients: clients});
});

// ========================================================================== new
router.get("/add", isLoggedIn, function(req, res){
	res.render("clients/add_client");
})

// ========================================================================== show
router.get("/:id", isLoggedIn, async function(req, res){
	let client_info = {};
	try {
		client_info = await Client.findById(req.params.id).populate("transactions").populate("jobs").populate("created_by").exec();
			for (let i = 0; i < client_info.transactions.length; i++){
				client_info.transactions[i]["transaction_info"]["new_amount"] = numberWithCommas(client_info.transactions[i]["transaction_info"]["amount"]);
			}	
	}
	catch (err) {console.log(err);}	
	res.render("clients/client_info", {client_info: client_info});
});

// ========================================================================== edit
router.get("/:id/edit", isLoggedIn, isManager, async function(req, res){
	client_info = {};
	try {
		client_info = await Client.findById(req.params.id).populate("transactions").populate("jobs").exec();
	}
	catch (err) {console.log(err);}	
	res.render("clients/edit_client", {client_info: client_info});
});

// ========================================================================== create
router.post("/", isLoggedIn, async function(req, res){ 
	let client;
	try {
		client = req.body.client;
		client.date_added = moment(moment(Date.now()).format("YYYY-MM-DD"));
		client.created_by = req.user.id;
		client.active = true;
		await Client.create(client);
		if (client.organization_name) {
			console.log("Client " + "'" + client.organization_name + "'" + " has been created");
		} else {
			console.log("Client " + "'" + client.last_name + ", " + client.first_name + "'" + " has been created");
		}
	}
	catch (err) {console.log(err);}
	req.flash("success", "New client has been created");
	res.redirect("/clients");
});

// ========================================================================== update
router.put("/:id", isLoggedIn, isManager, async function(req, res){ 
	let client = req.body.client
	try {
		await Client.findByIdAndUpdate(req.params.id, client);
		if (client.organization_name) {
			console.log("Client " + "'" + client.organization_name + "'" + " has been updated");
		} else {
			console.log("Client " + "'" + client.last_name + ", " + client.first_name + "'" + " has been updated");
		}
	}
	catch (err) {console.log(err);}	
	req.flash("info", "Client has been updated");
	res.redirect("/clients/" + req.params.id);
});

// ========================================================================== delete
router.delete("/:id", isLoggedIn, isAdministrator, async function(req, res){ 
	try {
		await Client.findByIdAndRemove(req.params.id);
		console.log("Client has been deleted");
	}
	catch (err) {console.log(err);}
	req.flash("error", "Client has been deleted");
	res.redirect("/clients");
});
	
module.exports = router;