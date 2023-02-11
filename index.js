const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
	const checkName = /^[A-Za-z0-9_]+$/;
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
	res.render("home", {
		username: user.username,
		email: user.email,
		phone: user.phone,
		technology: user.technology,
		skills: user.skills,
		termsCheck: user.termsCheck,
	});
	next();
};

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
			res.render("home", {
				username: deserializedData.username,
				email: deserializedData.email,
				phone: deserializedData.phone,
				technology: deserializedData.technology,
				skills: deserializedData.skills,
				termsCheck: deserializedData.termsCheck,
			});
		} else {
			return res.json({
				message: "Invalid email or password",
			});
		}
	} else {
		return res.json({
			message: "User doesn't exist. Please Register first.",
		});
	}
	next();
};

const activeUser = (req, res, next) => {
	if (req.cookies["active"]) {
		const activeUserEmail = JSON.parse(req.cookies["active"]).email;
		const activeUserData = JSON.parse(req.cookies[activeUserEmail]);
		res.render("home", {
			username: activeUserData.username,
			email: activeUserData.email,
			phone: activeUserData.phone,
			technology: activeUserData.technology,
			skills: activeUserData.skills,
			termsCheck: activeUserData.termsCheck,
		});
	} else {
		res.redirect("/");
	}
	next();
};

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
		res.redirect("/home");
	}
	next();
};

app.get("/", (req, res) => {
	res.send("index.html");
});
app.get("/signup", (req, res) => {
	res.render("signup.ejs");
});
app.get("/signin", (req, res) => {
	res.render("signin.ejs");
});
app.get("/home", activeUser, (req, res) => {
	res.render("home.ejs");
});
app.get("/change-password", (req, res) => {
	res.render("change-password.ejs");
});
app.get("/signout", (req, res) => {
	res.clearCookie("active");
	res.redirect("/");
});
app.post("/signup", validate, (req, res) => {
	res.redirect("/home");
});
app.post("/signin", authenticate, (req, res) => {
	res.redirect("/home");
});
app.post("/change-password", checkPasswordMatching, (req, res) => {
	res.redirect("/home");
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});
