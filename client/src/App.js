import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-recognition";
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
import StripeRoute from "./components/stripe/PaymentFromExpress";
import TradingRoute from "./components/crypto/trading";
import CompteBancaireForm from "./components/CompteBancaire/CompteBancaireForm";
import CompteBancaireTable from "./components/CompteBancaire/CompteBancaireTable";
import CryptoTable from "./components/crypto/CryptoTable";
import NewsRoute from "./components/News/News";
import ChatboltRoute from "./chatbolt/ChatbotFinance"

function App() {
  const userId = "67cc34299384fa66108bb394";
  const [refresh, setRefresh] = useState(false);

  // Configuration de la reconnaissance vocale
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      handleVoiceCommand(transcript.toLowerCase());
      resetTranscript();
    }
  }, [transcript, listening, resetTranscript]);

  // Fonction de traitement des commandes vocales
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/face-recon' element={<FaceReconPage />} />
        <Route path='/sign-up/terms-conditions' element={<TermsAndConditions />} />
        <Route path='/view-profile' element={<ViewProfilePage />} />
        <Route path='/view-users' element={<UsersListPage />} />
        <Route path='/access-denied' element={<AccessDeniedPage />} />
        <Route path='/crypto' element={<CryptoTable />} />
        <Route path='/add-transaction' element={<AddTransaction />} />
        <Route path='/transactions' element={<TransactionList />} />
        <Route path='/trading' element={<TradingRoute />} />
        <Route path="/chatbot" element={<ChatboltRoute />} />

        {/* Private Routes for role-based access */}
        <Route 
          path='/admin-dashboard' 
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/business-owner-dashboard' 
          element={
            
              <BusinessOwnerPage />
         
          } 
        />
        <Route
          path='/comptes-bancaires'
          element={
            <div>
              <CompteBancaireTable 
                userId={userId} 
                refresh={refresh} 
                onRefresh={() => setRefresh(!refresh)} 
              />
            </div>
          }
        />
                  <Route path="/news" element={<NewsRoute />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
