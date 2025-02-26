import React from "react";
import SignInLayer from "../components/SignInLayer";
import ThemeToggleButton from "../helper/ThemeToggleButton";
const SignInPage = () => {
  return (
    <>
      <ThemeToggleButton/>
      {/* SignInLayer */}
      <SignInLayer />

    </>
  );
};

export default SignInPage; 
