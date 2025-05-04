const Task = require('../models/task');

// Liste de mots-clés liés aux tâches pour limiter le contexte
const taskRelatedKeywords = [
  'task', 'tâche', 'due', 'deadline', 'échéance', 'priority', 'priorité',
  'tomorrow', 'demain', 'today', 'aujourd’hui', 'complete', 'terminer',
  'mark', 'marquer', 'list', 'liste', 'pending', 'en attente', 'show', 'display',
  'what', 'quelles', 'which', 'when', 'quand', 'how many', 'combien', 'high', 'low',
  'medium', 'élevée', 'basse', 'moyenne', 'overdue', 'en retard', 'identify', 'identifier'
];

// Vérifier si la requête est liée aux tâches
const isTaskRelatedQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  return taskRelatedKeywords.some(keyword => lowerQuery.includes(keyword));
};

// Extraire une période de temps (ex. : "tomorrow", "today")
const extractDateFilter = (query) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('tomorrow') || lowerQuery.includes('demain')) return 'tomorrow';
  if (lowerQuery.includes('today') || lowerQuery.includes('aujourd’hui')) return 'today';
  if (lowerQuery.includes('overdue') || lowerQuery.includes('en retard') || lowerQuery.includes('en attente') || lowerQuery.includes('pending')) return 'overdue';
  return null;
};

// Vérifier si la requête demande une liste
const isListRequest = (query) => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes('list') || lowerQuery.includes('liste') || 
         lowerQuery.includes('show') || lowerQuery.includes('display') ||
         lowerQuery.includes('what') || lowerQuery.includes('quelles') ||
         lowerQuery.includes('which') || lowerQuery.includes('identify') || lowerQuery.includes('identifier');
};

// Vérifier si la requête concerne la priorisation
const isPrioritizationRequest = (query) => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes('how to prioritize') || lowerQuery.includes('comment prioriser') ||
         lowerQuery.includes('priority') || lowerQuery.includes('priorité');
};

// Vérifier si la requête demande une action (ex. : marquer comme terminée)
const isActionRequest = (query) => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes('mark') || lowerQuery.includes('marquer') ||
         lowerQuery.includes('complete') || lowerQuery.includes('terminer');
};

// Vérifier si la requête demande des tâches par priorité
const extractPriorityFilter = (query) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('high') || lowerQuery.includes('élevée')) return 'High';
  if (lowerQuery.includes('medium') || lowerQuery.includes('moyenne')) return 'Medium';
  if (lowerQuery.includes('low') || lowerQuery.includes('basse')) return 'Low';
  return null;
};

// Vérifier si la requête demande un comptage
const isCountRequest = (query) => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes('how many') || lowerQuery.includes('combien');
};

// Vérifier si la réponse est une confirmation (ex. : "oui")
const isConfirmation = (query) => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery === 'yes' || lowerQuery === 'oui' || lowerQuery === 'ok' || lowerQuery === 'daccord';
};

