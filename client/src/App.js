import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashBoardLayerOne from "./components/DashBoardLayerOne";
import ViewProfileLayer from "./components/ViewProfileLayer";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<HomePageOne />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={["Admin"]}><DashBoardLayerOne /> </PrivateRoute>}/>
        <Route path="/business-owner-dashboard"element={<PrivateRoute allowedRoles={["Business owner"]}><ViewProfileLayer /></PrivateRoute>}/>
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;