const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { validationResult } = require("express-validator");
const { image } = require("../config/cloudinary");
require("dotenv").config();

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phoneNumber, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image file is missing" });
        }

        // Get the image URL from the uploaded file
        const imageUrl = req.file.path; // This should now contain the Cloudinary URL

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl, // Store the image URL
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Sign-In
const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email, image: user.image }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ token, role: user.role, image: user.image });
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// User Logout
const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
};

// Check Authentication
const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserImageByEmail = async (req, res) => {
    const { email } = req.params; // Fetch email from request parameters

    try {
        const user = await User.findOne({ email }).select('image'); // Select only the image field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ imageUrl: user.image });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { registerUser, signInUser, logout, checkAuth,getUserImageByEmail };
