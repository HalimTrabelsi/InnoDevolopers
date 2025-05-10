// services/reportService.js
const { Revenue } = require('../models/revenue');
const FinancialTransaction = require('../models/FinancialTransaction');

const generateFinancialReport = async () => {
  try {
    // generating the report
    const totalRevenueResult = await Revenue.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalProfitResult = await FinancialTransaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalProfit = totalProfitResult[0]?.total || 0;

    const report = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); overflow: hidden;">
        
        <div style="background-color: #34495e; padding: 20px;">
          <h2 style="color: #ffffff; margin: 0;">📊 Monthly Financial Report</h2>
          <p style="color: #ecf0f1; margin: 5px 0 0;">Innodevolopers</p>
        </div>
        
        <div style="padding: 25px;">
          <p style="font-size: 16px; color: #2c3e50;">
            Hello 👋 Financial Manager,
          </p>
  
          <p style="font-size: 16px; color: #2c3e50; line-height: 1.5;">
            Here's the latest summary of our financial performance. Please review the details below and take any necessary actions.
          </p>
  
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-size: 16px;">💼 <strong>Total Revenue</strong></td>
              <td style="padding: 10px; font-size: 16px; text-align: right; color: #27ae60;"><strong>${totalRevenue} DTN</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-size: 16px;">📈 <strong>Total Profit</strong></td>
              <td style="padding: 10px; font-size: 16px; text-align: right; color: #2980b9;"><strong>${totalProfit} DTN</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-size: 16px;">🗓️ <strong>Date</strong></td>
              <td style="padding: 10px; font-size: 16px; text-align: right;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
  
          <p style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">
            This report was generated automatically. For more details, please log into your dashboard.
          </p>
        </div>
  
        <div style="background-color: #ecf0f1; padding: 15px; text-align: center; font-size: 13px; color: #95a5a6;">
          © ${new Date().getFullYear()} Innodevolopers . — All rights reserved.
        </div>
  
      </div>
    </div>
  `;
  

    return report;
  } catch (error) {
    console.error(' Error generating report:', error);
    return null;
  }
};

module.exports = { generateFinancialReport };
