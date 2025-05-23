import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaUniversity, FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt } from "react-icons/fa";

const UnitCountAcc = () => {
  const [anomaliesCount, setAnomaliesCount] = useState(0);
  const [anomaliesLoading, setAnomaliesLoading] = useState(true);
  const [anomaliesError, setAnomaliesError] = useState(null);
  
  const [lastAccount, setLastAccount] = useState(null);
  const [lastAccountLoading, setLastAccountLoading] = useState(true);
  const [lastAccountError, setLastAccountError] = useState(null);
  
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState(null);
  
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(null);

  useEffect(() => {
    const fetchData = async (url, setter, errorSetter, loadingSetter) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setter(response.data);
      } catch (error) {
        errorSetter("Failed to load data.");
      } finally {
        loadingSetter(false);
      }
    };

    fetchData("http://localhost:5001/api/transactions/anomalies", 
      (data) => setAnomaliesCount(data.anomaliesCount || 0), 
      setAnomaliesError, 
      setAnomaliesLoading);

    fetchData("http://localhost:5001/api/accounts/last-account", 
      (data) => setLastAccount(data || {}), 
      setLastAccountError, 
      setLastAccountLoading);

    fetchData("http://localhost:5001/api/accounts/total-balance", 
      (data) => setBalance(data.totalBalance || 0), 
      setBalanceError, 
      setBalanceLoading);

    fetchData("http://localhost:5001/api/transactions/recent", 
      (data) => setTransactions(Array.isArray(data.transactions) ? data.transactions : []), 
      setTransactionsError, 
      setTransactionsLoading);
  }, []);

  return (
    <div className="col-xxl-12 col-xl-12 col-lg-12">
      <div className="row gy-4">
        {/* AnomaliesWidget */}
        <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-none border bg-gradient-start-3 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Detected Anomalies</p>
                  <h6 className="mb-0">
                    {anomaliesLoading ? "Loading..." : anomaliesError ? "Error" : anomaliesCount}
                  </h6>
                </div>
                <div className="w-50-px h-50-px bg-danger rounded-circle d-flex justify-content-center align-items-center">
                  <FaExclamationTriangle className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                Total anomalies detected
              </p>
            </div>
          </div>
        </div>

        {/* LastAccountWidget */}
        <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-none border bg-gradient-start-4 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Last Account</p>
                  <h6 className="mb-0">
                    {lastAccountLoading ? "Loading..." : lastAccountError ? "Error" : lastAccount?.numeroCompte || "N/A"}
                  </h6>
                </div>
                <div className="w-50-px h-50-px bg-primary rounded-circle d-flex justify-content-center align-items-center">
                  <FaUniversity className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                Balance: {lastAccountLoading ? "Loading..." : lastAccountError ? "Error" : lastAccount ? lastAccount.balance.toLocaleString() : "0"} DT
              </p>
            </div>
          </div>
        </div>

        {/* TotalBalanceWidget */}
        <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-none border bg-gradient-start-5 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Balance</p>
                  <h6 className="mb-0">
                    {balanceLoading ? "Loading..." : balanceError ? "Error" : `${balance.toLocaleString()} DT`}
                  </h6>
                </div>
                <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                  <FaWallet className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                Total across all accounts
              </p>
            </div>
          </div>
        </div>

        {/* RecentTransactionsWidget */}
        <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-none border bg-gradient-start-5 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Recent Transactions</p>
                  <h6 className="mb-0">{transactionsLoading ? "Loading..." : transactionsError ? "Error" : transactions.length}</h6>
                </div>
                <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                  <FaExchangeAlt className="text-white text-2xl mb-0" />
                </div>
              </div>
              <div className="transactions-list mt-12">
                {transactionsLoading ? (
                  <p className="text-muted mb-0">Loading...</p>
                ) : transactionsError ? (
                  <p className="text-muted mb-0">{transactionsError}</p>
                ) : transactions.length === 0 ? (
                  <p className="text-muted mb-0">No recent transactions</p>
                ) : (
                  transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction._id} className="transaction-item d-flex justify-content-between">
                      <span className="icon me-1">
                        {transaction.type === "credit" ? <FaArrowUp color="#00b894" /> : <FaArrowDown color="#d63031" />}
                      </span>
                      <span className="description">{transaction.description || "No description"}</span>
                      <span className={`amount ${transaction.type}`}>
                        {transaction.type === "credit" ? "+" : "-"}{transaction.amount.toLocaleString()} DT
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          min-height: 260px;
          border-radius: 16px;
        }
        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }
        .transactions-list {
          max-height: 130px;
          overflow-y: auto;
          width: 100%;
          margin-top: 3px;
        }
        .transaction-item {
          padding: 5px 0;
        }
        h3 {
          font-size: 0.7rem; /* Diminuer la taille de la police pour les titres principaux */
          font-weight: normal; /* Éliminer le gras */
        }
        .small {
          font-size: 0.8rem; /* Diminuer la taille de la police pour les descriptions */
        }
        .normal-text {
          font-size: 0.7rem; /* Diminuer la taille de police pour les nombres spécifiques */
          font-weight: normal; /* Éliminer le gras */
        }
      `}</style>
    </div>
  );
};

export default UnitCountAcc;