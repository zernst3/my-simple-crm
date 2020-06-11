// Confirm User is Administrator

function isAdministrator(req, res, next){
	if(req.user.user_permissions === "Administrator"){
		return next();
	} else {
	res.send("Permission Denied");
	}
}

module.exports = isAdministrator;