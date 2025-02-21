const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { validationResult } = require('express-validator');
require('dotenv').config();

// User Registration
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phoneNumber, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const imageUrl = req.file ? req.file.path : '';

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id , role: user.role}, 
            process.env.JWT_SECRET, { expiresIn: '1h',}
        );

        res.status(200).json({ token, role:user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, signInUser };
