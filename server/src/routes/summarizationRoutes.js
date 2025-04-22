const express = require("express");
const multer = require("multer");
const { summarizePdf } = require("../controllers/summarizationController"); // Change here
const path = require("path");

const router = express.Router();

const upload = multer({ 
    dest: path.join(__dirname, '../uploads') 
}); 

router.post("/", upload.single("file"), summarizePdf); // Change here

module.exports = router;