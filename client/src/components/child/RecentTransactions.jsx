import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTextsms } from "react-icons/md";

// Function to handle GPT query
const askGPT = async (query, transactions) => {
  try {
    const response = await axios.post("http://localhost:5001/api/gpt/ask", {
      query,
      transactions,
    });
    return response.data.answer;
  } catch (err) {
    console.error("Error fetching GPT response:", err);
    return "❌ Error fetching GPT response.";
  }
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const [gptQuery, setGptQuery] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [gptLoading, setGptLoading] = useState(false);

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

      alert(`✅ ${type.toUpperCase()} file downloaded.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase() + ": " + (error.response?.data?.message || error.message));
    }
  };

  const handleAskGPT = async () => {
    setGptLoading(true);
    const answer = await askGPT(gptQuery, transactions);
    setGptResponse(answer);
    setGptLoading(false);
  // ===== Download CSV =====
  const downloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("❌ No transactions to export.");
      return;
    }

    const headers = ["Date", "Category", "Amount (TND)", "Bank Account"];
    const csvRows = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          t.type,
          t.amount,
          t.compteBancaire || "N/A",
        ].join(",")
      ),
    ];

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recent_transactions.csv";
    link.click();
  };

  // ===== Client Payment Prediction (Gemini AI) =====
  const handleClientAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/gemini/predict-late", {
        transactions,
      });
      setAnalysis(response.data);
    } catch (error) {
      alert("❌ Failed to analyze client.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ===== Ask Gemini AI Query =====
  const handleAskGemini = async () => {
    if (!query.trim()) return;
    setQueryLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/gemini/ask", {
        query,
        transactions,
      });
      setQueryResponse(response.data.answer || "No response.");
    } catch (error) {
      setQueryResponse("❌ Gemini query failed.");
    } finally {
      setQueryLoading(false);
    }
  };

  // ===== Pagination Logic =====
  const paginateTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // ===== Transaction Stats =====
  const totalAmount = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const averageAmount =
    transactions.length > 0 ? (totalAmount / transactions.length).toFixed(2) : 0;
  const transactionCount = transactions.length;

  // ===== Chart Data (Optional Section) =====
  const chartData = {
    labels: transactions.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: "Transaction Amount (TND)",
        data: transactions.map((t) => t.amount || 0),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  // ===== Render UI =====
  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        {/* Header & Actions */}
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

        {/* Body */}
        <div className="card-body p-3">
          {/* GPT Query Section */}
          <div className="mb-3">
            <label className="form-label">Ask GPT:</label>
            <div className="input-group">

          {/* Stats Summary */}
          <div className="mb-4">
            <div className="alert alert-info">
              <strong>📊 Transaction Stats:</strong><br />
              Total Transactions: {transactionCount} <br />
              Total Amount: {totalAmount.toFixed(2)} TND <br />
              Average Amount: {averageAmount} TND
            </div>
          </div>

          {/* Prediction Result */}
          {analysis && (
            <div
              className={`alert ${
                analysis.willMissNextInvoice ? "alert-danger" : "alert-success"
              } mb-4`}
            >
              <strong>Prediction:</strong>{" "}
              {analysis.willMissNextInvoice
                ? "❌ Likely to miss next invoice"
                : "✅ Likely to pay on time"}<br />
              <strong>Confidence:</strong> {analysis.confidenceScore}/100<br />
              <strong>Reason:</strong> {analysis.reason}<br />
              {analysis.healthScore !== undefined && (
                <>
                  <strong>Health Score:</strong> {analysis.healthScore}/100
                </>
              )}
            </div>
          )}

          {/* Ask Gemini AI Section */}
          <div className="mb-4">
            <label className="form-label">Ask Gemini (AI):</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. How much did I spend on food?"
                value={gptQuery}
                onChange={(e) => setGptQuery(e.target.value)}
                style={{ fontSize: "14px" }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAskGPT}
                disabled={gptLoading}
                style={{ fontSize: "14px" }}
              >
                {gptLoading ? "Asking..." : "Ask GPT"}
                className="btn"
                style={{ backgroundColor: "#4893D7", color: "white" }}
                onClick={handleAskGemini}
                disabled={queryLoading}
              >
                {queryLoading ? "Asking..." : "Ask"}
              </button>
            </div>
            {gptResponse && (
              <div className="mt-2 alert alert-info">
                <strong>GPT Answer:</strong> {gptResponse}
              </div>
            )}
          </div>

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
                <ul className="pagination">
                  {[...Array(Math.ceil(transactions.length / transactionsPerPage))].map((_, i) => (
                    <li className="page-item" key={i}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
