const express = require('express');
const { User } = require('../models/user');
const { Activity } = require('../models/activity');
const router = express.Router();
const moment = require('moment');

// ➤ 📊 Statistiques des utilisateurs
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ estActif: true });

        // 🔹 Nombre d’utilisateurs actifs par jour (7 derniers jours)
        const last7Days = [...Array(7).keys()].map(i => moment().subtract(i, 'days').format('YYYY-MM-DD'));

        const activeUsersPerDay = await Promise.all(
            last7Days.map(async (day) => {
                const count = await User.countDocuments({
                    lastLogin: { $gte: new Date(`${day}T00:00:00.000Z`), $lt: new Date(`${day}T23:59:59.999Z`) }
                });
                return { date: day, count };
            })
        );

        res.json({ totalUsers, activeUsers, activeUsersPerDay });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du chargement des statistiques' });
    }
});

// ➤ 📊 Nombre de connexions par jour
router.get('/login-stats', async (req, res) => {
    try {
        const last7Days = [...Array(7).keys()].map(i => moment().subtract(i, 'days').format('YYYY-MM-DD'));

        const loginPerDay = await Promise.all(
            last7Days.map(async (day) => {
                const count = await Activity.countDocuments({
                    action: 'Connexion',
                    date: { $gte: new Date(`${day}T00:00:00.000Z`), $lt: new Date(`${day}T23:59:59.999Z`) }
                });
                return { date: day, count };
            })
        );
        

        res.json({ loginPerDay });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du chargement des connexions' });
    }
});

// ➤ 📊 Actions les plus fréquentes
router.get('/top-actions', async (req, res) => {
    try {
        const actions = await Activity.aggregate([
            { $group: { _id: "$action", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 } // 🔹 Top 5 actions
        ]);

        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du chargement des actions' });
    }
});

module.exports = router;
