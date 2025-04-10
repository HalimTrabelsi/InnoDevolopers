
let notifications = [];

const addNotification = (message) => {
  notifications.push(message);
};

const getNotifications = () => {
  return notifications.slice(-5); 
};

const getAllNotifications = () => {
  return notifications;
};

const clearNotifications = () => {
  notifications = [];
};

module.exports = { addNotification, getNotifications, getAllNotifications, clearNotifications };
