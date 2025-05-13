const fs = require("fs");
const path = require("path");
const axios = require("axios");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");

// Function to translate text using a local API
const translateText = async (text, targetLang) => {
    try {
        const response = await axios.post("http://localhost:5000/translate", { // Update the URL to your self-hosted instance
            q: text,
            source: "auto",
            target: targetLang,
            format: "text",
        }, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data.translatedText;
    } catch (error) {
        console.error("Translation error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to translate text");
    }
};

// Handle PDF file: Extract text using pdf-parse
const handlePdf = async (filePath) => {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
};

// Handle Excel file: Extract text using xlsx
const handleExcel = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return jsonData.flat().join(" ");
};

// Main function to handle document translation
const translateDocument = async (req, res) => {
    try {
        const { file } = req;
        const { targetLang } = req.body;

        // Check if the file and targetLang are provided
        if (!file) return res.status(400).json({ error: "No file uploaded" });
        if (!targetLang) return res.status(400).json({ error: "Target language is required" });

        const filePath = path.join(__dirname, "../uploads", file.filename);
        const ext = path.extname(file.originalname).toLowerCase();

        let text = "";

        // Handle different file types (PDF, Excel)
        if (ext === ".pdf") {
            text = await handlePdf(filePath);
        } else if (ext === ".xls" || ext === ".xlsx") {
            text = await handleExcel(filePath);
        } else {
            return res.status(400).json({ error: "Unsupported file type" });
        }

        // Check if the extracted text is not too long
        if (text.length > 2000) { // Adjust the limit based on your needs
            return res.status(400).json({ error: "Text is too long to translate" });
        }

        // Translate the extracted text
        const translatedText = await translateText(text, targetLang);

        // Attempt to remove the file after processing
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error("Error removing file:", err.message);
        }

        // Return the translated text as response
        return res.json({ translatedText });

    } catch (error) {
        console.error("TranslationController Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { translateDocument };