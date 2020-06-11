const express    = require("express"),
router			 = express.Router();
moment		     = require("moment");

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
	let transactions = [];
	try {
		transactions = await Transaction.find({}).populate("job").populate("client").populate("deposited_by_user").exec();
		for (let i = 0; i < transactions.length; i++){
			transactions[i]["transaction_info"]["new_amount"] = numberWithCommas(transactions[i]["transaction_info"]["amount"]);
		}
	}
	catch (err) {console.log(err);}	
	res.render("transactions/transactions", {transactions: transactions});
});

// ========================================================================== new
router.get("/add", isLoggedIn, isManager, async function(req, res){
	let users = [];
	let clients = [];
	let jobs = [];
	try {
		users = await User.find({});
		clients = await Client.find({});
		jobs = await Job.find({});
	}
	catch (err) {console.log(err);}	
	res.render("transactions/add_transaction", {users: users, clients: clients, jobs: jobs});	
});

// ========================================================================== show
router.get("/:id", isLoggedIn, async function(req, res){
	let transaction = {};
	let price;
	try {
		transaction = await Transaction.findById(req.params.id).populate("job").populate("client").populate("deposited_by_user").exec();
		price = await numberWithCommas(transaction["transaction_info"]["amount"]);
	}
	catch (err) {console.log(err);}	
	res.render("transactions/transaction", {transaction: transaction, price: price});
});

// ========================================================================== edit
router.get("/:id/edit", isLoggedIn, isAdministrator, async function(req, res){
	let transaction = {};
	let users = [];
	let clients = [];
	let jobs = [];
	let deposit_date;
	try {
		transaction = await Transaction.findById(req.params.id).populate("job").populate("client").populate("deposited_by_user").exec();
		users = await User.find({});
		clients = await Client.find({});
		jobs = await Job.find({});
		deposit_date = moment(transaction["transaction_info"]["date"]).format("YYYY-MM-DD");
	}
	catch (err) {console.log(err);}	
	res.render("transactions/edit_transaction", {transaction: transaction, users: users, clients: clients, jobs: jobs, deposit_date: deposit_date});
});

// ========================================================================== create
router.post("/", isLoggedIn, isManager, async function(req, res){ 
	try {
		let transaction = req.body.transaction;

		transaction["transaction_info"].date = moment(transaction["transaction_info"].date);
		transaction.date_added = moment(moment(Date.now()).format("YYYY-MM-DD"));
		let newTransaction = await Transaction.create(transaction);
		console.log("Transaction successfully created");

		// attach transaction to connected job
		let job = await Job.findById(req.body.transaction["job"]);
		await job.transactions.push(newTransaction._id);
		await job.save();
		console.log('transaction id added to job documents successfully');

		// attach transaction to conencted client
		let client = await Client.findById(req.body.transaction["client"]);
		await client.transactions.push(newTransaction._id);
		await client.save();
		console.log('transaction id added to client documents successfully');
	}
	catch (err) {console.log(err);}	
	req.flash("success", "New transaction has been created");	
	res.redirect("/transactions");
});

// ========================================================================== update
router.put("/:id", isLoggedIn, isAdministrator, async function(req, res){ 
	try {
		// remove transaction from old connected client
		await Client.updateMany({transactions: req.params.id},
				{$pull: {transactions: {$in: [req.params.id]}} 
			});
		console.log("transaction id removed from old client documents successfully");

		// remove transaction from old conencted job
		await Job.updateMany({transactions: req.params.id},
				{$pull: {transactions: {$in: [req.params.id]}} 
			});
		console.log("transaction id removed from old job documents successfully");	

		let transaction = req.body.transaction;
		transaction["transaction_info"].date = moment(transaction["transaction_info"].date);
		let updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, transaction);
		console.log("Transaction successfully updated");

		// attach transaction to new connected job
		let job = await Job.findById(req.body.transaction["job"]);
		await job.transactions.push(updatedTransaction._id);
		await job.save();
		console.log('transaction id added to new job documents successfully');

		// attach transaction to new conencted client
		let client = await Client.findById(req.body.transaction["client"]);
		await client.transactions.push(updatedTransaction._id);
		await client.save();
		console.log('transaction id added to client documents successfully');
	}
	catch (err) {console.log(err);}	
	req.flash("info", "Transaction has been updated");
	res.redirect("/transactions/" + req.params.id);
});

// ========================================================================== delete
router.delete("/:id", isLoggedIn, isAdministrator, async function(req, res){ 
	try {
		// remove transaction from connected client
		await Client.updateMany({transactions: req.params.id},
				{$pull: {transactions: {$in: [req.params.id]}} 
			});
		console.log("transaction id removed from client documents successfully");

		// remove transaction from conencted job
		await Job.updateMany({transactions: req.params.id},
				{$pull: {transactions: {$in: [req.params.id]}} 
			});
		console.log("transaction id removed from job documents successfully");

		// 	delete job
		await Transaction.findByIdAndRemove(req.params.id);
		console.log("transaction has been deleted");
	}
	catch (err) {console.log(err);}	
	req.flash("error", "Transaction has been deleted");
	res.redirect("/transactions");
});
	
module.exports = router;