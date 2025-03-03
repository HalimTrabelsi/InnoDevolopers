const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId && !this.facebookId; 
        }
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['Business owner', 'Financial manager', 'Accountant', 'Admin'],
        required: true,
    },
    googleId: { type: String },
    facebookId: { type: String },
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entreprise',
    },
    bankAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
    }],
    image: { type: String },
    lastLogin: { type: Date }, 
    estActif: { type: Boolean, default: false },
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
