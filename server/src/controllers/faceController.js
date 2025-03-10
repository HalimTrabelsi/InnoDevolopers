const axios = require("axios");
require("dotenv").config();

const compareFaces = async (req, res) => {
    try {
        console.log("Incoming request data:", req.body);

        const { imageBase64, storedImageUrl } = req.body;

        if (!storedImageUrl || !imageBase64) {
            return res.status(400).json({ message: "Missing required data: storedImageUrl or imageBase64" });
        }

        // Send request to Face++ API
        const response = await axios.post(
            "https://api.faceplusplus.com/facepp/v3/compare",
            new URLSearchParams({
                api_key: process.env.FACEPP_API_KEY,
                api_secret: process.env.FACEPP_API_SECRET,
                image_url1: storedImageUrl,  // Stored profile image URL
                image_base64_2: imageBase64, // Captured image in Base64
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        console.log("Face++ API response:", response.data);

        if (response.data.confidence > 80) {
            return res.json({ success: true, similarity: response.data.confidence });
        } else {
            return res.json({ success: false, message: "Face mismatch" });
        }
    } catch (error) {
        console.error("Error comparing faces:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Face recognition failed" });
    }
};

module.exports = { compareFaces };
