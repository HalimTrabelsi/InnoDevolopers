import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MasterLayout from '../masterLayout/MasterLayout.jsx';
const FinancialSimulation = () => {
  const [formData, setFormData] = useState({
    scenarioName: '',
    revenueChange: '',
    expenseChange: '',
    investment: '',
  });
  const [errors, setErrors] = useState({
    scenarioName: '',
    revenueChange: '',
    expenseChange: '',
    investment: '',
  });
  const [simulationResult, setSimulationResult] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const resultRef = useRef(null);

  const { scenarioName, revenueChange, expenseChange, investment } = formData;

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!scenarioName.trim()) {
      tempErrors.scenarioName = 'Scenario name is required';
      isValid = false;
    }

    if (revenueChange === '') {
      tempErrors.revenueChange = 'Revenue change is required';
      isValid = false;
    } else if (isNaN(revenueChange) || Number(revenueChange) < -100 || Number(revenueChange) > 100) {
      tempErrors.revenueChange = 'Value must be between -100% and 100%';
      isValid = false;
    }

    if (expenseChange === '') {
      tempErrors.expenseChange = 'Expense change is required';
      isValid = false;
    } else if (isNaN(expenseChange) || Number(expenseChange) < 0) {
      tempErrors.expenseChange = 'Positive value is required';
      isValid = false;
    }

    if (investment === '') {
      tempErrors.investment = 'Investment is required';
      isValid = false;
    } else if (isNaN(investment) || Number(investment) < 0) {
      tempErrors.investment = 'Positive value is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/simulations/simulate', {
        name: scenarioName,
        revenueChange: Number(revenueChange),
        expenseChange: Number(expenseChange),
        investment: Number(investment),
      });

      setSimulationResult(res.data);
      setShowForm(false);

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Simulation completed successfully!',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Simulation error:', error.response ? error.response.data : error.message);
      toast.error(
        error.response ? error.response.data.message : 'Simulation failed. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
 );
    }
  };

  const chartData = simulationResult
    ? [
        {
          name: 'Current',
          revenues: simulationResult.current.revenues,
          expenses: simulationResult.current.expenses,
          cashFlow: simulationResult.current.cashFlow,
        },
        {
          name: 'Simulated',
          revenues: simulationResult.simulated.revenues,
          expenses: simulationResult.simulated.expenses,
          cashFlow: simulationResult.simulated.cashFlow,
        },
      ]
    : [];

  const downloadPNG = () => {
    const exportElement = document.getElementById('export-area');
    if (exportElement) {
      html2canvas(exportElement, { scale: 3 }).then((canvas) => {
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
      html2canvas(exportElement, { scale: 3 }).then((canvas) => {
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
    setFormData({
      scenarioName: '',
      revenueChange: '',
      expenseChange: '',
      investment: '',
    });
    setErrors({});
    setSimulationResult(null);
  };
 
  return ( <MasterLayout>
    <div className="container my-5">
      <h3 className="text-center mb-4 text-primary fw-bold">Financial Simulation</h3>

      {showForm ? (
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0 flex items-center gap-2">
                <Icon icon="solar:calculator-linear" /> Run a Simulation
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSimulate}>
                <div className="row gy-3">
                  <div className="col-12">
                    <label className="form-label">Scenario Name</label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:tag-linear" />
                      </span>
                      <input
                        type="text"
                        name="scenarioName"
                        className={`form-control ${errors.scenarioName ? 'is-invalid' : ''}`}
                        placeholder="Enter scenario name"
                        value={scenarioName}
                        onChange={onChange}
                      />
                      {errors.scenarioName && (
                        <div className="invalid-feedback">{errors.scenarioName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Revenue Change (%)</label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:chart-linear" />
                      </span>
                      <input
                        type="number"
                        name="revenueChange"
                        className={`form-control ${errors.revenueChange ? 'is-invalid' : ''}`}
                        placeholder="Enter revenue change"
                        value={revenueChange}
                        onChange={onChange}
                      />
                      {errors.revenueChange && (
                        <div className="invalid-feedback">{errors.revenueChange}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Expense Change (TND)</label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:money-bag-linear" />
                      </span>
                      <input
                        type="number"
                        name="expenseChange"
                        className={`form-control ${errors.expenseChange ? 'is-invalid' : ''}`}
                        placeholder="Enter expense change"
                        value={expenseChange}
                        onChange={onChange}
                      />
                      {errors.expenseChange && (
                        <div className="invalid-feedback">{errors.expenseChange}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Investment (TND)</label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:wallet-money-linear" />
                      </span>
                      <input
                        type="number"
                        name="investment"
                        className={`form-control ${errors.investment ? 'is-invalid' : ''}`}
                        placeholder="Enter investment amount"
                        value={investment}
                        onChange={onChange}
                      />
                      {errors.investment && (
                        <div className="invalid-feedback">{errors.investment}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 flex gap-3">
                    <button type="submit" className="btn btn-primary-600 w-50">
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          scenarioName: '',
                          revenueChange: '',
                          expenseChange: '',
                          investment: '',
                        });
                        setErrors({});
                      }}
                      className="btn btn-secondary w-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            id="export-area"
            style={{
              padding: '30px',
              backgroundColor: '#fff',
              fontFamily: 'Arial, sans-serif',
              boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              margin: '0 auto',
              maxWidth: '900px',
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <img
                src="images/finova-logo.png"
                alt="Finova Logo"
                style={{ height: 60, marginRight: 16 }}
              />
              <h5 className="fw-bold">Finova</h5>
            </div>

            <h6 className="text-center mb-3 text-primary fw-bold">
              Simulation Results: {scenarioName}
            </h6>
            <hr />
            <div className="mb-3" style={{ fontSize: '16px' }}>
              <p>
                <strong>Scenario Name:</strong> {scenarioName}
              </p>
              <p>
                <strong>Revenue Change:</strong> {revenueChange} %
              </p>
              <p>
                <strong>Expense Change:</strong> {expenseChange} TND
              </p>
              <p>
                <strong>Investment:</strong> {investment} TND
              </p>
            </div>

            <div className="d-flex justify-content-center">
              <LineChart width={700} height={400} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenues"
                  stroke="#1976d2"
                  name="Revenues"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff9800"
                  name="Expenses"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cashFlow"
                  stroke="#4caf50"
                  name="Cash Flow"
                  strokeWidth={2}
                />
              </LineChart>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <button onClick={downloadPNG} className="btn btn-outline-primary">
              Download PNG
            </button>
            <button onClick={downloadPDF} className="btn btn-outline-primary">
              Download PDF
            </button>
            <button onClick={handleBackToForm} className="btn btn-secondary">
              New Simulation
            </button>
          </div>
        </>
      )}
    </div>
    </MasterLayout>
  );
};

export default FinancialSimulation;