const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const validate = require("./middlewares/validate");
const activeUser = require("./middlewares/activeUser");
const renderHome = require("./controllers/renderHome");
const uploadFiles = require("./controllers/uploadFiles");
const employeeData = require("./data/Employee_Data.json");
const authenticate = require("./middlewares/authenticate");
const uploadedData = require("./uploads/Uploaded_Data.json");
const checkPasswordMatching = require("./middlewares/checkPasswordMatching");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
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

let filenames = [];
fs.readdir("./downloads", (error, files) => {
    if (error) {
        console.log(error);
    } else {
        filenames = files;
    }
});
let filename = "";

// API
app.get("/employee-data", (req, res) => {
    res.send(employeeData);
});
app.get("/uploaded-data", (req, res) => {
    res.send(uploadedData);
});

app.get("/", activeUser, (req, res) => {
    res.render("index.ejs");
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
app.get("/create-chart", (req, res) => {
    res.render("create-chart.ejs");
});
app.get("/downloads", (req, res) => {
    res.render("downloads.ejs", { files: filenames });
});
app.get("/download", (req, res) => {
    res.download("./downloads/" + filename + ".csv", (error) => {
        if (error) {
            console.log(error);
        }
    });
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

app.post("/downloads", (req, res) => {
    filename = req.body.selectedFile.substr(
        0,
        req.body.selectedFile.length - 4
    );
    res.redirect("/download");
});

// Serve static files
app.use(express.static(path.join(__dirname + "/public")));

// Handle 404
app.use(function (req, res) {
    res.status(400);
    res.render("404.ejs", { title: "404: File Not Found" });
});

// Handle 500
app.use(function (error, req, res, next) {
    res.status(500);
    res.render("500.ejs", { title: "500: Internal Server Error" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
