// FinancialSimulation.jsx
import React, { useState, useRef } from 'react';
import {
  TextField, Button, Typography, Box, Card, CardContent, Divider
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FinancialSimulation = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [revenueChange, setRevenueChange] = useState('');
  const [expenseChange, setExpenseChange] = useState('');
  const [investment, setInvestment] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(true);
  const resultRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!scenarioName.trim()) {
      newErrors.scenarioName = 'Scenario name is required';
      isValid = false;
    }
    if (revenueChange === '' || isNaN(revenueChange) || Number(revenueChange) < -100 || Number(revenueChange) > 100) {
      newErrors.revenueChange = 'Value between -100% and 100% is required';
      isValid = false;
    }
    if (expenseChange === '' || isNaN(expenseChange) || Number(expenseChange) < 0) {
      newErrors.expenseChange = 'Positive value is required';
      isValid = false;
    }
    if (investment === '' || isNaN(investment) || Number(investment) < 0) {
      newErrors.investment = 'Positive value is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('http://localhost:5001/api/simulations/simulate', {
        name: scenarioName,
        revenueChange: Number(revenueChange),
        expenseChange: Number(expenseChange),
        investment: Number(investment),
      });
      setSimulationResult(res.data);
      setShowForm(false);
    } catch (err) {
      setErrors({ global: 'Error during simulation' });
    }
  };

  const chartData = simulationResult
    ? [
        {
          name: 'Current',
          revenues: simulationResult.current.revenues,
          expenses: simulationResult.current.expenses,
          cashFlow: simulationResult.current.cashFlow
        },
        {
          name: 'Simulated',
          revenues: simulationResult.simulated.revenues,
          expenses: simulationResult.simulated.expenses,
          cashFlow: simulationResult.simulated.cashFlow
        }
      ]
    : [];

  const downloadPNG = () => {
    const exportElement = document.getElementById('export-area');
    if (exportElement) {
      html2canvas(exportElement, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${scenarioName}_result.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const downloadPDF = () => {
    const exportElement = document.getElementById('export-area');
    if (exportElement) {
      html2canvas(exportElement, { scale: 3 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save(`${scenarioName}_result.pdf`);
      });
    }
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setScenarioName('');
    setRevenueChange('');
    setExpenseChange('');
    setInvestment('');
    setSimulationResult(null);
    setErrors({});
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Financial Simulation
      </Typography>

      {showForm ? (
        <Card>
          <CardContent>
            <form onSubmit={handleSimulate}>
              <TextField label="Scenario Name" fullWidth required value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                error={!!errors.scenarioName} helperText={errors.scenarioName} margin="normal"
              />
              <TextField label="Revenue Change (%)" fullWidth required type="number"
                value={revenueChange} onChange={(e) => setRevenueChange(e.target.value)}
                error={!!errors.revenueChange} helperText={errors.revenueChange} margin="normal"
              />
              <TextField label="Expense Change (TND)" fullWidth required type="number"
                value={expenseChange} onChange={(e) => setExpenseChange(e.target.value)}
                error={!!errors.expenseChange} helperText={errors.expenseChange} margin="normal"
              />
              <TextField label="Investment (TND)" fullWidth required type="number"
                value={investment} onChange={(e) => setInvestment(e.target.value)}
                error={!!errors.investment} helperText={errors.investment} margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Run Simulation
              </Button>
              {errors.global && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>{errors.global}</Typography>
              )}
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Exportable Section */}
          <div id="export-area" style={{
            padding: '30px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', borderRadius: '8px'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src="images/finova-logo.png" alt="Finova Logo" style={{ height: 60, marginRight: 16 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Finova</Typography>
            </Box>

            <Typography variant="h6" align="center" sx={{ color: '#1976d2', mb: 2, fontWeight: 'bold' }}>
              Simulation Results: {scenarioName}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2, fontSize: '16px' }}>
              <Typography><strong>Scenario Name:</strong> {scenarioName}</Typography>
              <Typography><strong>Revenue Change:</strong> {revenueChange} %</Typography>
              <Typography><strong>Expense Change:</strong> {expenseChange} TND</Typography>
              <Typography><strong>Investment:</strong> {investment} TND</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart width={700} height={400} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenues" stroke="#1976d2" name="Revenues" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ff9800" name="Expenses" strokeWidth={2} />
                <Line type="monotone" dataKey="cashFlow" stroke="#4caf50" name="Cash Flow" strokeWidth={2} />
              </LineChart>
            </Box>
          </div>

          {/* Control Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button onClick={downloadPNG} variant="outlined" color="primary">Download PNG</Button>
            <Button onClick={downloadPDF} variant="outlined" color="primary">Download PDF</Button>
            <Button onClick={handleBackToForm} variant="contained" color="secondary">New Simulation</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FinancialSimulation;
