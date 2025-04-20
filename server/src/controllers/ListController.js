const { User } = require('../models/user');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role, image } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'User added successfully!', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phoneNumber, role } = req.body;

        console.log('Request Data:', { userId, name, email, phoneNumber });

        const user = await User.findByIdAndUpdate(userId, {
            name,
            email,
            phoneNumber,
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error while updating user:', err);

        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete user by ID
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
