// Confirm User is Administrator

function isAdministratorOrCurrentUser(req, res, next){
	if(req.user.user_permissions === "Administrator" || req.user.id === req.params.id){
		return next();
	} else {
	res.send("Permission Denied");
	}
}

module.exports = isAdministratorOrCurrentUser;