import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';


const RecurringPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5001/api/expenses/recurring-stats')
      .then(res => {
        const { recurring, nonRecurring } = res.data.data;
        setChartData({
          labels: ['Recurring', 'Non-Recurring'],
          datasets: [{
            data: [recurring, nonRecurring],
            backgroundColor: ['#36A2EB', '#FF6384'],
          }]
        });
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div className="card bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">♻️ Recurring vs Non-Recurring</h2>
      {chartData?.datasets ? <div style={{ width: '200px', height: '200px' }}>
        <Pie data={chartData} /> </div>: error ? <p className="text-red-500">Error loading data.</p> : <p>Loading...</p>}
    </div>
  );
};

export default RecurringPieChart;
