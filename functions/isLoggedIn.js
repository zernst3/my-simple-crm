// Confirm Logged In User

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "Please Login");
	res.redirect("/login");
}

module.exports = isLoggedIn;