// summarizationController.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference('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'); // make sure this is set

exports.summarizePdf = async (req, res) => {
    try {
        const pdfPath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        if (!text || text.trim().length === 0) {
            return res.json({ summary: 'No summary could be generated.' });
        }

        const result = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: text.slice(0, 3000), // truncate if needed
        });

        console.log("🧠 Hugging Face response:", result);

        if (result.summary_text && result.summary_text.trim() !== '') {
            res.json({ summary: result.summary_text }); // ✅ send the real summary
        } else {
            res.json({ summary: 'No summary could be generated.' });
        }
    } catch (error) {
        console.error("❌ Error summarizing PDF:", error);
        res.status(500).json({ summary: 'No summary could be generated.' });
    }
};
