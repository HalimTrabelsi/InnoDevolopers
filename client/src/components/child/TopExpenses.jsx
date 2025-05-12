import React, { useEffect, useState } from "react";
import axios from "axios";
import { speak } from "../utils/textToSpeech"; // Adjust path if needed

const TopExpenses = () => {
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    const fetchTopExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5001/api/expenses/top-expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setTopExpenses(response.data.data);
        } else {
          setError("Failed to fetch top expenses.");
        }
      } catch (err) {
        setError("An error occurred while fetching top expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopExpenses();
  }, []);

  const handleReadDetailedExpenses = () => {
    const importantExpenses = topExpenses.filter((expense) => expense.amount >= 400);

    if (importantExpenses.length === 0) {
      speak("No important expenses recorded in the current period.");
      return;
    }

    const readText = importantExpenses
      .map((expense, index) => {
        const position = ["first", "second", "third", "fourth", "fifth"][index] || `${index + 1}th`;
        return `The ${position} most significant expense is in the category of ${expense.category}, amounting to ${expense.amount} dinars, recorded on ${new Date(
          expense.date
        ).toLocaleDateString()}.`;
      })
      .join(" ");

    speak(
      `Overview of the most important expenses for the current reporting period: ${readText} These are the key expenses that stand out.`
    );
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/expenses/add-expense",
        newExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setTopExpenses((prev) => [...prev, response.data.data]);
        setShowForm(false);
        setNewExpense({ category: "", amount: "", date: "" });
      }
    } catch (err) {
      setError("An error occurred while adding the expense.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="row justify-content-between mt-4">
      {/* Top Expenses Card */}
      <div className="col-xxl-6 col-lg-6 col-md-6 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light text-dark d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">📊 Top Expenses</h6>
          </div>
          <div className="card-body p-3">
            {loading ? (
              <div className="text-center text-muted">Loading expenses...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : topExpenses.length === 0 ? (
              <div className="text-muted text-center">No expenses available.</div>
            ) : (
              <ul className="list-group list-group-flush">
                {topExpenses
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((expense) => (
                    <li
                      key={expense._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="fw-bold">{expense.category}</span>
                      <span>{expense.amount.toFixed(2)} DT</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Expenses Card */}
      <div className="col-xxl-6 col-lg-6 col-md-6 mb-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header bg-light text-dark d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">📅 Detailed Expenses</h6>
            <div>
              <button
                className="btn btn-sm rounded-circle bg-light"
                onClick={handleReadDetailedExpenses}
                title="Read important expenses aloud"
                style={{ color: "#0d6efd", padding: "0.5rem", fontSize: "1.5rem" }}
              >
                🔊
              </button>
              <button
                className={`btn btn-sm ${showForm ? "btn-danger" : "btn-primary"} ms-2`}
                onClick={() => setShowForm(!showForm)}
                title={showForm ? "Cancel" : "Add Expense"}
                style={{ fontSize: "1.25rem", padding: "0.25rem 0.75rem" }}
              >
                {showForm ? "✖" : "＋"}
              </button>
            </div>
          </div>
          <div className="card-body p-3">
            {loading ? (
              <div className="text-center text-muted">Loading detailed expenses...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : topExpenses.length === 0 ? (
              <div className="text-muted text-center">No detailed expenses available.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40%" }}>Category</th>
                      <th style={{ width: "30%" }}>Amount (DT)</th>
                      <th style={{ width: "30%" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExpenses.map((expense) => (
                      <tr key={expense._id}>
                        <td>{expense.category}</td>
                        <td>{expense.amount.toFixed(2)}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Form Modal */}
      {showForm && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">💵 Add New Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddExpense}>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      className="form-control"
                      value={newExpense.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount (DT)</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      value={newExpense.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={newExpense.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Expense
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopExpenses;
