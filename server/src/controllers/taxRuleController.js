const TaxRule = require('../models/TaxRule');
   const mongoose = require('mongoose');
   const io = require('../socket'); 

   const createTaxRule = async (req, res) => {
     try {
       const { taxType, rate, applicableCategories, conditions } = req.body;
       const taxRule = new TaxRule({
         taxType,
         rate,
         applicableCategories,
         conditions,
         createdBy: req.user.id,
       });
       await taxRule.save();
       res.status(201).json({ message: 'Règle fiscale créée', taxRule });
     } catch (error) {
       console.error('Erreur lors de la création de la règle fiscale:', error);
       res.status(500).json({ message: 'Erreur serveur', error });
     }
   };

   const validateTax = async (req, res) => {
     try {
       console.log('Requête validateTax:', req.body);
       const { recordId, collection, userTax, consumption, isExport } = req.body;
       const validCollections = ['Expense', 'Revenue', 'Transaction'];
       if (!validCollections.includes(collection)) {
         return res.status(400).json({ message: 'Collection invalide' });
       }

       const record = await mongoose.model(collection).findById(recordId);
       if (!record) {
         return res.status(404).json({ message: 'Enregistrement non trouvé' });
       }

       console.log('Transaction récupérée:', record);

       const taxRule = await TaxRule.findOne({
         taxType: record.taxType,
         applicableCategories: record.category,
       });
       console.log('Règle fiscale trouvée:', taxRule);

       if (!taxRule) {
         return res.status(400).json({ message: 'Aucune règle fiscale applicable' });
       }

       let expectedTax = 0;
       if (taxRule.taxType === 'TVA') {
         if (taxRule.conditions?.maxConsumption && consumption > taxRule.conditions.maxConsumption) {
           const standardRule = await TaxRule.findOne({
             taxType: 'TVA',
             applicableCategories: record.category,
             'conditions.maxConsumption': null,
           });
           expectedTax = record.amount * (standardRule?.rate || 0.19);
         } else {
           expectedTax = record.amount * taxRule.rate;
         }
       } else if (taxRule.taxType === 'IS') {
         expectedTax = record.amount * (isExport ? 0.10 : taxRule.rate);
       } else if (taxRule.taxType === 'SSC') {
         expectedTax = record.amount * 0.005;
       } else {
         expectedTax = record.amount * taxRule.rate;
       }

       console.log('Taxe attendue:', expectedTax);

       const isValid = Math.abs(expectedTax - userTax) < 0.01;

       if (!isValid) {
         await mongoose.model(collection).updateOne(
           { _id: recordId },
           {
             isTaxValidated: false,
             anomalie: true,
             commentaireAnomalie: `Taxe incorrecte: ${userTax} au lieu de ${expectedTax}`,
           }
         );
         io.getIO().emit('taxValidation', {
           recordId,
           isValid,
           message: `Erreur: taxe incorrecte pour ${recordId}`,
         });
       } else {
         await mongoose.model(collection).updateOne(
           { _id: recordId },
           { isTaxValidated: true, taxCalculated: expectedTax }
         );
         io.getIO().emit('taxValidation', {
           recordId,
           isValid,
           message: `Taxe validée pour ${recordId}`,
         });
       }

       res.status(200).json({ isValid, expectedTax });
     } catch (error) {
       console.error('Erreur lors de la validation de la taxe:', error);
       res.status(500).json({ message: 'Erreur serveur', error });
     }
   };

   module.exports = { createTaxRule, validateTax };