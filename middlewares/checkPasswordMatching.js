const checkPasswordMatching = (req, res, next) => {
	const currentUserEmail = JSON.parse(req.cookies["active"]).email;
	const currentUserData = JSON.parse(req.cookies[currentUserEmail]);
	const currentPassword = req.body.currentPassword;
	const newPassword = req.body.newPassword;
	const confirmPassword = req.body.confirmPassword;

	// Check if the Password is correct or not
	if (currentPassword != currentUserData.password) {
		return res.json({ message: "Incorrect Password" });
	} else if (newPassword.length < 6) {
		return res.json({
			message: "Password should be of 6 or more characters",
		});
	} else if (newPassword != confirmPassword) {
		return res.json({
			message: "Password does not match",
		});
	} else {
		currentUserData.password = newPassword;
		const serializedData = JSON.stringify(currentUserData);
		res.cookie(`${currentUserData.email}`, serializedData);
		next();
	}
};

module.exports = checkPasswordMatching;