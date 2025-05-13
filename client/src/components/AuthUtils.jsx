// src/utils/authUtils.jsx
import { jwtDecode } from 'jwt-decode';

export function justeNom() {
  const token = localStorage.getItem('token'); // ou sessionStorage.getItem('token')

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.userId || decoded.sub || decoded.id; // adapte cette ligne à ton token
    return userId;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
}
