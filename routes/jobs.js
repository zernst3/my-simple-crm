const express    = require("express"),
router			 = express.Router(),
moment		     = require("moment");

// Schemas
const User		  = require ("../models/user");
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
	let jobs = [];
	try {
		jobs = await Job.find({}).populate("created_by").populate("client").populate("transactions").exec();
	}
	catch (err) {console.log(err);}	
	res.render("jobs/jobs", {jobs: jobs});
});

// ========================================================================== new
router.get("/add", isLoggedIn, async function(req, res){
	let users = [];
	let clients = [];
	try {
		users = await User.find({})
		clients = await Client.find({})
	}
	catch (err) {console.log(err);}	
	res.render("jobs/add_job", {users: users, clients: clients});
});

// ========================================================================== show
router.get("/:id", isLoggedIn, async function(req, res){
	let job = {};
	let price;
	try {
		job = await Job.findById(req.params.id).populate("created_by").populate("client").populate("transactions").exec();
		let balance = job.billing_price;
		// Add Price with commas
		if (job.transactions){
			for (let i = 0; i < job["transactions"].length; i++){
				job["transactions"][i]["transaction_info"]["new_amount"] = numberWithCommas(job["transactions"][i]["transaction_info"]["amount"]);
			}	
			// Balance				
			for (let i = 0; i < job["transactions"].length; i++){
				balance = balance - job["transactions"][i]["transaction_info"]["amount"];
			}
		}

		job.balance = await numberWithCommas(balance);
		price = await numberWithCommas(job.billing_price);
	}
	catch (err) {console.log(err);}	
	res.render("jobs/job", {job: job, price: price});
});

// ========================================================================== edit
router.get("/:id/edit", isLoggedIn, isManager, async function(req, res){
	let job = {};
	let users = [];
	let clients = [];
	let start_date;
	let end_date;

	try {
		job = await Job.findById(req.params.id).populate("created_by").populate("client").populate("transactions").exec();
		users = await User.find({});
		clients = await Client.find({});
		start_date = moment(job.start_date).format("YYYY-MM-DD");
		end_date = moment(job.end_date).format("YYYY-MM-DD");
	}
	catch (err) {console.log(err);}	
	res.render("jobs/edit_job", {job: job, users: users, clients: clients, start_date, end_date});
});

// ========================================================================== create
router.post("/", isLoggedIn, async function(req, res){ 
	let job = req.body.job;
	try {		
		job.start_date = moment(job.start_date);
		job.end_date = moment(job.end_date);		
		job.date_created = moment(moment(Date.now()).format("YYYY-MM-DD"));
		job.created_by = req.user.id;
		let jobCreated = await Job.create(job);
		console.log("Job " + "'" + job.job_name + "'" + " has been created");

		// attach job to connected client
		let client = await Client.findById(req.body.job["client"]);
		await client.jobs.push(jobCreated._id);
		await client.save();
		console.log('Job id added to client documents successfully');
	}
	catch (err) {console.log(err);}	
	req.flash("success", "New job has been created");
	res.redirect("/jobs");
});

// ========================================================================== update
router.put("/:id", isLoggedIn, isManager, async function(req, res){ 
	try {
		// remove job from old conencted client
		await Client.updateMany({jobs: req.params.id},
			{$pull: {jobs: {$in: [req.params.id]}} 
			});
		console.log('Job id removed from old client documents successfully');	
		
		let job = req.body.job;
		job.start_date = moment(job.start_date);
		job.end_date = moment(job.end_date);		
		let foundJob = await Job.findByIdAndUpdate(req.params.id, job);
		console.log("Job " + "'" + job.job_name + "'" + " has been updated");			

		// attach job to new connected client
		let client = await Client.findById(req.body.job["client"]);		
		client.jobs.push(foundJob._id);
		client.save();
		console.log('Job id added to new client documents successfully');
	}
	catch (err) {console.log(err);}	
	req.flash("info", "Job has been updated");
	res.redirect("/jobs/" + req.params.id);
});

// ========================================================================== delete
router.delete("/:id", isLoggedIn, isAdministrator, async function(req, res){
	try {
		await Client.updateMany({ jobs: req.params.id },{
			$pull: { jobs: {$in: [req.params.id]} } 
			});
		console.log('Job id removed from client documents successfully');

		await Job.findByIdAndRemove(req.params.id);
		console.log('Job successfully removed');
	}
	catch (err) {console.log(err);}	
	req.flash("error", "Job has been deleted");
	res.redirect("/jobs");
});
	
module.exports = router;