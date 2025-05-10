import React, { useEffect, useState } from "react";
import axios from "axios";
import SmartRevenueOptimizer from "./SmartRevenueOptimizer";

const DashboardDataFetcher = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/ownerdashboard/ownerdashboard");
        setRevenueData(response.data.revenues.map((item) => item.amount)); 
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      {revenueData.length > 1 && <SmartRevenueOptimizer revenue={revenueData} />}
    </div>
  );
};

export default DashboardDataFetcher;
