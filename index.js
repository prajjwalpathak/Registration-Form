const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const validate = require("./middlewares/validate");
const authenticate = require("./middlewares/authenticate");
const activeUser = require("./middlewares/activeUser");
const checkPasswordMatching = require("./middlewares/checkPasswordMatching");
const employeeData = require("./data/Employee_Data.json");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("index.html");
});
app.get("/signup", activeUser, (req, res) => {
	res.render("signup.ejs");
});
app.get("/signin", activeUser, (req, res) => {
	res.render("signin.ejs");
});
app.get("/home", (req, res) => {
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
});

// API
app.get("/employee-data", (req, res) => {
	res.send(employeeData);
});


app.get("/change-password", (req, res) => {
	res.render("change-password.ejs");
});
app.get("/signout", (req, res) => {
	res.clearCookie("active");
	res.redirect("/");
});
app.get("/employee-list", (req, res) => {
	res.render("employee-list.ejs");
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
