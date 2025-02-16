import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage"; // Ensure this import is correct

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<HomePageOne />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} /> {/* Ensure this route is correct */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;