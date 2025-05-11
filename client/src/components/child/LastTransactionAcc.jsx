import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

const LastTransactionAcc = ({ showActions = true, title = "Pending Approvals", setNotification }) => {
  const [approvals, setApprovals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      setNotification("Approval request has been approved.");
    } catch (err) {
      console.error("Erreur lors de l'approbation :", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/approvals/reject/${id}`);
      setApprovals((prev) => prev.filter((a) => a._id !== id));
      setNotification("Approval request has been rejected.");
    } catch (err) {
      console.error("Erreur lors du refus :", err);
    }
  };

  const totalPages = Math.ceil(approvals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApprovals = approvals.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="col-lg-12">
      <div className="card shadow-none border bg-gradient-start-5 h-100">
        <div className="card-body p-20">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="fw-medium text-primary-light mb-1">{title}</p>
            </div>
            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
              <Icon icon="solar:checklist-bold" className="text-white text-2xl mb-0" />
            </div>
          </div>
          <div className="table-responsive mt-12">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col" className="fs-5">Approval Type</th>
                  <th scope="col" className="fs-5">Details</th>
                  <th scope="col" className="fs-5 text-center">Status</th>
                  {showActions && <th scope="col" className="fs-5">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentApprovals.length > 0 ? (
                  currentApprovals.map((a) => (
                    <tr key={a._id} className="align-middle">
                      <td className="text-lg text-secondary-light fw-semibold">{a.approvalType || "N/A"}</td>
                      <td className="text-lg text-secondary-light fw-semibold">{a.details || "N/A"}</td>
                      <td className="text-center">
                        {a.status ? (
                          <span
                            className={`bg-${a.status === "pending" ? "warning" : a.status === "approved" ? "success" : "secondary"}-focus text-${a.status === "pending" ? "warning" : a.status === "approved" ? "success" : "secondary"}-main px-24 py-4 rounded-pill fw-medium text-sm`}
                          >
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
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
          {approvals.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="btn btn-primary me-2"
              >
                Previous
              </button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="btn btn-primary ms-2"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastTransactionAcc;