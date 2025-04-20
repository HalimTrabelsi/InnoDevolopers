<<<<<<< Updated upstream
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    try {
      const response = await axios.post("http://localhost:5001/api/transactions/trigger-sms", {
        transactionId,
      });

      alert("🚀 SMS notification sent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes("Transaction does not meet the SMS criteria")) {
        alert("⚠️ SMS not sent: Transaction amount is below the required criteria.");
      } else if (errorMessage.includes("Invalid 'To' Phone Number")) {
        alert("❌ SMS failed: Invalid phone number format. Please check the user's phone number.");
      } else {
        alert("❌ Failed to send SMS: " + errorMessage);
      }

      console.error("Error triggering SMS:", errorMessage);
    }
  };

  const downloadReport = async (type) => {
    try {
      const url = `http://localhost:5001/api/export/generate-${type}`;
      const response = await axios.post(
        url,
        { transactions },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `recent_transactions.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();

      alert(`✅ ${type.toUpperCase()} file downloaded successfully.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase() + ": " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-lg mb-0 text-center w-100">Recent Transactions</h6>
          <div className="d-flex">
            <button
              className="btn btn-outline-success me-3"
              onClick={() => downloadReport("excel")}
            >
              Export Excel
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => downloadReport("pdf")}
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="card-body p-3">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered text-center">
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
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.amount || "N/A"}</td>
                        <td>{transaction.compteBancaire || "N/A"}</td>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-bell text-warning"
                            viewBox="0 0 16 16"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTriggerSMS(transaction._id)}
                            title="Trigger SMS"
                          >
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                          </svg>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
=======
import React from "react";
import { Link } from "react-router-dom";
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTextsms } from "react-icons/md"; // Importing the icon
>>>>>>> Stashed changes

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

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
      const response = await axios.post("http://localhost:5001/api/transactions/trigger-sms", {
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
  
      console.error("Error triggering SMS:", errorMessage);
    }
  };
  
  const downloadReport = async (type) => {
    try {
      const url = `http://localhost:5001/api/export/generate-${type}`;
      const response = await axios.post(
        url,
        { transactions },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `recent_transactions.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();

      alert(`✅ ${type.toUpperCase()} file downloaded successfully.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase() + ": " + (error.response?.data?.message || error.message));
    }
  };

  // Paginate transactions
  const paginateTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-lg mb-0">Recent Transactions</h6>
          <div>
            <button
              className="btn btn-outline-success me-2"
              onClick={() => downloadReport("excel")}
            >
              Export Excel
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => downloadReport("pdf")}
            >
              Export PDF
            </button>
          </div>
        </div>
<<<<<<< Updated upstream
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>SL</th>
                  <th scope='col'>Date </th>
                  <th scope='col'>Payment Type</th>
                  <th scope='col'>Paid Amount</th>
                  <th scope='col'>Due Amount</th>
                  <th scope='col'>Payable Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className='text-secondary-light'>1</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>21 Jun 2024</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Cash</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$0.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$150.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$150.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>2</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>21 Jun 2024</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Bank</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$570 </span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$0.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$570.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>3</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>21 Jun 2024</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>PayPal</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$300.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$100.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$200.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>4</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>21 Jun 2024</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Cash</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$0.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$150.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$150.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>3</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>21 Jun 2024</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>PayPal</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$300.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$100.00</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$200.00</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
>>>>>>> main
=======
        <div className="card-body p-3">
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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className="page-item">
                     
                    </li>
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
                    <li className="page-item">
                    
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
