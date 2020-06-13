const express    = require("express"),
router			 = express.Router();
moment		     = require("moment");

// Schemas
const User		  = require ("../models/user");
Ticket 	  		  = require ("../models/ticket");
Job 	   		  = require ("../models/job");
Client 			  = require ("../models/client");

// Functions
let isLoggedIn = require("../functions/isLoggedIn");
let isAdministrator = require("../functions/isAdministrator");
let isManager = require("../functions/isManager");

router.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

require('dotenv').config();

const nodemailer = require('nodemailer');

// 1. Transporter
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

// ========================================================================== index
router.get("/", isLoggedIn, async function(req, res){
	let tickets = [];
	try {
			tickets = await Ticket.find({}).populate("created_by").populate("assigned_user").populate("completed_by_user").exec();
		}	
	catch (err) {console.log(err);}	
	res.render("tickets/tickets", {tickets: tickets});
});	

// ========================================================================== new
router.get("/add", isLoggedIn, async function(req, res){
	let users = [];
	try {
			users = await User.find({});
		}	
	catch (err) {console.log(err);}		
	res.render("tickets/add_ticket", {users: users});
})

// ========================================================================== show
router.get("/:id", isLoggedIn, async function(req, res){
	let ticket = {};
	try {
			ticket = await Ticket.findById(req.params.id).populate("created_by").populate("assigned_user").populate("completed_by_user").exec();
		}	
	catch (err) {console.log(err);}	
	res.render("tickets/ticket", {ticket: ticket});
});

// ========================================================================== edit
router.get("/:id/edit", isLoggedIn, isManager, async function(req, res){
	let ticket = {};
	let users = [];
	let due_date;
	try {
		ticket = await Ticket.findById(req.params.id).populate("created_by").populate("assigned_user").populate("completed_by_user").exec();
		users = await User.find({});
		due_date = moment(ticket.due_date).format("YYYY-MM-DD");
		}	
	catch (err) {console.log(err);}		
	res.render("tickets/edit_ticket", {ticket: ticket, users: users, due_date: due_date}); 
});

// ========================================================================== create
router.post("/", isLoggedIn, async function(req, res){ 
	try {
		let ticket = req.body.ticket;
		ticket.due_date = moment(ticket.due_date);
		ticket.date_added = moment(moment(Date.now()).format("YYYY-MM-DD"));
		await Ticket.create(ticket);
		console.log("New Ticket Added");
	}
	catch (err) {console.log(err);}		
	
// 	Email Ticket
	try {
		let created_by_user = await User.findById(req.body.ticket["created_by"]);
		let assigned_user = await User.findById(req.body.ticket["assigned_user"]);
		let cc_arr = [];
		if (assigned_user.email_address != created_by_user.email_address) {
			cc_arr.push (created_by_user.email_address)
		}
				
		// 2.	
		let mailOptions = {
			from: 'zernst.crm.app@gmail.com',
			to: assigned_user.email_address,
			cc: cc_arr,
			subject: 'New Ticket ' + '"' + req.body.ticket["ticket_name"] + '"' + ' is due ' + moment(req.body.ticket["due_date"]).format("MM/DD/YYYY"),
			html: "<h1>New Ticket</h1>" +
				  "<p><strong>From: </strong>" + created_by_user.username + "</p>" +
				  "<p><strong>Assigned to: </strong>" + assigned_user.username + "</p>" +
				  "<p><strong>Due Date: </strong>" + moment(req.body.ticket["due_date"]).format("MM/DD/YYYY") + "</p>" +
				  "<p class='body'>" + req.body.ticket["description"] + "</p>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Ticket Email Sent Successfully");
			}
		});
	}
	catch (err) {console.log(err);}	
	req.flash("success", "New ticket has been created");
	res.redirect("/tickets");
});

