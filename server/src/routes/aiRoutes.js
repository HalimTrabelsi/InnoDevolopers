const express = require("express");
const multer = require("multer");
const { analyzePdf } = require("../controllers/aiController");
const path = require("path");

const router = express.Router();

// Set up Multer to save files to the uploads directory
const upload = multer({ 
    dest: path.join(__dirname, '../uploads') // Ensure this path is correct
}); 

// Define the route to analyze PDF
router.post("/analyze-pdf", upload.single("file"), analyzePdf);

module.exports = router;