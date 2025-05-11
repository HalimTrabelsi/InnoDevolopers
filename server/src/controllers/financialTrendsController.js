const Transaction = require('../models/FinancialTransaction');
const { Revenue } = require('../models/revenue');
const Expense = require('../models/expenses');
const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation');

exports.getFinancialTrendsData = async (req, res) => {
  try {
    console.log('Début de la récupération des transactions...');
    const transactions = await Transaction.find({})
      .select('amount date type category')
      .lean();
    console.log('Transactions récupérées :', transactions.length);

    console.log('Début de la récupération des revenues...');
    const revenues = await Revenue.find({})
      .select('amount date category')
      .lean();
    console.log('Revenues récupérées :', revenues.length);

    console.log('Début de la récupération des expenses...');
    const expenses = await Expense.find({})
      .select('amount date category')
      .lean();
    console.log('Expenses récupérées :', expenses.length);

    console.log('Combinaison des données...');
    const combinedData = [
      ...transactions.map(t => ({
        amount: t.amount,
        date: new Date(t.date).toISOString(),
        category: t.type === 'credit' ? 'revenue' : 'expense',
        subCategory: t.category || 'Uncategorized',
      })),
      ...revenues.map(r => ({
        amount: r.amount,
        date: new Date(r.date).toISOString(),
        category: 'revenue',
        subCategory: r.category || 'Uncategorized',
      })),
      ...expenses.map(e => ({
        amount: e.amount,
        date: new Date(e.date).toISOString(),
        category: 'expense',
        subCategory: e.category || 'Uncategorized',
      })),
    ];

    console.log('Filtrage des dates invalides...');
    const validData = combinedData.filter(item => !isNaN(new Date(item.date).getTime()));
    console.log('Données valides après filtrage :', validData.length);

    if (!validData || validData.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée financière valide trouvée dans la base de données.' });
    }

    res.json(validData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour les tendances financières:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des données.', error: error.message });
  }
};

exports.getTransactionsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Année et mois requis.' });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    }).select('amount date type category').lean();

    const revenues = await Revenue.find({
      date: { $gte: startDate, $lte: endDate },
    }).select('amount date category').lean();

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    }).select('amount date category').lean();

    const combinedData = [
      ...transactions.map(t => ({
        amount: t.amount,
        date: new Date(t.date).toISOString(),
        category: t.type === 'credit' ? 'revenue' : 'expense',
        subCategory: t.category || 'Uncategorized',
      })),
      ...revenues.map(r => ({
        amount: r.amount,
        date: new Date(r.date).toISOString(),
        category: 'revenue',
        subCategory: r.category || 'Uncategorized',
      })),
      ...expenses.map(e => ({
        amount: e.amount,
        date: new Date(r.date).toISOString(),
        category: 'expense',
        subCategory: e.category || 'Uncategorized',
      })),
    ];

    res.json(combinedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions par mois:', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.saveRecommendation = async (req, res) => {
  try {
    const { text, priority, action } = req.body;

    // Validate input
    if (!text || !req.user || !req.user._id) {
      return res.status(400).json({ message: 'Text and user ID are required.' });
    }

    const recommendation = {
      text,
      priority: priority || 'suggestion',
      action,
      status: 'pending',
      userId: req.user._id,
      createdAt: new Date(),
    };

    // Save to database
    const savedRecommendation = await Recommendation.create(recommendation);
    res.status(201).json(savedRecommendation);
  } catch (error) {
    console.error('Erreur lors de l’enregistrement de la recommandation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’enregistrement de la recommandation.', error: error.message });
  }
};

exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recommendation ID.' });
    }

    const recommendation = await Recommendation.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommandation non trouvée.' });
    }

    res.json(recommendation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recommandation:', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};