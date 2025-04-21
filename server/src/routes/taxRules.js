const express = require('express');
const router = express.Router();
const taxRuleController = require('../controllers/taxRuleController');
const authMiddleware = require('../middlewares/authorization');
const TaxRule = require('../models/TaxRule'); 
const Transaction = require('../models/FinancialTransaction');


router.post('/create', authMiddleware(['Accountant']), taxRuleController.createTaxRule);
router.get('/', authMiddleware(['Accountant']), async (req, res) => {
    try {
      console.log('Requête GET /api/transactions - Utilisateur:', req.user);
      // Récupérer toutes les transactions, sans filtrer par utilisateur
      const transactions = await Transaction.find();
      console.log('Transactions found:', transactions);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  });
router.post('/validate', authMiddleware(['Accountant']), taxRuleController.validateTax);
router.post('/add', authMiddleware(['Admin']), async (req, res) => {
    try {
      const { taxType, rate, applicableCategories, conditions } = req.body;
      console.log('Requête add tax rule:', { taxType, rate, applicableCategories, conditions });
  
      if (!taxType || !rate || !applicableCategories) {
        return res.status(400).json({ message: 'Champs obligatoires manquants' });
      }
  
      const newTaxRule = new TaxRule({
        taxType,
        rate: parseFloat(rate),
        applicableCategories,
        conditions: conditions || {},
        createdBy: req.user.userId,
        createdAt: new Date(),
      });
  
      await newTaxRule.save();
      console.log('Règle fiscale ajoutée:', newTaxRule);
      res.status(201).json({ message: 'Règle fiscale ajoutée avec succès', taxRule: newTaxRule });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la règle fiscale:', error);
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  });

module.exports = router;