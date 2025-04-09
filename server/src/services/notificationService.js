// services/notificationService.js
let notifications = [];

// Ajouter une nouvelle notification
const addNotification = (message) => {
  notifications.push(message);
};

// Récupérer les 5 dernières notifications
const getNotifications = () => {
  return notifications.slice(-5); // Retourne les 5 dernières notifications
};

// Récupérer toutes les notifications
const getAllNotifications = () => {
  return notifications;
};

// Effacer toutes les notifications
const clearNotifications = () => {
  notifications = [];
};

module.exports = { addNotification, getNotifications, getAllNotifications, clearNotifications };
