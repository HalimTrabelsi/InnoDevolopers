import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

Modal.setAppElement('#root');

const FinancialTrends = () => {
  const [trends, setTrends] = useState({
    revenueForecast: [],
    expenseForecast: [],
    recommendations: [],
    chartData: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionView, setActionView] = useState(null);
  const chartRef = useRef(null);

  const calculateVariance = (tensor) => {
    const mean = tf.mean(tensor);
    const squaredDiff = tf.square(tensor.sub(mean));
    return tf.mean(squaredDiff).arraySync();
  };

  const calculateMovingAverage = (data, windowSize) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(avg);
    }
    const lastAvg = result[result.length - 1];
    return [lastAvg, lastAvg * 1.01, lastAvg * 1.02];
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

  const fetchTransactionsByMonth = async (year, month) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5001/api/financial-trends/transactions?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by month:', error);
      toast.error('Failed to load transactions');
      return [];
    }
  };

  const saveRecommendation = async (recommendation) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/financial-trends/recommendations`,
        recommendation,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving recommendation:', error.response?.data || error.message);
      toast.error('Failed to save recommendation');
      return null;
    }
  };

  const updateRecommendationStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/financial-trends/recommendations/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      toast.error('Failed to update recommendation');
      return null;
    }
  };

  const validateImageData = (dataUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Invalid or corrupted image data'));
      img.src = dataUrl;
    });
  };

  const generateReport = async () => {
    try {
      const pdf = new jsPDF();
      let yOffset = 10;

      // Skip logo capture to isolate chart issue
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Finova', 10, yOffset + 10);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Financial Trends Report', 10, yOffset + 18);
      yOffset += 20;

      // Add generation date
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on: ${today}`, 10, yOffset);
      yOffset += 10;

      // Capture chart
      if (chartRef.current) {
        // Wait for chart to render with retry mechanism
        let chartData = null;
        let attempts = 0;
        const maxAttempts = 3;
        while (!chartData && attempts < maxAttempts) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 3000)); // 3000ms delay
            chartData = await domtoimage.toJpeg(chartRef.current, {
              bgcolor: '#ffffff',
              quality: 0.95,
              width: 700,
              height: 350,
            });
            console.log('Chart Data URL:', chartData); // Debug output
            await validateImageData(chartData); // Validate image
            pdf.addImage(chartData, 'JPEG', 10, yOffset, 190, 80);
            yOffset += 90;
          } catch (error) {
            console.warn(`Chart capture attempt ${attempts + 1} failed:`, error.message);
            attempts++;
            if (attempts === maxAttempts) {
              console.error('All chart capture attempts failed');
              toast.error('Failed to capture chart after multiple attempts');
              yOffset += 90;
              return; // Exit to avoid further errors
            }
          }
        }
      } else {
        console.warn('Chart element not found');
        toast.warn('Chart could not be included in the PDF.');
        yOffset += 90;
      }

      // Add recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Global Recommendations', 10, yOffset);
      yOffset += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      trends.recommendations.forEach((rec, i) => {
        const lines = pdf.splitTextToSize(`- ${rec.text} (${rec.status})`, 190);
        pdf.text(lines, 10, yOffset);
        yOffset += lines.length * 6 + 2;
        if (yOffset > 270) {
          pdf.addPage();
          yOffset = 10;
        }
      });

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text('Powered by Finova', 10, 290);
      pdf.text('Page 1', 190, 290, { align: 'right' });

      // Save the PDF
      pdf.save('financial_trends_report.pdf');
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error.message, error.stack);
      toast.error('Failed to generate report: ' + error.message);
    }
  };

  const predictTrends = async (transactions) => {
    if (transactions.length < 6) {
      toast.warn('Not enough data to make predictions. At least 6 transactions are required.');
      return { revenueForecast: [], expenseForecast: [], recommendations: [], chartData: [] };
    }

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

    const monthlyData = {};
    const categoryBreakdown = { revenue: {}, expense: {} };
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
        categoryBreakdown.revenue[t.subCategory] = (categoryBreakdown.revenue[t.subCategory] || 0) + t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
        categoryBreakdown.expense[t.subCategory] = (categoryBreakdown.expense[t.subCategory] || 0) + t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    if (sortedMonths.length < 2) {
      toast.warn('Not enough distinct months for predictions. At least 2 months are required.');
      return { revenueForecast: [], expenseForecast: [], recommendations: [], chartData: [] };
    }

    const monthlyRevenues = sortedMonths.map(month => monthlyData[month].revenue);
    const monthlyExpenses = sortedMonths.map(month => monthlyData[month].expense);

    const revenueVariance = calculateVariance(tf.tensor1d(monthlyRevenues));
    const expenseVariance = calculateVariance(tf.tensor1d(monthlyExpenses));
    if (revenueVariance < 0.1 || expenseVariance < 0.1) {
      toast.info('Financial data shows low variance; predictions may be less accurate.');
    }

    const x = tf.tensor2d([...Array(monthlyRevenues.length).keys()].map(i => [i]), [monthlyRevenues.length, 1]);
    const yRevenues = tf.tensor2d(monthlyRevenues, [monthlyRevenues.length, 1]);
    const yExpenses = tf.tensor2d(monthlyExpenses, [monthlyRevenues.length, 1]);

    // Create separate models for revenue and expenses
    const revenueModel = tf.sequential();
    revenueModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    revenueModel.compile({ optimizer: tf.train.sgd(0.001), loss: 'meanSquaredError' });

    const expenseModel = tf.sequential();
    expenseModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    expenseModel.compile({ optimizer: tf.train.sgd(0.001), loss: 'meanSquaredError' });

    try {
      // Train and predict for revenues
      await revenueModel.fit(x, yRevenues, { epochs: 200, verbose: 0 });
      let revenuePredictions = revenueModel.predict(tf.tensor2d(
        [[monthlyRevenues.length], [monthlyRevenues.length + 1], [monthlyRevenues.length + 2]],
        [3, 1]
      )).arraySync().flat().map(val => Math.max(0, val));

      // Train and predict for expenses
      await expenseModel.fit(x, yExpenses, { epochs: 200, verbose: 0 });
      let expensePredictions = expenseModel.predict(tf.tensor2d(
        [[monthlyExpenses.length], [monthlyExpenses.length + 1], [monthlyExpenses.length + 2]],
        [3, 1]
      )).arraySync().flat().map(val => Math.max(0, val));

      // Dispose of tensors and models
      x.dispose();
      yRevenues.dispose();
      yExpenses.dispose();
      revenueModel.dispose();
      expenseModel.dispose();

      const revenueMovingAvg = calculateMovingAverage(monthlyRevenues, 2);
      const expenseMovingAvg = calculateMovingAverage(monthlyExpenses, 2);

      if (revenuePredictions.some(pred => pred <= 0) || revenueVariance < 0.1) {
        revenuePredictions = revenueMovingAvg;
      }

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

      const totalExpenses = Object.values(categoryBreakdown.expense).reduce((sum, val) => sum + val, 0);
      const highExpenseCategories = Object.entries(categoryBreakdown.expense)
        .filter(([_, amount]) => amount > 0.3 * totalExpenses)
        .map(([category, amount]) => ({
          text: `High expenses in ${category} (${amount.toFixed(2)} TND). Consider reducing spending in this category.`,
          priority: 'important',
          action: { type: 'analyzeExpenses', label: 'Analyze Expenses' },
          links: [
            { label: 'Guide to Reducing Expenses', url: 'https://www.thebalancemoney.com/how-to-save-money-1388988' },
          ],
        }));

      const recommendations = [];
      if (revenuePredictions[2] < expensePredictions[2]) {
        recommendations.push({
          text: `Warning: Forecasted expenses (${expensePredictions[2].toFixed(2)} TND) exceed revenues (${revenuePredictions[2].toFixed(2)} TND) in 3 months. Compare scenarios to optimize your expenses.`,
          priority: 'critical',
          action: { type: 'compareExpenseScenarios', label: 'Compare Expense Scenarios' },
          links: [
            { label: 'Tips for Cutting Costs', url: 'https://www.nerdwallet.com/article/finance/how-to-save-money' },
          ],
        });
      }
      if (revenuePredictions[2] < 0) {
        recommendations.push({
          text: `Alert: Negative revenue forecasted (${revenuePredictions[2].toFixed(2)} TND). Review your data or adjust your strategy.`,
          priority: 'critical',
          action: { type: 'addRevenue', label: 'Add Revenue' },
          links: [
            { label: 'Ways to Increase Revenue', url: 'https://www.entrepreneur.com/article/351938' },
          ],
        });
      }
      if (recommendations.length === 0) {
        if (revenuePredictions[2] > revenuePredictions[0]) {
          recommendations.push({
            text: `Good news: Forecasted revenues are increasing (${revenuePredictions[2].toFixed(2)} TND in 3 months). View a suggested allocation to invest your profits.`,
            priority: 'suggestion',
            action: { type: 'viewInvestmentAllocation', label: 'View Investment Allocation' },
            links: [
              { label: 'Beginner’s Investment Guide', url: 'https://www.investopedia.com/articles/basics/06/invest1000.asp' },
            ],
          });
        } else {
          recommendations.push({
            text: `Forecasted revenues are stable or slightly declining (${revenuePredictions[2].toFixed(2)} TND in 3 months). Explore new revenue sources.`,
            priority: 'important',
            action: { type: 'addRevenue', label: 'Add Revenue' },
            links: [
              { label: 'Ways to Increase Revenue', url: 'https://www.entrepreneur.com/article/351938' },
            ],
          });
        }
        if (maxHistoricalExpense > 0 || expensePredictions[2] > 0) {
          recommendations.push({
            text: `Forecasted expenses are ${expensePredictions[2].toFixed(2)} TND in 3 months. Compare scenarios to maintain a healthy profit margin.`,
            priority: 'suggestion',
            action: { type: 'compareExpenseScenarios', label: 'Compare Expense Scenarios' },
            links: [
              { label: 'Tips for Cutting Costs', url: 'https://www.nerdwallet.com/article/finance/how-to-save-money' },
            ],
          });
        }
      }
      recommendations.push(...highExpenseCategories);

      const savedRecommendations = [];
      for (const rec of recommendations) {
        const savedRec = await saveRecommendation(rec);
        if (savedRec) {
          savedRecommendations.push({ ...rec, _id: savedRec._id, status: savedRec.status });
        } else {
          savedRecommendations.push({ ...rec, _id: `temp-${Math.random()}`, status: 'pending' });
        }
      }

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
        ...sortedMonths.map(month => {
          const [year, monthNum] = month.split('-').map(Number);
          const displayDate = new Date(year, monthNum - 1);
          return {
            month: displayDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            revenue: monthlyData[month].revenue,
            expense: monthlyData[month].expense,
          };
        }),
        ...forecastMonths.map((month, index) => ({
          month: `${month} (Forecast)`,
          revenue: revenuePredictions[index],
          expense: expensePredictions[index],
        })),
      ];

      return {
        revenueForecast: revenuePredictions,
        expenseForecast: expensePredictions,
        recommendations: savedRecommendations,
        chartData,
      };
    } catch (error) {
      console.error('Error in predictTrends:', error);
      // Ensure cleanup in case of error
      x.dispose();
      yRevenues.dispose();
      yExpenses.dispose();
      revenueModel.dispose();
      expenseModel.dispose();
      throw error;
    }
  };

  const handleChartClick = async (data) => {
    if (data && data.activeLabel && !data.activeLabel.includes('(Forecast)')) {
      const [month, year] = data.activeLabel.split(' ');
      const monthNum = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const transactions = await fetchTransactionsByMonth(year, monthNum);
      if (transactions.length > 0) {
        const categoryBreakdown = transactions.reduce((acc, t) => {
          acc[t.subCategory] = (acc[t.subCategory] || 0) + t.amount;
          return acc;
        }, {});
        setModalData({
          transactions,
          categoryData: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
        });
        setIsModalOpen(true);
      } else {
        toast.info('No transactions found for this month.');
      }
    }
  };

  const handleRecommendationAction = (actionType) => {
    setActionView(actionType);
  };

  const handleRecommendationStatusChange = async (id, status) => {
    const updatedRec = await updateRecommendationStatus(id, status);
    if (updatedRec) {
      setTrends((prev) => ({
        ...prev,
        recommendations: prev.recommendations.map((rec) =>
          rec._id === id ? { ...rec, status: updatedRec.status } : rec
        ),
      }));
      toast.success('Recommendation status updated');
    }
  };

  useEffect(() => {
    const loadTrends = async () => {
      setLoading(true);
      try {
        const transactions = await fetchFinancialData();
        if (transactions.length > 0) {
          const predictedTrends = await predictTrends(transactions);
          setTrends(predictedTrends);
        }
      } catch (error) {
        console.error('Error loading trends:', error);
        toast.error('Failed to load trends');
      } finally {
        setLoading(false);
      }
    };
    loadTrends();
  }, []);

  const renderActionContent = () => {
    switch (actionView) {
      case 'viewInvestmentAllocation':
        const investmentData = [
          { name: 'Stocks', value: 40 },
          { name: 'Bonds', value: 30 },
          { name: 'Real Estate', value: 30 },
        ];
        return (
          <div>
            <h4>Suggested Investment Allocation</h4>
            <p>Here’s a suggested allocation for investing your profits, based on your forecasted revenues:</p>
            <PieChart width={400} height={200}>
              <Pie data={investmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#ff7300', '#82ca9d'][index % 3]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              <li><strong>Stocks</strong>: Potentially high returns, but riskier.</li>
              <li><strong>Bonds</strong>: Stability with fixed returns.</li>
              <li><strong>Real Estate</strong>: Long-term growth and rental income.</li>
            </ul>
            <p>
              Learn more:{' '}
              <a
                href="https://www.investopedia.com/articles/basics/06/invest1000.asp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'underline' }}
              >
                Investment Guide
              </a>
            </p>
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setActionView(null)}
            >
              Return to Chart
            </button>
          </div>
        );
      case 'compareExpenseScenarios':
        const expenseScenarios = trends.expenseForecast.map((expense, index) => ({
          month: `Month ${index + 1}`,
          current: expense,
          reduced: expense * 0.9,
          optimized: expense * 0.8,
        }));
        return (
          <div>
            <h4>Compare Expense Scenarios</h4>
            <p>Compare forecasted expenses with reduced scenarios to maintain a healthy profit margin:</p>
            <LineChart width={500} height={300} data={expenseScenarios} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)} TND`} />
              <Tooltip formatter={(value) => `${value.toFixed(2)} TND`} />
              <Legend />
              <Line type="monotone" dataKey="current" name="Current Scenario" stroke="#ff7300" />
              <Line type="monotone" dataKey="reduced" name="Reduced (-10%)" stroke="#82ca9d" />
              <Line type="monotone" dataKey="optimized" name="Optimized (-20%)" stroke="#8884d8" />
            </LineChart>
            <p>Tips for reducing expenses:</p>
            <ul style={{ listStyle: 'none', padding: '0' }}>
              <li>- Negotiate with suppliers for lower rates.</li>
              <li>- Review subscriptions and eliminate non-essential ones.</li>
              <li>- Optimize resource usage (energy, supplies).</li>
            </ul>
            <p>
              Learn more:{' '}
              <a
                href="https://www.nerdwallet.com/article/finance/how-to-save-money"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'underline' }}
              >
                Tips for Cutting Costs
              </a>
            </p>
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setActionView(null)}
            >
              Return to Chart
            </button>
          </div>
        );
      case 'viewInvestments':
        return (
          <div>
            <h4>Explore Investment Options</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Stocks</strong>: Invest in company shares for potentially high returns.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Bonds</strong>: Safer investments with fixed returns.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Real Estate</strong>: Long-term investment with rental income potential.
              </li>
            </ul>
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setActionView(null)}
            >
              Return to Chart
            </button>
          </div>
        );
      case 'addRevenue':
        return (
          <div>
            <h4>Add Revenue</h4>
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const revenue = {
                  amount: Number(formData.get('amount')),
                  date: formData.get('date'),
                  category: formData.get('source'),
                  type: 'credit',
                };
                toast.info('Revenue added (placeholder)');
                setActionView(null);
              }}
            >
              <label>
                Source:
                <input name="source" type="text" placeholder="e.g., Sales" style={{ marginLeft: '10px', padding: '5px' }} required />
              </label>
              <label>
                Amount (TND):
                <input name="amount" type="number" placeholder="e.g., 500" style={{ marginLeft: '10px', padding: '5px' }} required />
              </label>
              <label>
                Date:
                <input name="date" type="date" style={{ marginLeft: '10px', padding: '5px' }} required />
              </label>
              <button
                type="submit"
                style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', width: '150px' }}
              >
                Add Revenue
              </button>
            </form>
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setActionView(null)}
            >
              Return to Chart
            </button>
          </div>
        );
      case 'analyzeExpenses':
        return (
          <div>
            <h4>Analyze Expenses</h4>
            <p>Placeholder for expense analysis. Add charts or tables to break down expenses by category.</p>
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setActionView(null)}
            >
              Return to Chart
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Global Financial Trends (3-Month Forecast)</h3>

      <img
        id="finova-logo"
        src={process.env.PUBLIC_URL + '/images/finova-logo.png'}
        alt="Finova Logo"
        style={{ display: 'none', height: 60 }}
        crossOrigin="anonymous"
      />

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Loading forecasts...</p>
      ) : (
        <>
          {trends.chartData?.length > 0 && !actionView ? (
            <>
              <div ref={chartRef} style={{ overflow: 'visible', background: '#ffffff' }}>
                <LineChart
                  width={700}
                  height={350}
                  data={trends.chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  onClick={handleChartClick}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
                  <YAxis tickFormatter={(value) => `${value} TND`} tick={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue (TND)" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" name="Expenses (TND)" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </div>
              <button
                style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                onClick={generateReport}
              >
                Export Report (PDF)
              </button>
            </>
          ) : actionView ? (
            renderActionContent()
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
                  <li
                    key={index}
                    style={{
                      marginBottom: '20px',
                      color:
                        rec.priority === 'critical' ? '#dc3545' : rec.priority === 'important' ? '#ffc107' : '#28a745',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{rec.text}</span>
                      {rec.action && rec.action.label && (
                        <button
                          style={{ marginLeft: '10px', padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                          onClick={() => handleRecommendationAction(rec.action.type)}
                        >
                          {rec.action.label}
                        </button>
                      )}
                    </div>
                    <select
                      value={rec.status}
                      onChange={(e) => handleRecommendationStatusChange(rec._id, e.target.value)}
                      style={{ marginTop: '5px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {rec.links && rec.links.length > 0 && (
                      <div style={{ marginTop: '5px' }}>
                        <span>Learn more: </span>
                        {rec.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'underline' }}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666' }}>No recommendations at this time.</p>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '600px' },
            }}
          >
            <h3>Transactions for the Selected Month</h3>
            {modalData && (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subcategory</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.transactions.map((t) => (
                      <tr key={t._id || Math.random()}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(t.date).toLocaleDateString()}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.category}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.subCategory}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.amount} TND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4>Category Breakdown</h4>
                <PieChart width={400} height={200}>
                  <Pie data={modalData.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {modalData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#8884d8', '#ff7300', '#82ca9d', '#ffc107'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} TND`} />
                </PieChart>
              </>
            )}
            <button
              style={{ marginTop: '10px', padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default FinancialTrends;