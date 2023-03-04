const fs = require("fs");
const { Parser } = require("json2csv");

const CSV = new Parser();

const createCSV = (location, filename, data) => {
    fs.writeFile(
        "./" + location + "/" + filename + ".csv",
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
    for (let i = 0; i < uploadedData.length; i++) {
        Object.keys(uploadedData[i]).forEach((key) => {
            if (
                key ===
                req.body.selectedFile.substr(
                    0,
                    req.body.selectedFile.length - 5
                )
            ) {
                const workbookData = uploadedData[i][key];
                // console.log(workbookData);
                for (let j = 1; j <= workbookData.length; j++) {
                    Object.keys(workbookData).forEach((key) => {
                        const worksheetData = workbookData[key]["Sheet_" + j];
                        // console.log(worksheetData);
                        const csvData = CSV.parse(worksheetData);
                        createCSV(
                            "downloads",
                            req.body.selectedFile.substr(
                                0,
                                req.body.selectedFile.length - 5
                            ) +
                                "_Sheet_" +
                                j,
                            csvData
                        );
                    });
                }
            }
        });
    }
    // console.log(CSV.parse(uploadedData));
    next();
};

module.exports = downloadFiles;
