const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoute');
const profileRoutes = require('../routes/profileRoute');
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const http = require("http");
const multer = require("multer");
const mongoose = require("mongoose");
const authRoutes = require("../routes/authRoutes");
const userStatsRoutes = require("../routes/userstats");
const cashflowRoutes = require("../routes/cashflow");
const accountsRoutes = require("../routes/accounts");
const transactionsRoutes = require("../routes/transactions");
const authRoute = require("../routes/refresh");
const notificationRoutes = require("../routes/notificationRoutes");
const approvalRoutes = require("../routes/approvalRoutes");
const upload = require('../middlewares/uploadImage');
const ListRoutes = require("../routes/listRoutes");
const taxRulesRoutes = require('../routes/taxRules');
const socket = require('../socket'); 
const financialTrendsRoutes = require('../routes/financialTrends');
const simulationRoutes = require('../routes/simulationRoutes');
const geminiRoute = require('../routes/geminiRoute');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
const transactionRoutesSaif = require("../routes/transactionRoutes");
const io = socket.init(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use("/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/", cashflowRoutes.router);
app.use("/api/auth", authRoute);
app.use("/api/approvals", approvalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/userstats", userStatsRoutes);
app.use("/api/list", ListRoutes);
app.use('/api/taxRules', taxRulesRoutes);
app.use('/api/financial-trends', financialTrendsRoutes);
app.use('/api/simulations', simulationRoutes);
app.use("/api/gemini", geminiRoute); 

require("../controllers/passport");
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DATABASE_NAME,
    })
    .then(() => {
        console.log(`Connecté à MongoDB Atlas - Base: ${process.env.DATABASE_NAME}`);
        const db = mongoose.connection;
        db.once("open", () => {
            console.log(`Base actuellement utilisée: ${db.name}`);
            const transactionsCollection = db.collection("transactions");
            cashflowRoutes.setTransactionsCollection(transactionsCollection);
            console.log('Collection "transactions" prête');
        });
    })
    .catch((err) => console.error("Erreur de connexion MongoDB:", err));


const generateRoutes = require('../routes/generateRoute');
const translationRoutes = require('../routes/translationRoutes');
const tranRoutes = require('../routes/tranRoute');
const revenueRoute = require('../routes/revenueRoute');
const expenseRoutes = require('../routes/expenseRoutes');
const smsRoutes = require('../routes/smsRoute');
const aiRoutes = require('../routes/aiRoutes');
const cookieParser = require("cookie-parser");
const cryptoRoutes = require('../routes/crypto');
const compteBanciareRoutes = require('../routes/compteBancaireRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use('/api/export', generateRoutes);
app.use('/api/transactions', tranRoutes);
app.use('/api/revenue', revenueRoute);
app.use('/api/expenses', expenseRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/ai', aiRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/profile', profileRoutes);
app.use('/stripe', require('../routes/stripe'));
app.use('/crypto', cryptoRoutes);
app.use('/compteBancaire', compteBanciareRoutes);
app.use('/transactionsayf', transactionRoutesSaif);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
require('../services/scheduler');
