import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute";
import AccessDeniedPage from "./pages/AccessDeniedPage"; 
import BusinessOwnerPage from "./pages/BuisnessOwnerPage.jsx"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CompleteProfile from "./pages/CompleteProfileLayer.jsx";
import Confirmation from "./pages/ConfirmationLayer.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import StatPage from "./pages/StatPage.jsx";
import VerifyEmail from "./pages/VerifyEmailPage.jsx"; // Ajouter ce composant

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<SignInPage />} /> {/* Changement de la racine vers SignIn */}
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route exact path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/deleteUsers" element={<AdminPanel/>} />
        <Route path="/StatUsers" element={<StatPage/>} />
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Nouvelle route */}

        {/* Private Routes for role-based access */}
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/business-owner-dashboard" 
          element={
            <PrivateRoute allowedRoles={["Business owner"]}>
              <BusinessOwnerPage />
            </PrivateRoute>
          } 
        />
        
        {/* Fallback route for unauthorized access */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;