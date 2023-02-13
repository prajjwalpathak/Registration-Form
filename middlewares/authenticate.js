const authenticate = (req, res, next) => {
	const user = req.body;
	const email = user.email;
	const password = user.password;

	// Authenticate
	if (req.cookies[`${email}`]) {
		const deserializedData = JSON.parse(req.cookies[`${email}`]);
		if (deserializedData.password === password) {
			const serializedEmail = JSON.stringify({ email: email });
			res.cookie("active", serializedEmail);
			next();
		} else {
			return res.send({
				message: "Invalid email or password",
			});
		}
	} else {
		return res.json({
			message: "User doesn't exist. Please Register first.",
		});
	}
};

module.exports = authenticate;