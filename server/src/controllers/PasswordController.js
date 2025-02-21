const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {User} = require('../models/user'); 
const express = require('express');
const upload = require('../middlewares/uploadImage');
require('dotenv').config();



     const forgotPassword = async (req, res) =>{
        const { email } = req.body;

        console.log("Received forgot-password request for email:", email);

        if (!email) {
            console.log("No email provided");
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        try {
            const user = await User.findOne({ email });

            if (!user) {
                console.log("No user found with this email:", email);
                return res.status(404).json({ message: 'No user found with that email address' });
            }

            console.log("User found:", user.email);

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1h expiration

            await user.save();

            console.log("Reset token generated:", resetToken);

            // Send l mail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'chamekheya1@gmail.com',
                    pass: 'zwzi htyh segm lffy',
                },
            });

            const resetLink = `http://localhost:5002/reset-password/${resetToken}`;
            console.log("Sending email to:", user.email);

            const mailOptions = {
                from: 'chamekheya1@gmail.com',
                to: user.email,
                subject: 'Password Reset',
                text: `Click the following link to reset your password: ${resetLink}`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");

            return res.status(200).json({ message: 'Password reset link sent to your email' });

        } catch (error) {
            console.error("Error in password reset process:", error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    };


module.exports = {forgotPassword};
