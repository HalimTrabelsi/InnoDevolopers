const express = require("express");
const router = express.Router();
const { askGemini, getClientHealthScore , predictLatePayment  } = require("../controllers/geminiController"); 

router.post("/ask", askGemini);
router.post("/predict-late", predictLatePayment); 


module.exports = router;
