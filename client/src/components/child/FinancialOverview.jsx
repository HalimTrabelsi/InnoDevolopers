import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import useReactApexChart from "../../hook/useReactApexChart";

const FinancialOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const { userOverviewDonutChartOptionsTwo } = useReactApexChart();
  const [chartOptions, setChartOptions] = useState(userOverviewDonutChartOptionsTwo);
  const [chartSeries, setChartSeries] = useState([30, 40, 25]);

  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const data = {
    Monthly: { income: 2580.52, expense: 1247.19 },
    Weekly: { income: 645.13, expense: 311.79 },
    Today: { income: 92.16, expense: 45.38 },
    Yearly: { income: 30966.24, expense: 14966.28 },
  };

  const updateChartData = (rev, exp) => {
    const net = rev - exp;
    const total = rev + exp + net || 1;

    const series = [
      (rev / total) * 100,
      (exp / total) * 100,
      (net / total) * 100,
    ];

    setChartSeries(series);
    setChartOptions({
      ...chartOptions,
      colors: ["#4CAF50", "#003366", "#6EC5FF"],
      legend: {
        ...chartOptions.legend,
        labels: {
          ...chartOptions.legend.labels,
          items: [
            { name: "Revenue", color: "#4CAF50" },
            { name: "Expense", color: "#003366" },
            { name: "Net Income", color: "#6EC5FF" },
          ],
        },
      },
    });
  };

  useEffect(() => {
    const { income = 0, expense = 0 } = data[selectedPeriod] || {};
    setRevenue(income);
    setExpenses(expense);
    updateChartData(income, expense);
  }, [selectedPeriod]);

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const netIncome = revenue - expenses;

  return (
    <div className="col-12">
      <div className="card radius-12 position-relative">
        {/* Combo box on the far top right */}
        <div className="position-absolute" style={{ top: "1rem", right: "1rem", zIndex: 1 }}>
          <select
            className="form-select form-select-sm bg-base border text-secondary-light"
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Today</option>
            <option>Yearly</option>
          </select>
        </div>

        <div className="card-header">
          <h6 className="fw-bold text-lg mb-0">Financial Overview</h6>
        </div>

        <div className="card-body">
          <div className="row g-4 mb-4">
            <div className="col-xl-8 col-md-12">
              <div className="d-flex justify-content-center">
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  height={330}
                  width="100%"
                />
              </div>
            </div>

            <div className="col-xl-4 col-md-12">
              <div className="d-flex flex-column align-items-start justify-content-between">
                <div className="d-flex justify-content-between w-100 mb-3">
                  <div className="d-flex flex-column gap-2">
                    <span className="text-secondary">Revenue</span>
                    <h3>{formatCurrency(revenue)}</h3>
                  </div>
                  <div className="dot-circle d-inline-flex justify-content-center align-items-center">
                    <i className="ri-arrow-up-s-fill text-success fs-6" />
                  </div>
                </div>
                <div className="d-flex justify-content-between w-100 mb-3">
                  <div className="d-flex flex-column gap-2">
                    <span className="text-secondary">Expense</span>
                    <h3>{formatCurrency(expenses)}</h3>
                  </div>
                  <div className="dot-circle d-inline-flex justify-content-center align-items-center">
                    <i className="ri-arrow-down-s-fill text-danger fs-6" />
                  </div>
                </div>
                <div className="d-flex justify-content-between w-100">
                  <div className="d-flex flex-column gap-2">
                    <span className="text-secondary">Net Income</span>
                    <h3>{formatCurrency(netIncome)}</h3>
                  </div>
                  <div className="dot-circle d-inline-flex justify-content-center align-items-center">
                    <i className="ri-arrow-down-s-fill text-danger fs-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default FinancialOverview;
