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
