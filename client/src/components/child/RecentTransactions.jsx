import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTextsms } from "react-icons/md";

// --- Combined Function for Health Score and Late Payment Forecast ---
const analyzeClient = async (transactions) => {
  try {
    const response = await axios.post("http://localhost:5001/api/gemini/predict-late", {
      transactions,
    });
    return response.data;
  } catch (err) {
    console.error("Error analyzing client:", err);
    return null;
  }
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const [clientAnalysis, setClientAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/transactions/viewTransaction");
      if (response.status === 200) {
        setTransactions(response.data);
      }
    } catch (error) {
      setError("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSMS = async (transactionId) => {
    const transaction = transactions.find((t) => t._id === transactionId);
    if (!transaction) {
      alert("❌ Transaction not found.");
      return;
    }
    if (transaction.amount <= 600) {
      alert("⚠️ SMS not sent: Transaction amount must be greater than 600.");
      return;
    }
    try {
      await axios.post("http://localhost:5001/api/transactions/trigger-sms", {
        transactionId,
      });
      alert("🚀 SMS notification sent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("Invalid 'To' Phone Number")) {
        alert("❌ SMS failed: Invalid phone number format. Please check the user's phone number.");
      } else {
        alert("❌ Failed to send SMS: " + errorMessage);
      }
    }
  };

  const downloadReport = async (type) => {
    try {
      const url = `http://localhost:5001/api/export/generate-${type}`;
      const response = await axios.post(url, { transactions }, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `recent_transactions.${type === "excel" ? "xlsx" : "pdf"}`;
      link.click();
      alert(`✅ ${type.toUpperCase()} file downloaded successfully.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase() + ": " + (error.response?.data?.message || error.message));
    }
  };

  // --- Client Analysis Handler ---
  const handleClientAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const analysis = await analyzeClient(transactions);
      setClientAnalysis(analysis);
    } catch (err) {
      console.error("Error analyzing client:", err);
      alert("❌ Error analyzing client: " + (err.response?.data?.message || err.message));
    } finally {
      setAnalysisLoading(false);
    }
  };

  const paginateTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-lg mb-0">Recent Transactions</h6>
          <div>
            <button className="btn btn-outline-success me-2" onClick={() => downloadReport("excel")}>
              Export Excel
            </button>
            <button className="btn btn-outline-danger" onClick={() => downloadReport("pdf")}>
              Export PDF
            </button>
          </div>
        </div>

        <div className="card-body p-3">
          {/* Client Analysis Section */}
          <div className="mb-4">
            <label className="form-label">Client Analysis:</label>
            <div>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={handleClientAnalysis}
                disabled={analysisLoading}
                style={{ fontSize: "14px" }}
              >
                {analysisLoading ? "Analyzing..." : "Analyze Client"}
              </button>
            </div>
            {clientAnalysis && (
              <div
                className={`alert ${
                  clientAnalysis.willMissNextInvoice ? "alert-danger" : "alert-success"
                } mt-2`}
              >
                <strong>Prediction:</strong>{" "}
                {clientAnalysis.willMissNextInvoice
                  ? "❌ Likely to miss next invoice"
                  : "✅ Likely to pay on time"}{" "}
                <br />
                <strong>Confidence:</strong> {clientAnalysis.confidenceScore}/100 <br />
                <strong>Reason:</strong> {clientAnalysis.reason} <br />
                <strong>Health Score:</strong> {clientAnalysis.healthScore}/100
              </div>
            )}
          </div>

          {/* Transactions Table */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount (TND)</th>
                    <th>Bank Account</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginateTransactions().length > 0 ? (
                    paginateTransactions().map((transaction, index) => (
                      <tr key={index}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.amount || "N/A"}</td>
                        <td>{transaction.compteBancaire || "N/A"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-warning d-flex justify-content-center align-items-center mx-auto"
                            onClick={() => handleTriggerSMS(transaction._id)}
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                          >
                            <MdTextsms size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
