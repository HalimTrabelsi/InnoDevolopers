import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FaRobot } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AccessDeniedPage from "./pages/AccessDeniedPage.jsx";
import BusinessOwnerPage from "./pages/BuisnessOwnerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import FaceReconPage from "./pages/FaceRecoPage";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import UsersListPage from "./pages/UsersListPage.jsx";
import AddTransaction from "./components/transaction/AddTransaction";
import TransactionList from "./components/transaction/TransactionList";
import TradingRoute from "./components/crypto/trading";
import CompteBancaireTable from "./components/CompteBancaire/CompteBancaireTable";
import CryptoTable from "./components/crypto/CryptoTable";
import NewsRoute from "./components/News/News";
import AccountantDashboardPage from "./pages/AccountantDashboardPage.jsx";
import FinancialManagerPage from "./pages/FinancialManagerPage.jsx";
import VoiceCommand from "./components/Voccal/VoiceCommand";
import AuthCallback from "./pages/AuthCallbackPage.jsx";
import Confirmation from "./pages/ConfirmationLayer.jsx";
import CompleteProfile from "./pages/CompleteProfileLayer.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";

import ChatIaRoute from "./components/gemini-chatbot/GeminiChat";
import HomePageTen from "./pages/HomePageTen.jsx";
import HomePageTwenty from "./pages/HomePageTwenty.jsx";
import HomePageTransaction from "./pages/HomePageTransaction.jsx";
import HomePageViewTransaction from "./pages/HomePageViewTransaction.jsx";
import FinancialTrends from "./components/FinancialTrends.jsx";
import ChatBot from './components/chatbolt/ChatbotFinance.jsx';
import FinancialSimulation from "./components/FinancialSimulation.jsx";
import RevenueGrowthOne from "./components/child/RevenueGrowthOne.jsx";
function App() {
  const userId = "67ff6c1b6a739a45e0a45655";
  const [refresh, setRefresh] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleVoiceCommand = (command) => {
    console.log("Commande vocale reçue :", command);

    if (command.includes("accueil") || command.includes("page d'accueil")) {
      window.location.href = "/";
    } else if (command.includes("connexion")) {
      window.location.href = "/sign-in";
    } else if (command.includes("inscription")) {
      window.location.href = "/sign-up";
    } else if (command.includes("tableau de bord") && command.includes("admin")) {
      window.location.href = "/admin-dashboard";
    } else if (
      (command.includes("tableau de bord") && command.includes("business")) ||
      (command.includes("tableau de bord") && command.includes("propriétaire"))
    ) {
      window.location.href = "/business-owner-dashboard";
    } else if (
      command.includes("compte.") ||
      command.includes("comptes bancaires") ||
      command.includes("compte bancaire")
    ) {
      window.location.href = "/comptes-bancaires";
    } else if (command.includes("crypto")) {
      window.location.href = "/crypto";
    } else if (command.includes("transaction")) {
      window.location.href = "/transactions";
    } else if (command.includes("trading")) {
      window.location.href = "/trading";
    } else {
      console.log("Commande inconnue !");
    }
  };

  const toggleChatbot = () => setChatbotOpen(!chatbotOpen);

  return (
    <BrowserRouter>
      {/* Bouton Flottant pour ouvrir le chatbot */}
          <ChatIaRoute />

        <FaRobot />
   
        <ToastContainer />
      {/* Modal Chatbot avec Material UI */}
      
   

      {/* Composant de reconnaissance vocale */}
      <VoiceCommand onCommand={handleVoiceCommand} />

      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/face-recon" element={<FaceReconPage />} />
        <Route path="/sign-up/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/view-profile" element={<ViewProfilePage />} />
        <Route path="/view-users" element={<UsersListPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/crypto" element={<CryptoTable />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/trading" element={<TradingRoute />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route exact path='/index-11' element={<ExpensePage />} />
        <Route exact path='/invoice-preview' element={<InvoicePreviewPage />} />
        <Route path="/news" element={<NewsRoute />} />
        <Route path='/financialoverview' element={<HomePageTen />} />
        <Route path='/Calender' element={<HomePageTwenty />} />
        <Route path='/HealthTransaction' element={<HomePageTransaction />} />
        <Route path='/ViewTransaction' element={<HomePageViewTransaction />} />
        <Route path="/financial-trends" element={<FinancialTrends />} />
        <Route path="/financial-assistant" element={<ChatBot />} />
        <Route path="/financial-simulation" element={<FinancialSimulation />} />
        <Route path="/cash-flow" element={<RevenueGrowthOne/>} />

        <Route 
          path="/admin-dashboard"
          element={
              <AdminDashboardPage />
          }
        />
        <Route path="/business-owner-dashboard" element={<BusinessOwnerPage />} />
        <Route
          path="/Financial-manager-dashboard"
          element={
            <PrivateRoute allowedRoles={["Financial manager"]}>
              <FinancialManagerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/accountant-dashboard"
          element={
            <PrivateRoute allowedRoles={["Accountant"]}>
              <AccountantDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/comptes-bancaires"
          element={
            <CompteBancaireTable
              userId={userId}
              refresh={refresh}
              onRefresh={() => setRefresh(!refresh)}
            />
          }
        />
        <Route path="/news" element={<NewsRoute />} />
        <Route path="/ge" element={<ChatIaRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
