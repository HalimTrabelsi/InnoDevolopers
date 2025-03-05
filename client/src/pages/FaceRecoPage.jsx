import React, { useEffect, useState } from "react";
import FaceRecon from "../components/FaceRecon";

const FaceReconPage = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        console.log("Decoded token:", decoded);

        if (decoded.email) {
          setUserEmail(decoded.email);
          console.log("User email set:", decoded.email);
        } else {
          console.error("Email not found in decoded token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <>
      {userEmail ? (
        <FaceRecon userEmail={userEmail} />
      ) : (
        <p>User not authenticated. Please log in again.</p>
      )}
    </>
  );
};

export default FaceReconPage;
