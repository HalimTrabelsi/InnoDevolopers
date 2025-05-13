import React, { useState, useRef } from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FinancialSimulation = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [revenueChange, setRevenueChange] = useState('');
  const [expenseChange, setExpenseChange] = useState('');
  const [investment, setInvestment] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true); // État pour contrôler l'affichage du formulaire ou des résultats
  const chartRef = useRef(null); // Référence pour capturer le graphique

  // Handle form submission
  const handleSimulate = async (e) => {
    e.preventDefault();
    setError('');
    setSimulationResult(null); // Reset results

    if (!scenarioName) {
      setError('Scenario name is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/simulations/simulate', {
        name: scenarioName,
        revenueChange: revenueChange || 0,
        expenseChange: expenseChange || 0,
        investment: investment || 0,
      });
      setSimulationResult(response.data);
      setShowForm(false); // Hide form and show results
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Error: Invalid data');
      } else {
        setError('Error during simulation');
      }
    }
  };

  // Prepare data for the chart
  const chartData = simulationResult
    ? [
        { name: 'Current', revenues: simulationResult.current.revenues, expenses: simulationResult.current.expenses, cashFlow: simulationResult.current.cashFlow },
        { name: 'Simulated', revenues: simulationResult.simulated.revenues, expenses: simulationResult.simulated.expenses, cashFlow: simulationResult.simulated.cashFlow },
      ]
    : [];

  // Download chart as PNG
  const downloadPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${scenarioName || 'simulation'}_chart.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  // Download chart as PDF
  const downloadPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save(`${scenarioName || 'simulation'}_chart.pdf`);
      });
    }
  };

  // Reset and return to form
  const handleBackToForm = () => {
    setShowForm(true);
    setScenarioName('');
    setRevenueChange('');
    setExpenseChange('');
    setInvestment('');
    setSimulationResult(null);
    setError('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', textAlign: 'center' }}>
        Financial Scenario Simulation
      </Typography>

      {showForm ? (
        // Simulation form
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <form onSubmit={handleSimulate}>
              <TextField
                label="Scenario Name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#1976d2' } }}
                InputProps={{ style: { backgroundColor: '#f5f5f5' } }}
              />
              <TextField
                label="Revenue Change (%)"
                type="number"
                value={revenueChange}
                onChange={(e) => setRevenueChange(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                helperText="Ex: 10 for +10%, -10 for -10%"
                InputLabelProps={{ style: { color: '#1976d2' } }}
                InputProps={{ style: { backgroundColor: '#f5f5f5' } }}
              />
              <TextField
                label="Expense Change (TND)"
                type="number"
                value={expenseChange}
                onChange={(e) => setExpenseChange(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                helperText="Ex: 5000 to add 5000 TND"
                InputLabelProps={{ style: { color: '#1976d2' } }}
                InputProps={{ style: { backgroundColor: '#f5f5f5' } }}
              />
              <TextField
                label="New Investment (TND)"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#1976d2' } }}
                InputProps={{ style: { backgroundColor: '#f5f5f5' } }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
              >
                SIMULATE
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        // Display results in place of the form
        <Card sx={{ borderRadius: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: '#1976d2' }}>
              Simulation Results
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Chart container with reference for downloading */}
            <Box ref={chartRef} sx={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart width={800} height={400} data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'TND', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenues" stroke="#1976d2" name="Revenues" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ff9800" name="Expenses" strokeWidth={2} />
                <Line type="monotone" dataKey="cashFlow" stroke="#4caf50" name="Cash Flow" strokeWidth={2} />
              </LineChart>
            </Box>

            {/* Download buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadPNG}
                sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' } }}
              >
                Download as PNG
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadPDF}
                sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' } }}
              >
                Download as PDF
              </Button>
            </Box>

            {/* Recommendation */}
            <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
              Recommendation
            </Typography>
            <Typography
              color={simulationResult.simulated.cashFlow < 0 ? 'error' : 'success'}
              sx={{ textAlign: 'center', fontSize: '1.2rem' }}
            >
              {simulationResult.recommendation}
            </Typography>

            {/* Button to return to form */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBackToForm}
                sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#1565c0', color: '#1565c0' } }}
              >
                Back to Form
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Display errors (only if the form is visible) */}
      {showForm && error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FinancialSimulation;