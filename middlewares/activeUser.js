const activeUser = (req, res, next) => {
	if (req.cookies["active"]) {
		res.redirect("/home");
	} else {
		next();
	}
};

module.exports = activeUser;