const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const userRoutes = require('./routes/userRoute');
const cryptoRoutes = require('./routes/crypto');
const compteBanciareRoutes=require('./routes/compteBancaireRoutes')

const dbConfig = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');
const FinancialTransaction = require('./models/FinancialTransaction');
const aiService = require('./services/aiService');
const User = require('./models/user');
const Transaction = require('./models/transaction');
const CoinGeckoService=require('./services/CoinGeckoService')
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
dbConfig();
app.use(cors());

// Routes
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/stripe', require('./routes/stripe'));
app.use('/transaction', transactionRoutes); // Transaction Routes
app.use('/crypto', cryptoRoutes); // Transaction Routes
app.use('/compteBancaire', compteBanciareRoutes);



// Start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));