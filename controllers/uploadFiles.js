const path = require("path");
const xlsx = require("xlsx");

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
                workbookData.push({ [sheetNumber]: data });
                sheetCount = sheetCount + 1;
            });
            finalData.push({
                [file.originalname.substr(0, file.originalname.length - 5)]:
                    workbookData,
            });
        });
        res.send(finalData);
    } catch (error) {
        console.log(error);
    }
};

module.exports = uploadFiles;
