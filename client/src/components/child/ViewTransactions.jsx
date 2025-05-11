import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const paginateTransactions = () => {
    const start = (currentPage - 1) * transactionsPerPage;
    return transactions.slice(start, start + transactionsPerPage);
  };

  const chartData = {
    labels: transactions.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: "Transaction Amount (TND)",
        data: transactions.map((t) => t.amount),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#007bff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container-fluid px-4 mt-5">
      {/* Chart Section */}
      <div className="card w-100 mb-4 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="fw-bold text-center mb-0">📊 Transaction Amount Over Time</h5>
        </div>
        <div className="card-body" style={{ height: "300px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="card w-100 mb-4 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="fw-bold text-center mb-0">📅 Timeline View</h5>
        </div>
        <div className="card-body overflow-auto d-flex gap-4" style={{ whiteSpace: "nowrap" }}>
          {transactions.map((t, idx) => (
            <div
              key={idx}
              className="border p-3 rounded shadow-sm text-center bg-light"
              style={{
                minWidth: "160px",
                borderLeft: "5px solid #007bff",
              }}
            >
              <div className="fw-bold">{new Date(t.date).toLocaleDateString()}</div>
              <div className="text-muted" style={{ fontSize: "0.9rem" }}>{t.type}</div>
              <div className="fw-bold text-primary">{t.amount} TND</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="card w-100 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="fw-bold text-center mb-0">📋 Transaction Table</h5>
        </div>
        <div className="card-body p-3">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount (TND)</th>
                    <th>Bank Account</th>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <ul className="pagination mb-0">
                  {[...Array(Math.ceil(transactions.length / transactionsPerPage))].map((_, i) => (
                    <li
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      key={i}
                    >
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

export default ViewTransactions;
