const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let scoreCache = new Map();

const askGemini = async (req, res) => {
  try {
    const { query, transactions } = req.body;

    if (!query || !transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Invalid or missing query/transactions." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following financial transactions and answer the user's question.

      Transactions:
      ${JSON.stringify(transactions, null, 2)}

      User's Question: ${query}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "❌ Failed to fetch Gemini response." });
  }
};

const predictLatePayment = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Invalid or missing transactions array." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following financial transactions to predict if the client is likely to miss their next invoice payment.

      Consider:
      - Recent payment patterns
      - Delays or missed payments
      - Monthly income vs spending trends
      - Consistency of payments

      Respond in this exact JSON format:
      {
        "willMissNextInvoice": boolean,
        "confidenceScore": number, 
        "reason": string
      }

      Transactions:
      ${JSON.stringify(transactions, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Gemini API Response: ", responseText);

    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();

    try {
      const prediction = JSON.parse(cleanedResponse);
      res.json(prediction);
    } catch (jsonError) {
      console.error("Invalid JSON response:", jsonError);
      res.status(500).json({ error: "❌ Failed to parse the response from Gemini." });
    }

  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ error: "❌ Failed to predict late payment." });
  }
};

module.exports = { askGemini , predictLatePayment };