exports.handleAIAssist = async (req, res) => {
  const { query } = req.body;
  const chatHistory = req.body.chatHistory || []; // Ajouter un historique pour le contexte

  if (!query) {
    return res.status(400).json({ response: 'Veuillez fournir une question ou une commande.' });
  }

  // Vérifier si la requête est liée aux tâches
  if (!isTaskRelatedQuery(query)) {
    return res.status(400).json({ response: 'Désolé, je peux seulement répondre aux questions liées aux tâches.' });
  }

  try {
    const tasks = await Task.find();
    let response = '';

    const dateFilter = extractDateFilter(query);
    const priorityFilter = extractPriorityFilter(query);
    const lastQuery = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].text.toLowerCase() : '';

    // Cas 1 : Demande de tâches avec une date spécifique (ex. : "due tomorrow", "due today", "overdue tasks")
    if (dateFilter && (query.toLowerCase().includes('due') || query.toLowerCase().includes('échéance') || isListRequest(query))) {
      let dueTasks = [];
      if (dateFilter === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueTasks = tasks.filter(t => {
          const deadline = new Date(t.deadline);
          return deadline.toDateString() === tomorrow.toDateString();
        });
        response = dueTasks.length 
          ? `Tâches dues demain : ${dueTasks.map(t => t.title).join(', ')}.`
          : 'Aucune tâche due demain.';
      } else if (dateFilter === 'today') {
        const today = new Date();
        dueTasks = tasks.filter(t => {
          const deadline = new Date(t.deadline);
          return deadline.toDateString() === today.toDateString();
        });
        response = dueTasks.length 
          ? `Tâches dues aujourd'hui : ${dueTasks.map(t => t.title).join(', ')}.`
          : "Aucune tâche due aujourd'hui.";
      } else if (dateFilter === 'overdue') {
        const today = new Date();
        dueTasks = tasks.filter(t => new Date(t.deadline) < today);
        response = dueTasks.length 
          ? `Tâches en retard : ${dueTasks.map(t => t.title).join(', ')}.`
          : 'Aucune tâche en retard.';
      }
    }
    // Cas 2 : Demande de tâches par priorité (ex. : "show high priority tasks")
    else if (priorityFilter && isListRequest(query)) {
      const priorityTasks = tasks.filter(t => t.priority === priorityFilter);
      response = priorityTasks.length
        ? `Tâches de priorité ${priorityFilter.toLowerCase()} : ${priorityTasks.map(t => t.title).join(', ')}.`
        : `Aucune tâche de priorité ${priorityFilter.toLowerCase()}.`;
    }
    // Cas 3 : Demande de comptage (ex. : "how many tasks are due today?")
    else if (isCountRequest(query)) {
      if (dateFilter) {
        let dueTasks = [];
        if (dateFilter === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          dueTasks = tasks.filter(t => {
            const deadline = new Date(t.deadline);
            return deadline.toDateString() === tomorrow.toDateString();
          });
        } else if (dateFilter === 'today') {
          const today = new Date();
          dueTasks = tasks.filter(t => {
            const deadline = new Date(t.deadline);
            return deadline.toDateString() === today.toDateString();
          });
        } else if (dateFilter === 'overdue') {
          const today = new Date();
          dueTasks = tasks.filter(t => new Date(t.deadline) < today);
        }
        response = dueTasks.length 
          ? `Il y a ${dueTasks.length} tâche${dueTasks.length > 1 ? 's' : ''} ${dateFilter === 'tomorrow' ? 'dues demain' : dateFilter === 'today' ? "dues aujourd'hui" : 'en retard'}.`
          : `Aucune tâche ${dateFilter === 'tomorrow' ? 'due demain' : dateFilter === 'today' ? "due aujourd'hui" : 'en retard'}.`;
      } else if (priorityFilter) {
        const priorityTasks = tasks.filter(t => t.priority === priorityFilter);
        response = priorityTasks.length
          ? `Il y a ${priorityTasks.length} tâche${priorityTasks.length > 1 ? 's' : ''} de priorité ${priorityFilter.toLowerCase()}.`
          : `Aucune tâche de priorité ${priorityFilter.toLowerCase()}.`;
      } else {
        response = `Il y a ${tasks.length} tâche${tasks.length !== 1 ? 's' : ''} au total.`;
      }
    }
    // Cas 4 : Demande de liste des tâches (ex. : "list tasks", "identify pending tasks")
    else if (isListRequest(query)) {
      response = tasks.length 
        ? `Voici vos tâches : ${tasks.map(t => t.title).join(', ')}.`
        : 'Aucune tâche trouvée.';
    }
    // Cas 5 : Demande de conseil sur la priorisation (ex. : "how to prioritize")
    else if (isPrioritizationRequest(query)) {
      const highPriorityTasks = tasks.filter(t => t.priority === 'High');
      response = highPriorityTasks.length
        ? 'Pour prioriser vos tâches, je vous recommande de vous concentrer sur celles qui ont une priorité élevée. Voici vos tâches de haute priorité : ' +
          highPriorityTasks.map(t => t.title).join(', ') + '.'
        : 'Vous n’avez aucune tâche de haute priorité. Essayez de vous concentrer sur les tâches avec des échéances proches.';
    }
    // Cas 6 : Demande d’action (ex. : "mark task as completed") avec suivi
    else if (isActionRequest(query)) {
      if (lastQuery.includes('mark') || lastQuery.includes('marquer') || lastQuery.includes('complete') || lastQuery.includes('terminer')) {
        if (isConfirmation(query)) {
          const pendingTasks = tasks.filter(t => !t.completed); // Supposons un champ 'completed'
          response = pendingTasks.length
            ? `Voici les tâches en attente : ${pendingTasks.map(t => t.title).join(', ')}.`
            : 'Aucune tâche en attente.';
        } else {
          response = 'Je ne peux pas encore marquer les tâches comme terminées, mais je peux vous aider à identifier les tâches en attente. Voulez-vous voir la liste ? (Répondez "oui" ou "non")';
        }
      }
    }
    // Cas par défaut : Message d’aide
    else {
      response = 'Je peux aider avec des questions sur les tâches. Essayez de demander "Quelles tâches sont dues demain ?" ou "Liste mes tâches".';
    }

    res.json({ response });
  } catch (error) {
    console.error('Erreur dans handleAIAssist:', error);
    res.status(500).json({ response: '❌ Unable to process your request.' });
  }
};