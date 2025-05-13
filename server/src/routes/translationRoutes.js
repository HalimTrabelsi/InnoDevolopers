const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { translateDocument } = require("../controllers/translationController");

// Set the uploads directory path
const uploadsDir = path.join(__dirname, '../uploads'); // Correcting to refer to the uploads directory

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Ensures the uploads dir is created
}

// Set up storage for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Use the uploadsDir variable
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserve original file extension
    }
});

// File type validation (PDF, Excel)
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|excel|xlsx/; // Allowed file extensions
        const mimetype = /application\/pdf|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/; 
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetypeCheck = mimetype.test(file.mimetype); // Check against file's MIME type

        if (extname && mimetypeCheck) {
            return cb(null, true);
        }
        cb(new Error("Only PDF or Excel files are allowed")); // Error handling
    }
});

// Define the POST route for document translation
router.post("/", upload.single("file"), translateDocument);

module.exports = router;