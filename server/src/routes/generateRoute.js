const express = require('express');
const router = express.Router();
const { generatePDF, generateExcel } = require('../controllers/generateController');

router.post('/generate-pdf', generatePDF);
router.post('/generate-excel', generateExcel);

module.exports = router;
