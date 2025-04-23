const Expense = require('../models/expenses');
const { Revenue } = require('../models/revenue');
const Transaction = require('../models/FinancialTransaction');
const TaxRule = require('../models/TaxRule');
const Simulation = require('../models/Simulation');

// Fonction pour fetch les données financières des 3 derniers mois (sans userId)
const getRecentFinancialData = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    // Fetch tous les revenus (sans filtrer par createdBy)
    const revenuesData = await Revenue.find({
      date: { $gte: threeMonthsAgo },
      status: 'Completed',
    });

    const avgRevenues = revenuesData.length > 0
      ? revenuesData.reduce((sum, item) => sum + item.amount, 0) / revenuesData.length
      : 0;

    // Fetch toutes les dépenses (sans filtrer par userId)
    const expensesData = await Expense.find({
      date: { $gte: threeMonthsAgo },
      status: 'Pending',
    });

    const avgExpenses = expensesData.length > 0
      ? expensesData.reduce((sum, item) => sum + item.amount, 0) / expensesData.length
      : 0;

    // Fetch tous les investissements (sans filtrer par user)
    const investmentsData = await Transaction.find({
      date: { $gte: threeMonthsAgo },
      type: 'debit',
      category: 'Investment',
    });

    const avgInvestments = investmentsData.length > 0
      ? investmentsData.reduce((sum, item) => sum + item.amount, 0) / investmentsData.length
      : 0;

    // Fetch les règles fiscales (TVA)
    const taxRules = await TaxRule.find({ taxType: 'TVA' });
    const tvaRate = taxRules.length > 0 ? taxRules[0].rate : 0;

    const netRevenues = avgRevenues * (1 - tvaRate);
    const cashFlow = netRevenues - avgExpenses - avgInvestments;

    return { revenues: netRevenues, expenses: avgExpenses, investments: avgInvestments, cashFlow };
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des données financières : ${error.message}`);
  }
};

// Simuler un scénario (sans userId)
const simulateScenario = async (req, res) => {
  try {
    const { name, revenueChange, expenseChange, investment } = req.body;

    // Vérification des champs obligatoires
    if (!name) {
      return res.status(400).json({ message: 'Le nom du scénario est requis' });
    }

    // Convertir les valeurs en nombres
    const revenueChangeNum = parseFloat(revenueChange) || 0;
    const expenseChangeNum = parseFloat(expenseChange) || 0;
    const investmentNum = parseFloat(investment) || 0;

    // Récupérer les données financières récentes
    const financialData = await getRecentFinancialData();

    // Appliquer les variations
    const simulatedRevenues = financialData.revenues * (1 + revenueChangeNum / 100);
    const simulatedExpenses = financialData.expenses + expenseChangeNum;
    const simulatedInvestments = financialData.investments + investmentNum;
    const simulatedCashFlow = simulatedRevenues - simulatedExpenses - simulatedInvestments;

    // Générer une recommandation (en anglais)
    let recommendation = '';
    if (simulatedCashFlow < 0) {
      recommendation = 'Warning: Your cash flow is negative. Consider reducing expenses or increasing revenues.';
    } else {
      recommendation = 'Good news: Your cash flow remains positive. You can consider new investments.';
    }

    // Sauvegarder la simulation
    const simulation = new Simulation({
      name,
      revenueChange: revenueChangeNum,
      expenseChange: expenseChangeNum,
      investment: investmentNum,
      simulatedRevenues,
      simulatedExpenses,
      simulatedCashFlow,
    });
    await simulation.save();

    res.status(200).json({
      current: financialData,
      simulated: { revenues: simulatedRevenues, expenses: simulatedExpenses, cashFlow: simulatedCashFlow },
      recommendation,
    });
  } catch (error) {
    console.error('Erreur dans simulateScenario:', error);
    res.status(500).json({ message: 'Erreur lors de la simulation', error: error.message });
  }
};

// Exporter les fonctions
module.exports = {
  simulateScenario,
};