import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AccessDeniedPage from "./pages/AccessDeniedPage.jsx"; // Ensure this page exists
import BusinessOwnerPage from "./pages/BuisnessOwnerPage.jsx"; // Ensure this page exists
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
<<<<<<< HEAD
<<<<<<< HEAD
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import UsersListPage from "./pages/UsersListPage.jsx";
import HomePageTen from "./pages/HomePageTen.jsx";
=======
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
import FaceReconPage from "./pages/FaceRecoPage.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import UsersListPage from "./pages/UsersListPage.jsx";

<<<<<<< HEAD
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
<<<<<<< HEAD
        <Route exact path='/' element={<AccessDeniedPage />} />
=======
        <Route exact path='/' element={<SignInPage />} />
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
        <Route exact path='/' element={<SignInPage />} />
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/reset-password/:token' element={<ResetPasswordPage />} />
<<<<<<< HEAD
<<<<<<< HEAD
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
        <Route exact path='/view-users' element={<UsersListPage />} />
        <Route exact path='/balance' element={<HomePageTen />} />

=======
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
        <Route exact path='/face-recon' element={<FaceReconPage />} />
        <Route exact path='/sign-up/terms-conditions' element={<TermsAndConditions />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
        <Route exact path='/view-users' element={<UsersListPage />} />
<<<<<<< HEAD
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
=======
>>>>>>> b8a57cc2b08589c97fc2a0e3532a0cb6b33920fd
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
