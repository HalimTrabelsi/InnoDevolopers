import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = new URLSearchParams(window.location.search).get("token") || localStorage.getItem('token');

  useEffect(() => {
    const verifyAccess = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/users/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRole = response.data.role; // Suppose que /dashboard renvoie le rôle
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole); // Stocker le rôle
        setIsAuthorized(allowedRoles.includes(userRole));
      } catch (error) {
        console.error("Erreur de vérification:", error);
        setIsAuthorized(false);
      }
    };
    verifyAccess();
  }, [token, allowedRoles]);

  if (isAuthorized === null) {
    return <div>Chargement...</div>; // État de chargement pendant la vérification
  }

  return isAuthorized ? children : <Navigate to="/access-denied" />;
};

export default PrivateRoute;