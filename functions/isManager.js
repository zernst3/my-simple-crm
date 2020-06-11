// Confirm User is Manager or above

function isManager(req, res, next){
	if(req.user.user_permissions === "Manager" || req.user.user_permissions === "Administrator"){
		return next();
	} else {
	res.send("Permission Denied");
	}
}

module.exports = isManager;