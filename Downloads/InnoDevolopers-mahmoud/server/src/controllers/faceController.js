const axios = require("axios");
require("dotenv").config();

const compareFaces = async (req, res) => {
    const apiKey = process.env.FACEPP_API_KEY;
    const apiSecret = process.env.FACEPP_API_SECRET;

    try {
        console.log("Incoming request data:", req.body);

        const { imageBase64, storedImageUrl } = req.body;

        // Validate input
        if (!storedImageUrl || !imageBase64) {
            return res.status(400).json({ message: "Missing required data: storedImageUrl or imageBase64" });
        }

        // Prepare the request to Face++ API
        const response = await axios.post(
            "https://api-us.faceplusplus.com/facepp/v3/compare",
            new URLSearchParams({
                api_key: apiKey,
                api_secret: apiSecret,
                image_url1: storedImageUrl,
                image_base64_2: imageBase64,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        console.log("Face++ API response:", response.data);

        // Check the confidence level
        if (response.data.confidence > 90) {
            return res.json({ success: true, similarity: response.data.confidence });
        } else {
            return res.json({ success: false, message: "Face mismatch" });
        }
    } catch (error) {
        console.error("Error comparing faces:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Face recognition failed", error: error.response ? error.response.data : error.message });
    }
};

module.exports = { compareFaces };