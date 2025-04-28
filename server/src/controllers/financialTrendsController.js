const Transaction = require('../models/FinancialTransaction');
const { Revenue } = require('../models/revenue');
const Expense = require('../models/expenses');

exports.getFinancialTrendsData = async (req, res) => {
  try {
    console.log('Début de la récupération des transactions...');
    const transactions = await Transaction.find({})
      .select('amount date type')
      .lean();
    console.log('Transactions récupérées :', transactions.length);

    console.log('Début de la récupération des revenues...');
    const revenues = await Revenue.find({})
      .select('amount date')
      .lean();
    console.log('Revenues récupérées :', revenues.length);

    console.log('Début de la récupération des expenses...');
    const expenses = await Expense.find({})
      .select('amount date')
      .lean();
    console.log('Expenses récupérées :', expenses.length);

    console.log('Combinaison des données...');
    const combinedData = [
      ...transactions.map(t => ({
        amount: t.amount,
        date: new Date(t.date).toISOString(),
        category: t.type === 'credit' ? 'revenue' : 'expense',
      })),
      ...revenues.map(r => ({
        amount: r.amount,
        date: new Date(r.date).toISOString(),
        category: 'revenue',
      })),
      ...expenses.map(e => ({
        amount: e.amount,
        date: new Date(e.date).toISOString(),
        category: 'expense',
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
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des données.' });
  }
};