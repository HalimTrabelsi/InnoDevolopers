const Task = require('../models/task');

// Fonction pour convertir la priorité textuelle en score numérique
const convertPriorityToScore = (priority) => {
  const priorityMap = { Low: 1, Medium: 4, High: 7 };
  return priorityMap[priority] || 4;
};

// Fonction pour calculer une priorité ajustée
const calculateAdjustedPriority = (task) => {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysSinceDeadline = Math.ceil((now - deadline) / (1000 * 60 * 60 * 24)); // Jours depuis la deadline

  let basePriority = convertPriorityToScore(task.priority);
  if (daysSinceDeadline > 0) {
    basePriority += Math.min(3, Math.floor(daysSinceDeadline / 7)); // +1 par semaine de retard
  } else if (daysSinceDeadline >= -1) basePriority += 2;
  else if (daysSinceDeadline >= -3) basePriority += 1;

  return Math.min(basePriority, 10);
};

// Récupérer toutes les tâches priorisées
exports.getPrioritizedTasks = async (req, res) => {
  try {
    console.log('Utilisateur connecté:', req.user);
    const tasks = await Task.find().sort({ deadline: 1 }); // Pas de filtre userId

    if (!tasks.length) {
      console.log('Aucune tâche trouvée dans la base');
      return res.status(200).json([]);
    }

    const prioritizedTasks = tasks.map((task) => {
      const adjustedPriority = calculateAdjustedPriority(task);
      return { ...task._doc, adjustedPriority };
    });

    prioritizedTasks.sort((a, b) => b.adjustedPriority - a.adjustedPriority);

    console.log('Tâches renvoyées:', prioritizedTasks);
    res.status(200).json(prioritizedTasks);
  } catch (error) {
    console.error('Erreur dans getPrioritizedTasks:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
  }
};