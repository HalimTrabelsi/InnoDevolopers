const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { generateFinancialReport } = require('./reportService');
const { checkBitcoinPrice } = require('./bitcoinAlertService');
const User = require('../models/user'); 

//  Schedule: Every 1 minute
cron.schedule('* * * * *', async () => {
//  Schedule: Every day at 8 AM
//cron.schedule('0 8 * * *', async () => {
  console.log(' Running scheduled report job...');

  // const report = await generateFinancialReport();
  // if (!report) return;

    // Fetch only Financial Managers
    const managers = await User.find({ role: 'Financial Manager' });

  //  Email Configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER1,        
      pass: process.env.EMAIL_PASS1,  
    },
  });
for (const manager of managers) {
  const mailOptions = {
    from: process.env.EMAIL_USER1,
    to: 'chamekheya1@gmail.com', 
    subject: '📧 Daily Financial Report',
    html: report,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' Report sent to manager');
  } catch (error) {
    console.error(' Failed to send report:', error);
  }
}
});
//  Schedule: Every 1 minute
cron.schedule('* * * * *', async () => {
// Bitcoin Price Alert Every 30 Minutes
//cron.schedule('*/30 * * * *', () => {
  console.log('⏰ Checking Bitcoin price...');
  checkBitcoinPrice();
});