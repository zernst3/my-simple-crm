//  ========================================================Start of Header============================================================
const bodyParser = require("body-parser"),
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),
express          = require("express"),
flash			 = require("connect-flash"),
app              = express();

// Authentication
const passport = require("passport"),
LocalStrategy  = require("passport-local");  

// Schemas
const Transaction = require ("./models/transaction"),
User 			  = require ("./models/user"),
Ticket 	  		  = require ("./models/ticket"),
Job 	   		  = require ("./models/job"),
Client 			  = require ("./models/client");

//tell express to serve public directory
app.use(express.static(__dirname + "/public"));

//tell express to look for ejs files
app.set("view engine", "ejs");

// use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// use methodOverride
app.use(methodOverride("_method"));

// mongoose.connect("mongodb://localhost/crm_app");

require('dotenv').config();

mongoose.connect(process.env.MongoDB, {
	userNewUrlParser: true,
	useCreateIndex: true,
}).then (() => {
	console.log("Connected to the database");
}).catch(err => {
	console.log("Error", err.message);
});

// Optional. Use this if you create a lot of connections and don't want
// to copy/paste `{ useNewUrlParser: true }`.
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// Use Express Session
app.use(require("express-session")({
	secret: "You my friend, I will defend, and if we change, well, I love you anyway",
	resave: false,
	saveUninitialized: false
}));

// Use Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use Flash
app.use(flash());

// Use Current Logged in Information and Flashing Information
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

// Functions
let isLoggedIn = require("./functions/isLoggedIn");

//  ========================================================End of Header==============================================================

// Routes
const users  = require("./routes/users"),
tickets 	 = require("./routes/tickets"),
clients 	 = require("./routes/clients"),
jobs 		 = require("./routes/jobs"),
transactions = require("./routes/transactions");
dashboard 	 = require("./routes/dashboard");

app.use("/users", users);
app.use("/tickets", tickets);
app.use("/clients", clients);
app.use("/jobs", jobs);
app.use("/transactions", transactions);
app.use(dashboard);

// =======================Login/Register

app.get("/login", function(req, res){
	res.render("login");
});
 
app.post("/login", passport.authenticate("local", {
	successRedirect:"/",
	failureRedirect: "/login",
	failureFlash: true
}), function(req, res){});

// =======================Logout
app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out");
	res.redirect("/login");
});

// =======================Error

app.get("*", isLoggedIn, function(req, res){ 
	res.render("not_found");
});

// =======================Server

app.listen(8080, function() { 
  console.log('Server listening on port 8080'); 
});