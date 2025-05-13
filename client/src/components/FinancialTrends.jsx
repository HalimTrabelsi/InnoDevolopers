import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import * as tf from '@tensorflow/tfjs';

const FinancialTrends = () => {
  const [trends, setTrends] = useState({
    revenueForecast: [],
    expenseForecast: [],
    recommendations: [],
    chartData: [],
  });
  const [loading, setLoading] = useState(true);

  // Function to calculate variance
  const calculateVariance = (tensor) => {
    const mean = tf.mean(tensor);
    const squaredDiff = tf.square(tensor.sub(mean));
    return tf.mean(squaredDiff).arraySync();
  };

  // Function to calculate a simple moving average as a fallback
  const calculateMovingAverage = (data, windowSize) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(avg);
    }
    // Extend for forecasting
    const lastAvg = result[result.length - 1];
    return [lastAvg, lastAvg * 1.01, lastAvg * 1.02]; // Slight upward trend for forecasts
  };

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:5001/api/financial-trends/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to load financial data');
      return [];
    }
  };

  const predictTrends = async (transactions) => {
    if (transactions.length < 6) {
      toast.warn('Not enough data to make predictions. At least 6 transactions are required.');
      return { revenueForecast: [], expenseForecast: [], recommendations: [], chartData: [] };
    }

    // Separate revenues and expenses
    const revenues = transactions
      .filter(t => t.category === 'revenue')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const expenses = transactions
      .filter(t => t.category === 'expense')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (revenues.length < 3 || expenses.length < 3) {
      toast.warn('Insufficient data for revenues or expenses. At least 3 transactions per category are required.');
      return { revenueForecast: [], expenseForecast: [], recommendations: [], chartData: [] };
    }

    // Aggregate data by month
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date detected: ${t.date}`);
        return;
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${month}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, expense: 0, year, month };
      }
      if (t.category === 'revenue') {
        monthlyData[monthKey].revenue += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    if (sortedMonths.length < 2) {
      toast.warn('Not enough distinct months to make predictions. At least 2 months are required.');
      return { revenueForecast: [], expenseForecast: [], recommendations: [], chartData: [] };
    }

    const monthlyRevenues = sortedMonths.map(month => monthlyData[month].revenue);
    const monthlyExpenses = sortedMonths.map(month => monthlyData[month].expense);

    console.log('Aggregated data by month:', monthlyData);
    console.log('Monthly revenues:', monthlyRevenues);
    console.log('Monthly expenses:', monthlyExpenses);

    // Check variance to determine prediction reliability
    const revenueVariance = calculateVariance(tf.tensor1d(monthlyRevenues));
    const expenseVariance = calculateVariance(tf.tensor1d(monthlyExpenses));
    if (revenueVariance < 0.1 || expenseVariance < 0.1) {
      toast.info('Financial data shows little variance; predictions may be less accurate.');
    }

    // Linear regression model
    const x = tf.tensor2d([...Array(monthlyRevenues.length).keys()].map(i => [i]), [monthlyRevenues.length, 1]);
    const yRevenues = tf.tensor2d(monthlyRevenues, [monthlyRevenues.length, 1]);
    const yExpenses = tf.tensor2d(monthlyExpenses, [monthlyExpenses.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: tf.train.sgd(0.001), loss: 'meanSquaredError' });

    // Train for revenues
    await model.fit(x, yRevenues, { epochs: 200, verbose: 0 });
    let revenuePredictions = model.predict(tf.tensor2d(
      [[monthlyRevenues.length], [monthlyRevenues.length + 1], [monthlyRevenues.length + 2]],
      [3, 1]
    )).arraySync().flat().map(val => Math.max(0, val));

    // Train for expenses
    await model.fit(x, yExpenses, { epochs: 200, verbose: 0 });
    let expensePredictions = model.predict(tf.tensor2d(
      [[monthlyExpenses.length], [monthlyExpenses.length + 1], [monthlyExpenses.length + 2]],
      [3, 1]
    )).arraySync().flat().map(val => Math.max(0, val));

    // Fallback to moving average if predictions are unrealistic
    const revenueMovingAvg = calculateMovingAverage(monthlyRevenues, 2);
    const expenseMovingAvg = calculateMovingAverage(monthlyExpenses, 2);

    // Adjust revenue predictions if they are negative or flat
    if (revenuePredictions.some(pred => pred <= 0) || revenueVariance < 0.1) {
      revenuePredictions = revenueMovingAvg;
    }

    // Adjust expense predictions with a more dynamic heuristic
    const maxHistoricalExpense = Math.max(...monthlyExpenses);
    const avgHistoricalExpense = monthlyExpenses.reduce((sum, val) => sum + val, 0) / monthlyExpenses.length;
    if (maxHistoricalExpense > 0) {
      const minExpensePrediction = Math.max(avgHistoricalExpense, maxHistoricalExpense * 0.5);
      expensePredictions = expensePredictions.map((pred, idx) => {
        const adjustedPred = Math.max(pred, minExpensePrediction);
        return adjustedPred * (1 + idx * 0.05);
      });
    } else if (expenseVariance < 0.1) {
      expensePredictions = expenseMovingAvg;
    }

    console.log('Adjusted revenue predictions:', revenuePredictions);
    console.log('Adjusted expense predictions:', expensePredictions);

    // Generate recommendations
    const recommendations = [];
    if (revenuePredictions[2] < expensePredictions[2]) {
      recommendations.push(
        `Warning: Forecasted expenses (${expensePredictions[2].toFixed(2)} TND) exceed revenues (${revenuePredictions[2].toFixed(2)} TND) in 3 months. Reduce costs or increase revenues.`
      );
    }
    if (revenuePredictions[2] < 0) {
      recommendations.push(
        `Alert: Negative revenues forecasted (${revenuePredictions[2].toFixed(2)} TND). Review data or adjust strategy.`
      );
    }
    if (recommendations.length === 0) {
      if (revenuePredictions[2] > revenuePredictions[0]) {
        recommendations.push(
          `Good news: Forecasted revenues are increasing (${revenuePredictions[2].toFixed(2)} TND in 3 months). Consider investing part of the profits or saving for future growth.`
        );
      } else {
        recommendations.push(
          `Forecasted revenues are stable or slightly decreasing (${revenuePredictions[2].toFixed(2)} TND in 3 months). Explore new revenue streams to boost growth.`
        );
      }
      if (maxHistoricalExpense > 0 || expensePredictions[2] > 0) {
        recommendations.push(
          `Forecasted expenses are ${expensePredictions[2].toFixed(2)} TND in 3 months. Monitor your costs to maintain a healthy profit margin.`
        );
      }
    }

    // Prepare chart data
    const lastRealMonthKey = sortedMonths[sortedMonths.length - 1];
    const lastRealYear = monthlyData[lastRealMonthKey].year;
    const lastRealMonth = monthlyData[lastRealMonthKey].month - 1;
    const lastRealDate = new Date(lastRealYear, lastRealMonth);

    const forecastMonths = [];
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date(lastRealYear, lastRealMonth + i);
      forecastMonths.push(forecastDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }

    const chartData = [
      // Historical data
      ...sortedMonths.map(month => {
        const [year, monthNum] = month.split('-').map(Number);
        const displayDate = new Date(year, monthNum - 1);
        return {
          month: displayDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          revenue: monthlyData[month].revenue,
          expense: monthlyData[month].expense,
        };
      }),
      // Forecasts
      ...forecastMonths.map((month, index) => ({
        month: `${month} (Forecast)`,
        revenue: revenuePredictions[index],
        expense: expensePredictions[index],
      })),
    ];

    return {
      revenueForecast: revenuePredictions,
      expenseForecast: expensePredictions,
      recommendations,
      chartData,
    };
  };

  useEffect(() => {
    const loadTrends = async () => {
      setLoading(true);
      const transactions = await fetchFinancialData();
      if (transactions.length > 0) {
        const predictedTrends = await predictTrends(transactions);
        setTrends(predictedTrends);
      }
      setLoading(false);
    };
    loadTrends();
  }, []);

  return (
    <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Global Financial Trends (3-Month Forecast)</h3>

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Loading forecasts...</p>
      ) : (
        <>
          {trends.chartData?.length > 0 ? (
            <LineChart width={700} height={350} data={trends.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
              <YAxis tickFormatter={(value) => `${value} TND`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value.toFixed(2)} TND`} />
              <Legend formatter={(value) => `${value} (Global Forecast)`} verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="revenue" name="Revenues (TND)" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expense" name="Expenses (TND)" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
              <ReferenceLine x={trends.chartData[trends.chartData.length - 3].month} stroke="gray" strokeDasharray="3 3" label={{ value: 'Forecast Start', position: 'top', fill: 'gray', fontSize: 12 }} />
            </LineChart>
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>
              Insufficient data to display forecasts. Add more transactions for reliable analysis.
            </p>
          )}

          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>Global Recommendations</h4>
            {trends.recommendations.length > 0 ? (
              <ul>
                {trends.recommendations.map((rec, index) => (
                  <li key={index} style={{ color: '#dc3545', marginBottom: '10px' }}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666' }}>No recommendations at the moment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialTrends;