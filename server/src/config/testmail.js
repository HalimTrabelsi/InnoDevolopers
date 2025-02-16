const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" }); // Adjust path if necessary
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
console.log("Email:", process.env.EMAIL_USER);
console.log("Password:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "halimtrabelsi73@gmail.com",
    subject: "Test Email",
    text: "If you received this email, your Gmail setup is working!",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent successfully:", info.response);
    }
});
