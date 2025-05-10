const axios = require('axios');
const nodemailer = require('nodemailer');

let lastPrice = null; // store the last checked price

async function checkBitcoinPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const currentPrice = response.data.bitcoin.usd;

    console.log('Current Bitcoin Price:', currentPrice);

    // Define alert threshold (5% change)
    //if (lastPrice !== null) {
    //to teeest 
      if (lastPrice !== 10000) {
      const changePercent = Math.abs((currentPrice - lastPrice) / lastPrice) * 100;
      if (changePercent >= 5) {
        await sendEmailAlert(currentPrice, changePercent);
      }
    }
    lastPrice = currentPrice;

  } catch (error) {
    console.error('Error fetching Bitcoin price:', error.message);
  }
}

async function sendEmailAlert(price, change) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER1,
      pass: process.env.EMAIL_PASS1,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER1,
    to: 'chamekheya1@gmail.com',
    subject: '⚠️ Bitcoin Price Alert!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c;">⚠️ Bitcoin Price Alert</h2>
          <p style="font-size: 16px; color: #333333;">Dear Financial Manager,</p>
          <p style="font-size: 16px; color: #333333;">
            The Bitcoin price has changed significantly.
          </p>
          <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">
            📉 Change: ${change.toFixed(2)}%
          </p>
          <p style="font-size: 18px; font-weight: bold; color: #27ae60;">
            💰 Current Price: $${price}
          </p>
          <p style="font-size: 16px; color: #333333;">
            Please review the market trends and consider appropriate action.
          </p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #999999;">This is an automated alert from your crypto monitoring system.</p>
        </div>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log('Bitcoin alert sent!');
  } catch (error) {
    console.error('Failed to send alert:', error.message);
  }
}

module.exports = { checkBitcoinPrice };
