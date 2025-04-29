const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notificationController");
const {
  createApproval,
  fetchApprovals,
  approveRequest,
  rejectRequest,
} = require("../controllers/approvalController");

console.log("getNotifications:", getNotifications); // Vérifiez si c'est défini

router.post("/create", createApproval);
router.get("/approvals", fetchApprovals);
router.put("/approve/:id", approveRequest);
router.put("/reject/:id", rejectRequest);
router.get("/notifications", getNotifications);

module.exports = router;