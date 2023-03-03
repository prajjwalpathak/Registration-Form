const fs = require("fs");
const { Parser } = require("json2csv");

const CSV = new Parser();

const createCSV = (location, filename, data) => {
    fs.writeFile(
        "./" + location + "/" + filename + "..csv",
        data,
        "utf8",
        (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
                console.log(`File is written successfully!`);
            }
        }
    );
};

let uploadedData = [];
fetch("http://localhost:3000/uploaded-data")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        uploadedData = data;
    })
    .catch((error) => {
        console.log(error);
    });

const downloadFiles = (req, res, next) => {
    // console.log(CSV.parse(uploadedData));
    next();
};

module.exports = downloadFiles;
