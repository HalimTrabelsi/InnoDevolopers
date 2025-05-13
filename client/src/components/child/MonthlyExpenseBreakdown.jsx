import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// No need to import the default CSS if you're customizing or using Tailwind

const BudgetHealth = () => {
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const monthlyBudget = 1000; // You can make this dynamic later

  // Fetch total expenses from your API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses/total");
        const data = await res.json();
        if (data.success) {
          setTotalExpenses(data.total);
        }
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setTotalExpenses(0);
      }
    };

    fetchExpenses();
  }, []);

  // Show loading until data is ready
  if (totalExpenses === null) return <p>Loading...</p>;

  // Calculate percentage safely
  const percentage =
    monthlyBudget && monthlyBudget > 0
      ? Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100))
      : 0;

  const getColor = () => {
    if (percentage < 70) return "#3BC14A";
    if (percentage < 90) return "#FFD700";
    return "#FF4C4C";
  };

  const getMessage = () => {
    if (percentage < 70) return "👍 Good Control";
    if (percentage < 90) return "⚠️ Watch Spending";
    return "🚨 High Spending!";
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-52 text-center text-xs">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        💼 Budget Health
      </h2>

      <div style={{ width: 120, height: 120, margin: "0 auto" }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: getColor(),
            trailColor: "#eee",
            textSize: "28px",
            pathTransitionDuration: 0.5,
          })}
        />
      </div>

      <p className="mt-3 font-medium text-gray-700">{getMessage()}</p>

      <button
        onClick={() => setShowTips(!showTips)}
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition duration-200"
      >
        {showTips ? "Hide 💡" : "Tips 💰"}
      </button>

      {showTips && (
        <div className="mt-3 bg-gray-100 p-3 rounded text-left text-[10px]">
          <ul className="list-disc pl-4 space-y-1">
            <li>Cancel unused subscriptions</li>
            <li>Set weekly expense goals</li>
            <li>Track daily expenses</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetHealth;
