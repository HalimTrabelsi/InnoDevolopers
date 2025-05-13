const Approval = require("../models/PendingApproval");
const { sendApprovalEmail } = require("../config/email");
const cron = require("node-cron");
const notificationService = require("../services/notificationService");

exports.createApproval = async (req, res) => {
  try {
    const { userEmail, approvalType, details } = req.body;
    const newApproval = new Approval({ userEmail, approvalType, details });
    await newApproval.save();

    // Ajouter une notification dans le service
    const notificationMessage = `New approval request received from ${userEmail}.`;
    notificationService.addNotification(notificationMessage);

    // Émettre un événement Socket.IO pour la création
    const io = req.app.get("io");
    io.emit("newApproval", notificationMessage); // Pour MasterLayout et AccountantDashboard

    await sendApprovalEmail(
      userEmail,
      userEmail,
      "Votre demande a été reçue",
      "Demande enregistrée avec succès",
      `Bonjour,<br><br>Nous avons bien reçu votre demande d'approbation de type <strong>${approvalType}</strong>.<br><br>Détails fournis : ${details}<br><br>Notre équipe étudiera votre demande dans les plus brefs délais.`,
      "https://monapp.com/approvals",
      "Voir ma demande"
    );

    await sendApprovalEmail(
      userEmail,
      "ouday.oueslati@esprit.tn",
      "Nouvelle demande reçue",
      "Demande d'approbation en attente",
      `Une nouvelle demande de type <strong>${approvalType}</strong> a été soumise par <strong>${userEmail}</strong>.<br><br>Détails : ${details}`,
      "https://monapp.com/admin/approvals",
      "Consulter les demandes"
    );

    const task = cron.schedule("* * * * *", async () => {
      const pendingCount = await Approval.countDocuments({ status: "pending" });

      if (pendingCount >= 0) {
        await sendApprovalEmail(
          "noreply@approauto.com",
          "ouday.oueslati@esprit.tn",
          "Rappel : demandes en attente",
          "Notification de suivi",
          `Il y a actuellement <strong>${pendingCount}</strong> demande(s) d'approbation toujours en attente de traitement.`,
          "https://monapp.com/admin/approvals",
          "Traiter les demandes"
        );
      }

      if (pendingCount === 0) {
        task.stop();
      }
    });

    res.status(201).json({ message: "Demande créée et emails envoyés." });
  } catch (error) {
    console.error("❌ Erreur lors de la création de la demande :", error);
    res.status(500).json({ error: "Erreur lors de la création de la demande." });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = await Approval.findById(id);
    if (!approval) return res.status(404).json({ error: "Demande non trouvée." });

    approval.status = "approved";
    await approval.save();

    // Ajouter une notification dans le service
    const notificationMessage = `Approval request from ${approval.userEmail} has been approved.`;
    notificationService.addNotification(notificationMessage);

    // Émettre un événement Socket.IO pour l'approbation
    const io = req.app.get("io");
    io.emit("approvalStatus", notificationMessage); // Pour MasterLayout et FinancialMangerLayer

    await sendApprovalEmail(
      "noreply@approauto.com",
      approval.userEmail,
      "Demande approuvée",
      "Votre demande a été approuvée ✅",
      `Bonjour,<br><br>Votre demande d'approbation de type <strong>${approval.approvalType}</strong> a été approuvée avec succès.<br><br>Merci pour votre patience.`,
      "https://monapp.com/approvals",
      "Voir ma demande"
    );

    res.status(200).json({ message: "Demande approuvée et email envoyé." });
  } catch (error) {
    console.error("Erreur lors de l'approbation :", error);
    res.status(500).json({ error: "Erreur lors de l'approbation de la demande." });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = await Approval.findById(id);
    if (!approval) return res.status(404).json({ error: "Demande non trouvée." });

    approval.status = "rejected";
    await approval.save();

    // Ajouter une notification dans le service
    const notificationMessage = `Approval request from ${approval.userEmail} has been rejected.`;
    notificationService.addNotification(notificationMessage);

    // Émettre un événement Socket.IO pour le refus
    const io = req.app.get("io");
    io.emit("approvalStatus", notificationMessage); // Pour MasterLayout et FinancialMangerLayer

    await sendApprovalEmail(
      "noreply@approauto.com",
      approval.userEmail,
      "Demande refusée",
      "Votre demande a été refusée ❌",
      `Bonjour,<br><br>Nous sommes au regret de vous informer que votre demande d'approbation de type <strong>${approval.approvalType}</strong> a été refusée.<br><br>Merci pour votre compréhension.`,
      "https://monapp.com/approvals",
      "Voir ma demande"
    );

    res.status(200).json({ message: "Demande refusée et email envoyé." });
  } catch (error) {
    console.error("Erreur lors du refus :", error);
    res.status(500).json({ error: "Erreur lors du refus de la demande." });
  }
};

exports.fetchApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({});
    res.status(200).json(approvals);
  } catch (error) {
    console.error("Erreur lors de la récupération des approbations :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des approbations." });
  }
};