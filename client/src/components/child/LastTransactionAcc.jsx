import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

const LastTransactionAcc = ({ showActions = true, title = "Pending Approvals", setNotification }) => {
  const [approvals, setApprovals] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/approvals/approvals");
        setApprovals(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des approbations :", err);
      }
    };

    fetchApprovals();
  }, []);

  const approveRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/approvals/approve/${id}`);
      setApprovals((prev) => prev.filter((a) => a._id !== id));
      setNotification("Approval request has been approved."); // Notification ajoutée
    } catch (err) {
      console.error("Erreur lors de l'approbation :", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/approvals/reject/${id}`);
      setApprovals((prev) => prev.filter((a) => a._id !== id));
      setNotification("Approval request has been rejected."); // Notification ajoutée
    } catch (err) {
      console.error("Erreur lors du refus :", err);
    }
  };

  return (
    <div className="col-12">
      <div className="card h-100 shadow-lg">
        <div className="card-header border-bottom bg-base py-4 px-5 d-flex align-items-center justify-content-between">
          <h4 className="fw-bold mb-0">{title}</h4>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:text-primary-800 d-flex align-items-center gap-2 fs-5"
          >
            {showAll ? "View Less" : "View All"}
            <Icon icon="solar:alt-arrow-right-linear" className="fs-4" />
          </button>
        </div>
        <div className="card-body p-5 bg-gray-100">
          <div className="table-responsive scroll-sm">
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fs-5">Approval Type</th>
                  <th className="fs-5">Details</th>
                  <th className="fs-5">Status</th>
                  {showActions && <th className="fs-5">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {approvals.length > 0 ? (
                  approvals.slice(0, showAll ? approvals.length : 3).map((a) => (
                    <tr key={a._id} className="align-middle">
                      <td className="fs-6">{a.approvalType || "N/A"}</td>
                      <td className="fs-6">{a.details || "N/A"}</td>
                      <td>
                        {a.status ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                              a.status === "pending"
                                ? "bg-warning"
                                : a.status === "approved"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {a.status.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      {showActions && (
                        <td className="d-flex gap-3">
                          {a.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveRequest(a._id)}
                                className="btn btn-success btn-sm px-3 py-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectRequest(a._id)}
                                className="btn btn-danger btn-sm px-3 py-2"
                              >
                                Refuse
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showActions ? 4 : 3} className="text-center text-muted fs-5 py-4">
                      No pending requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastTransactionAcc;
