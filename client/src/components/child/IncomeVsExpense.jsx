import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const IncomeVsExpense = () => {
  const [timeframe, setTimeframe] = useState("Monthly");
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/expenses/top-expenses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setTopExpenses(response.data.data);
        } else {
          setError("Failed to fetch top expenses.");
        }
      } catch (error) {
        setError("An error occurred while fetching top expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopExpenses();
  }, []);

  const data = {
    Monthly: { income: 2580.52, expense: 1247.19 },
    Weekly: { income: 645.13, expense: 311.79 },
    Today: { income: 92.16, expense: 45.38 },
  };

  const { income, expense } = data[timeframe];

  const incomeExpenseSeries = [
    { name: "Income", data: [income] },
    { name: "Expense", data: [expense] },
    ...topExpenses.map((expense) => ({
      name: expense.category || "Other",
      data: [expense.amount || 0],
    })),
  ];

  const incomeExpenseOptions = {
    chart: { type: "area", toolbar: { show: false } },
    xaxis: { categories: [timeframe] },
    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(value),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center", 
      floating: true,
      offsetY: -30,
    },
    plotOptions: {
      area: {
        lineColor: '#2D3A3F',
        fillOpacity: 0.3,
      },
    },
    dataLabels: { enabled: false },
  };

  // Arrow logic (this could be enhanced by comparing previous values for actual change detection)
  const incomeArrow = income > 2500 ? <FaArrowUp className="text-success" /> : <FaArrowDown className="text-danger" />;
  const expenseArrow = expense > 1200 ? <FaArrowDown className="text-danger" /> : <FaArrowDown className="text-success" />;

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-lg">Income Vs Expense</h6>
          <select
            className="form-select form-select-sm w-auto"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Today</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="row mb-3">
          <div className="col-md-6 d-flex justify-content-between align-items-center">
            <h3>{new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(income)}</h3>
            <div className="d-flex align-items-center">
              {incomeArrow}
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-between align-items-center">
            <h3>{new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(expense)}</h3>
            <div className="d-flex align-items-center">
              {expenseArrow}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger">{error}</div>
          ) : (
            <ReactApexChart
              options={incomeExpenseOptions}
              series={incomeExpenseSeries}
              type="area"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpense;
