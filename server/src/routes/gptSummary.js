const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai"); // Use OpenAI directly
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Retry function for handling quota errors
const retryRequest = async (fn, retries = 5, delay = 1000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.response && error.response.status === 429) {
        console.log(`Quota exceeded, retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw lastError; // Final throw if out of retries
};

// GPT request route
router.post("/ask", async (req, res) => {
  const { query, transactions } = req.body;

  try {
    const response = await retryRequest(async () => {
      return await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // If available
        messages: [
          {
            role: "system",
            content: "You are a financial assistant. Use the user's transaction history to answer their questions.",
          },
          {
            role: "user",
            content: `Here are my transactions: ${JSON.stringify(transactions)}. \n\nNow answer this: ${query}`,
          },
        ],
      });
    });

    // Return GPT response
    res.json({ answer: response.choices[0].message.content });
  } catch (err) {
    console.error("Error in GPT request:", err);
    res.status(500).json({ error: "Something went wrong while contacting OpenAI" });
  }
});

module.exports = router;
