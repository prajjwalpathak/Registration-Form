const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const { Parser } = require("json2csv");

const CSV = new Parser();

const createJSON = (location, filename, data) => {
    const JSONData = JSON.stringify(data);
    fs.writeFile(
        "./" + location + "/" + filename + ".json",
        JSONData,
        "utf8",
        (error) => {
            if (error) {
                console.log(`Error writing file: ${error}`);
            }
        }
    );
};

const createCSV = (location, filename, data) => {
    fs.writeFile(
        "./" + location + "/" + filename + ".csv",
        data,
        "utf8",
        (error) => {
            if (error) {
                console.log(`Error writing file: ${error}`);
            }
        }
    );
};

const uploadFiles = (req, res) => {
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
                const worksheetData = { [sheetNumber]: data };
                workbookData.push(worksheetData);

                // Create CSV with different sheets in different csv file
                Object.keys(worksheetData).forEach((key) => {
                    sheetData = worksheetData[key];
                    const csvData = CSV.parse(sheetData);
                    createCSV(
                        "downloads",
                        file.originalname.substr(
                            0,
                            file.originalname.length - 5
                        ) +
                            "_" +
                            sheetNumber,
                        csvData
                    );
                });

                sheetCount = sheetCount + 1;
            });
            const workbookName = file.originalname.substr(
                0,
                file.originalname.length - 5
            );

            // Create JSON Data
            createJSON("JSON", workbookName, workbookData);
            finalData.push({
                [workbookName]: workbookData,
            });
        });
        createJSON("Uploads", "Uploaded_Data", finalData);
        res.json(finalData);
    } catch (error) {
        console.log(error);
    }
};

module.exports = uploadFiles;
