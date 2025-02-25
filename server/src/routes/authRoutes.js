const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { User } = require('../models/user');
require('dotenv').config();
const upload = require('../middelwares/uploadImage');


const router = express.Router();

// Configuration de Multer pour l'upload des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'middelwares/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


// ✅ Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        res.redirect('/dashboard');
    }
);

// ✅ Facebook Login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        if (req.user.phoneNumber === "0000000000") {
            return res.redirect(`http://localhost:3000/complete-profile?userId=${req.user.id}`);
        }
        res.redirect("http://localhost:3000/sing-in");
    }
);

// ✅ Complétion du profil
router.post('/complete-profile', upload.single('image'), async (req, res) => {
    try {
        const { userId, password, confirmPassword, phoneNumber, role } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "ID utilisateur manquant." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const imageUrl = req.file ? req.file.path : "";


        const user = await User.findByIdAndUpdate(userId, {
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl,
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        switch (user.role) {
            case 'Admin':
                return res.status(200).json({ message: "Inscription complétée avec succès.", redirect: "/admin-dashboard" });
            case 'Business owner':
                return res.status(200).json({ message: "Inscription complétée avec succès.", redirect: "/business-owner-dashboard" });
            case 'Financial manager':
                return res.status(200).json({ message: "Inscription complétée avec succès.", redirect: "/financial-manager-dashboard" });
            case 'Accountant':
                return res.status(200).json({ message: "Inscription complétée avec succès.", redirect: "/accountant-dashboard" });
            default:
                return res.status(200).json({ message: "Inscription complétée avec succès.", redirect: "/" });
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
});

// ✅ Mise à jour du profil
router.post('/update-profile', async (req, res) => {
    try {
        const { userId, phoneNumber } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        user.phoneNumber = phoneNumber;
        await user.save();

        res.json({ message: "Profil mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ✅ Déconnexion
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;

