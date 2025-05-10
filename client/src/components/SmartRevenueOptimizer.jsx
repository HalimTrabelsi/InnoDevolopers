import React, { useState, useEffect } from 'react';

const SmartRevenueOptimizer = ({ revenue }) => {
  const [suggestion, setSuggestion] = useState("");
  const [forecast, setForecast] = useState(0);
  const [status, setStatus] = useState("🟢");

  useEffect(() => {
    if (!revenue || revenue.length < 2) return;
  
    const lastWeek = revenue[revenue.length - 1];
    const prevWeek = revenue[revenue.length - 2];
    const diff = ((lastWeek - prevWeek) / prevWeek) * 100;
  
    if (diff < -5) {
      setStatus("🔴");
      setSuggestion("Revenue dropped 10%. Boost Instagram ads.");
    } else if (diff < 5) {
      setStatus("🟠");
      setSuggestion("Stable revenue. Try an email campaign.");
    } else {
      setStatus("🟢");
      setSuggestion("Great growth! Launch a weekend promo.");
    }
  
    setForecast((lastWeek * 4).toFixed(0));
  }, [revenue]);
  

  return (
    <div className="card p-3">
      <h5>🧠 Smart Revenue Optimizer</h5>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Forecast:</strong> {forecast} TND</p>
      <p><strong>Suggestion:</strong> {suggestion}</p>
    </div>
  );
};

export default SmartRevenueOptimizer;

