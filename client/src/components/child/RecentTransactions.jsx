import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTextsms } from "react-icons/md";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [queryResponse, setQueryResponse] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/transactions/viewTransaction");
      setTransactions(response.data || []);
    } catch (err) {
      setError("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSMS = async (transactionId) => {
    const transaction = transactions.find((t) => t._id === transactionId);
    if (!transaction || transaction.amount <= 600) {
      alert("⚠️ Transaction must exist and exceed 600 TND.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/transactions/trigger-sms", { transactionId });
      alert("🚀 SMS notification sent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`❌ SMS Failed: ${errorMessage}`);
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
      alert(`✅ ${type.toUpperCase()} file downloaded.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase());
    }
  };

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

  const paginateTransactions = () => {
    const start = (currentPage - 1) * transactionsPerPage;
    return transactions.slice(start, start + transactionsPerPage);
  };

  const totalAmount = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const averageAmount = transactions.length > 0 ? (totalAmount / transactions.length).toFixed(2) : 0;
  const transactionCount = transactions.length;

  // Prepare chart data
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

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-lg mb-0">Recent Transactions</h6>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={downloadCSV}>
              Export CSV
            </button>
            <button className="btn btn-outline-success me-2" onClick={() => downloadReport("excel")}>
              Export Excel
            </button>
            <button className="btn btn-outline-danger me-2" onClick={() => downloadReport("pdf")}>
              Export PDF
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={handleClientAnalysis}
              disabled={analysisLoading}
            >
              {analysisLoading ? "Analyzing..." : "Analyze Client"}
            </button>
          </div>
        </div>

        <div className="card-body p-3">
          {/* Transaction Stats */}
          <div className="mb-4">
            <div className="alert alert-info">
              <strong>📊 Transaction Stats:</strong><br />
              Total Transactions: {transactionCount} <br />
              Total Amount: {totalAmount.toFixed(2)} TND <br />
              Average Amount: {averageAmount} TND
            </div>
          </div>

          {/* Small Line Chart */}
          <div className="mb-4" style={{ maxWidth: "400px", margin: "auto" }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={350} />
          </div>

          {/* Analysis Section */}
          <div className="mb-4">
            {analysis && (
              <div
                className={`alert ${
                  analysis.willMissNextInvoice ? "alert-danger" : "alert-success"
                } mt-2`}
              >
                <strong>Prediction:</strong>{" "}
                {analysis.willMissNextInvoice
                  ? "❌ Likely to miss next invoice"
                  : "✅ Likely to pay on time"}
                <br />
                <strong>Confidence:</strong> {analysis.confidenceScore}/100
                <br />
                <strong>Reason:</strong> {analysis.reason}
                {analysis.healthScore !== undefined && (
                  <>
                    <br />
                    <strong>Health Score:</strong> {analysis.healthScore}/100
                  </>
                )}
              </div>
            )}
          </div>

          {/* Ask Gemini */}
          <div className="mb-4">
            <label className="form-label">Ask Gemini (AI):</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="e.g. What's my highest spending category?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-info" onClick={handleAskGemini} disabled={queryLoading}>
                {queryLoading ? "Asking..." : "Ask"}
              </button>
            </div>
            {queryResponse && (
              <div className="alert alert-secondary mt-2" style={{ whiteSpace: "pre-line" }}>
                {queryResponse}
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
                <ul className="pagination">
                  {[...Array(Math.ceil(transactions.length / transactionsPerPage))].map((_, i) => (
                    <li className="page-item" key={i}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
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
