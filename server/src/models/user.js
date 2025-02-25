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
            return !this.googleId && !this.facebookId; // Le mot de passe est requis sauf si l'utilisateur s'inscrit via OAuth
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
    googleId: { type: String },  // Ajout du champ pour Google OAuth
    facebookId: { type: String }, // Ajout du champ pour Facebook OAuth
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entreprise',
    },
    bankAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
    }],
    image: { type: String },
});

// Comparaison de mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Génération du token JWT
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
