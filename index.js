const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const validate = require("./middlewares/validate");
const authenticate = require("./middlewares/authenticate");
const activeUser = require("./middlewares/activeUser");
const checkPasswordMatching = require("./middlewares/checkPasswordMatching");
const renderHome = require("./controllers/renderHome");
const uploadFiles = require("./controllers/uploadFiles");
const employeeData = require("./data/Employee_Data.json");
const chartData = require("./uploads/Uploaded_Data.json");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    // Sets file(s) to be saved in uploads folder in same directory
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    // Sets saved filename(s) to be original filename(s)
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

// API
app.get("/employee-data", (req, res) => {
    res.send(employeeData);
});
app.get("/chart-data", (req, res) => {
    res.send(chartData);
});

app.get("/", (req, res) => {
    res.send("index.html");
});
app.get("/signup", activeUser, (req, res) => {
    res.render("signup.ejs");
});
app.get("/signin", activeUser, (req, res) => {
    res.render("signin.ejs");
});
app.get("/home", renderHome);

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
app.get("/uploads", (req, res) => {
    res.render("uploads.ejs");
});
app.get("/create-charts", (req, res) => {
    res.render("create-chart.ejs");
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
app.post("/uploads", upload.array("files"), uploadFiles);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
