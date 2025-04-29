const fs = require('fs');
const pdfParse = require("pdf-parse");
const { NlpManager } = require("node-nlp");
const path = require('path');


const manager = new NlpManager();
(async () => {
    manager.load(path.join(__dirname, '../config/aiModel/model.json'));
})();

const analyzePdf = async (req, res) => {
    try {
        console.log("Request file:", req.file); // Log the uploaded file details

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Read the file from the path
        const filePath = req.file.path; // Get the path of the uploaded file
        const dataBuffer = fs.readFileSync(filePath); // Read the file contents

        // Extract text from the PDF
        const data = await pdfParse(dataBuffer);
        const text = data.text;
        console.log("Extracted text:", text); // Log the extracted text

        // Split the text into sentences (customize the regex as needed)
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g); // Basic regex for sentence splitting
        let results = [];

        for (let sentence of sentences || []) {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
                console.log("Processing sentence:", trimmedSentence); // Log the sentence being processed
                
                // Here is where the model processes the sentence
                let response = await manager.process("en", trimmedSentence); // Use the appropriate language
                console.log("Model response:", response); // Log the model's response
                
                results.push({
                    sentence: trimmedSentence,
                    classification: response.intent === "compliance.yes" ? "Compliant" : "Non-Compliant",
                });
            }
        }

        // Send the results back to the client
        return res.json({ results });
    } catch (error) {
        console.error("Error in analyzePdf:", error);
        return res.status(500).json({ error: "An error occurred while processing the PDF." });
    }
};

module.exports = { analyzePdf };