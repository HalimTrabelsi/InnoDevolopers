const { NlpManager } = require("node-nlp");
const fs = require("fs");

const manager = new NlpManager({ languages: ["en", "fr"] });

// Neutral examples for titles and fiscal year
manager.addDocument("en", "Compliance Report for XYZ Corp.", "neutral");
manager.addDocument("en", "Fiscal Year: 2024", "neutral");
manager.addDocument("en", "Section 1: VAT Declaration", "neutral");
manager.addDocument("en", "Section 2: Income Tax", "neutral");
manager.addDocument("en", "Section 3: Financial Statements", "neutral");

// Regulations as training examples
manager.addDocument("en", "The VAT declaration includes all taxable transactions as per Tunisian VAT Law.", "compliance.yes");
manager.addDocument("en", "The VAT declaration is complete and covers all required goods and services subject to VAT.", "compliance.yes");
manager.addDocument("en", "All necessary documents for VAT, including invoices, receipts, and tax records, are submitted.", "compliance.yes");
manager.addDocument("en", "The VAT calculations are accurate and comply with the Tunisian tax code, and the VAT return is filed on time.", "compliance.yes");

// Income Tax examples
manager.addDocument("en", "The income tax return is filed in accordance with Article 52 of the Tunisian tax code.", "compliance.yes");
manager.addDocument("en", "All income sources have been accurately reported.", "compliance.yes");
manager.addDocument("en", "All necessary supporting documents have been included.", "compliance.yes");
manager.addDocument("en", "The income tax calculations are accurate and align with applicable tax rates.", "compliance.yes");

// Financial Statements examples
manager.addDocument("en", "The balance sheet discloses all assets, liabilities, and equity according to TAS 3.", "compliance.yes");
manager.addDocument("en", "The income statement reflects accurate revenue and expense reporting.", "compliance.yes");
manager.addDocument("en", "The statement of cash flows accurately shows cash inflows and outflows for the fiscal year.", "compliance.yes");
manager.addDocument("en", "The statement of cash flows is prepared according to required standards.", "compliance.yes");

// Add more compliant examples to reinforce understanding
manager.addDocument("en", "The VAT declaration is fully compliant with all legal requirements.", "compliance.yes");
manager.addDocument("en", "The financial statements provide a true and fair view of the company's financial position.", "compliance.yes");
manager.addDocument("en", "All financial records are maintained in accordance with applicable standards.", "compliance.yes");

// Overall compliance examples
manager.addDocument("en", "The compliance report for XYZ Corp. is compliant because all sections meet the requirements.", "compliance.yes");
manager.addDocument("en", "Despite some individual issues, the overall report is compliant.", "compliance.yes");
manager.addDocument("en", "The compliance report is compliant as the majority of sections are compliant.", "compliance.yes");

// Non-Compliant Examples
manager.addDocument("en", "The VAT calculations are inaccurate and do not comply with the Tunisian tax code.", "compliance.no");
manager.addDocument("en", "The statement of cash flows is non-compliant due to missing data.", "compliance.no");

// Add more specific non-compliant examples to cover more scenarios
manager.addDocument("en", "The VAT return was filed late, violating the Tunisian VAT Law.", "compliance.no");
manager.addDocument("en", "The statement of cash flows is incomplete and does not show the full financial picture for the fiscal year.", "compliance.no");
manager.addDocument("en", "The VAT declaration is missing several key taxable transactions, making it non-compliant.", "compliance.no");
manager.addDocument("en", "The balance sheet fails to disclose some key liabilities, making it non-compliant with TAS 3.", "compliance.no");

// Composite non-compliant example for overall report
manager.addDocument("en", "The compliance report for XYZ Corp. is non-compliant due to missing VAT supporting documents and an incomplete statement of cash flows.", "compliance.no");

// Train the model
(async () => {
    try {
        console.log("Loading and training the NLP model...");
        await manager.train(); // Train with the new examples

        await manager.save("./aiModel/model.json"); // Save the updated model
        console.log("Training complete. Model saved.");

    } catch (error) {
        console.error("Error training the model:", error);
    }
})();