// ========================================================================== update
router.put("/:id", isLoggedIn, isManager, async function(req, res){ 
	try {
		let ticket = req.body.ticket;
		ticket.due_date = moment(ticket.due_date);
		ticket.date_added = moment(moment(Date.now()).format("YYYY-MM-DD"));
		await Ticket.findByIdAndUpdate(req.params.id, ticket);
		console.log("Ticket " + "'" + ticket.ticket_name + "'" + " has been updated");
	}
	catch (err) {console.log(err);}	
	
// 	Email Ticket	
	try {
		let created_by_user = await User.findById(req.body.ticket["created_by"]);
		let assigned_user = await User.findById(req.body.ticket["assigned_user"]);
		let cc_arr = [];
		if (assigned_user.email_address != created_by_user.email_address) {
			cc_arr.push (assigned_user.email_address)
		}
		
	// 2.	
		let mailOptions = {
			from: 'zernst.crm.app@gmail.com',
			to: assigned_user.email_address,
			cc: cc_arr,
			subject: 'Updated Ticket ' + '"' + req.body.ticket["ticket_name"] + '"' + ' is due ' + moment(req.body.ticket["due_date"]).format("MM/DD/YYYY"),
			html: "<h1>This Ticket Has Been Updated</h1>" +
				  "<p><strong>From: </strong>" + created_by_user.username + "</p>" +
				  "<p><strong>Assigned to: </strong>" + assigned_user.username + "</p>" +
				  "<p><strong>Due Date: </strong>" + moment(req.body.ticket["due_date"]).format("MM/DD/YYYY") + "</p>" +
				  "<p class='body'>" + req.body.ticket["description"] + "</p>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Ticket Email Sent Successfully");
			}
		});	
	}
	catch (err) {console.log(err);}	
	req.flash("info", "Ticket has been updated");
	res.redirect("/tickets/" + req.params.id);
});

// ========================================================================== delete
router.delete("/:id", isLoggedIn, isAdministrator, async function(req, res){ 
// 	Delete Ticket
	try {
		await Ticket.findByIdAndRemove(req.params.id);		
		console.log("Ticket has been deleted");
	}
	catch (err) {console.log(err);}	
	req.flash("error", "Ticket has been deleted");
	res.redirect("/tickets");
});

// ========================================================================== mark ticket completed
// ========================================================================== edit
router.get("/:id/complete_form", isLoggedIn, async function(req, res){
	let ticket = {};
	let users = [];
	try {
		ticket = await Ticket.findById(req.params.id).populate("created_by").populate("assigned_user").populate("completed_by_user").exec();
		users = await User.find({});
	}
	catch (err) {console.log(err);}	
	res.render("tickets/complete_ticket", {ticket: ticket, users: users});
});

// ========================================================================== update
router.put("/complete/:id", isLoggedIn, async function(req, res){ 
// 	Update Ticket
	try {
		let ticket = req.body.ticket;
		ticket.completed_date = moment(ticket.completed_date);
		completed_ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body.ticket);
		console.log("Ticket " + "'" + completed_ticket.ticket_name + "'" + " has been completed");
	}
	catch (err) {console.log(err);}	
	
	// 	Email Ticket	
	try {
		let foundTicket = await Ticket.findById(req.params.id).populate("created_by").populate("assigned_user").populate("completed_by_user").exec();		
		let created_by_user = await User.findById(foundTicket["created_by"]);
		let assigned_user = await User.findById(foundTicket["assigned_user"]);
		let completed_by_user = await User.findById(req.body.ticket["completed_by_user"]);		
		let cc_arr = [];
		
		if (assigned_user.email_address != completed_by_user.email_address) {
			cc_arr.push(assigned_user.email_address);
		}
		
		if (created_by_user.email_address != completed_by_user.email_address && created_by_user != assigned_user) {
			cc_arr.push(created_by_user.email_address);
		}		
		
	// 2.	
		let mailOptions = {
			from: 'zernst.crm.app@gmail.com',
			to: completed_by_user.email_address,
			cc: cc_arr,
			subject: 'Completed Ticket ' + '"' + foundTicket["ticket_name"] + '"' + ' was completed on ' + moment(req.body.ticket["completed_date"]).format("MM/DD/YYYY"),
			html: "<h1>This Ticket Has Been Completed</h1>" +
				  "<p><strong>From: </strong>" + created_by_user.username + "</p>" +
				  "<p><strong>Assigned to: </strong>" + assigned_user.username + "</p>" +
				  "<p><strong>Completed by: </strong>" + completed_by_user.username + "</p>" +
				  "<p><strong>Completed Date: </strong>" + moment(req.body.ticket["completed_date"]).format("MM/DD/YYYY") + "</p>" +
				  "<p class='body'>" + req.body.ticket["completed_description"] + "</p>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Ticket Email Sent Successfully");
			}
		});	
	}
	catch (err) {console.log(err);}	
	req.flash("success", "Ticket has been completed");
	res.redirect("/tickets/" + req.params.id);
});
	
module.exports = router;