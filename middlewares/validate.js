const validate = (req, res, next) => {
	const user = req.body;
	const username = user.username;
	const email = user.email;
	const password = user.password;
	const phone = user.phone;
	const technology = user.technology;
	const skills = user.skills;
	const termsCheck = user.termsCheck;

	// Validate Username
	const checkName = /^[A-Za-z\s]+$/;
	if (username == "") {
		return res.json({ message: "Please write your name" });
	} else if (!username.match(checkName)) {
		return res.json({ message: "Invalid name" });
	}

	// Validate Email
	if (email == "") {
		return res.json({ message: "Please write an email id" });
	} else if (
		email.lastIndexOf(".") == email.length - 1 ||
		email.lastIndexOf(".") <= email.indexOf("@") + 1 ||
		email.indexOf("@") < 1
	) {
		return res.json({ message: "Invalid email id" });
	} else if (req.cookies[`${email}`]) {
		return res.json({ message: "Email id already exists" });
	}

	// Validate Password
	if (password == "") {
		return res.json({ message: "Please write a password" });
	} else if (password.length < 6) {
		return res.json({
			message: "Password should be of 6 or more characters",
		});
	}

	// Validate Phone Number
	if (phone == "") {
		return res.json({ message: "Please write your Phone Number" });
	} else if (phone.length != 10) {
		return res.json({ message: "Invalid Phone Number" });
	}

	// Validate Technology
	if (technology == "none") {
		return res.json({ message: "Select a Technology" });
	}

	// Validate Skills
	if (skills === undefined) {
		return res.json({ message: "Select atleast one Skill" });
	}
	// Validate Terms & Conditions
	if (termsCheck === undefined) {
		return res.json({ message: "Please accept the Terms and Conditions" });
	}

	const serializedData = JSON.stringify(user);
	const serializedEmail = JSON.stringify({ email: user.email });
	res.cookie(`${user.email}`, serializedData);
	res.cookie("active", serializedEmail);
	next();
};

module.exports = validate;