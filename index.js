const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const xlsx = require("xlsx");
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
app.get("/uploads", (req, res) => {
    res.send("Upload");
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

app.post("/uploads", upload.array("files"), (req, res) => {
    let finalData = [];
	let workbookData = [];
    try {
        req.files.map((file) => {
            const xlsxFilePath = path.join("uploads/" + file.originalname);
            const workbook = xlsx.readFile(xlsxFilePath);
            const sheets = workbook.SheetNames;
            let allData = [];
            for (let i = 0; i < sheets.length; i++) {
                allData.push(
                    xlsx.utils.sheet_to_json(workbook.Sheets[sheets[i]])
                );
            }
            let sheetCount = 1;
			workbookData = [];
            allData.forEach((data) => {
                const sheetNumber = `Sheet_${sheetCount}`;
                workbookData.push({ [sheetNumber]: data });
                sheetCount = sheetCount + 1;
            });
			finalData.push(workbookData);
        });
		// console.log(finalData[0][0].Sheet_1[0]);
        res.send(finalData);
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
