const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: hashedPassword,
                role: 'Admin'
            });

            await user.save();
            await sendPasswordEmail(user.email, tempPassword);
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "emails", "name"],
    passReqToCallback: true  
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `facebook_${profile.id}@example.com`;
        let user = await User.findOne({ email });

        if (!user) {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            
            const imageUrl = req?.file ? req.file.path : "";

            user = new User({
                name: `${profile.name.givenName} ${profile.name.familyName}`,
                email,
                password: hashedPassword,
                phoneNumber: "0000000000",
                role: "Business owner",
                image: imageUrl,
            });

            await user.save();
            console.log(`Mot de passe temporaire: ${tempPassword}`);
        }

        return done(null, user);
    } catch (err) {
        console.error("Erreur lors de l'authentification Facebook:", err);
        return done(err, false);
    }
}));

async function sendPasswordEmail(userEmail, tempPassword) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Votre mot de passe',
        text: `Bonjour,\n\nVotre compte a été créé avec succès. Voici votre mot de passe :\n\nMot de passe : ${tempPassword}\n\nCordialement,\nL'équipe`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email envoyé à ${userEmail}`);
    } catch (error) {
        console.error(`Erreur d'envoi d'email: ${error}`);
    }
}
