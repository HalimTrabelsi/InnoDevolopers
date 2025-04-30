import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';

const socket = io('http://localhost:5001');

const TaxValidationDashboard = () => {
  const [records, setRecords] = useState([]);
  const [userTax, setUserTax] = useState('');
  const [consumption, setConsumption] = useState('');
  const [isExport, setIsExport] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    userTax: '',
    consumption: '',
  });

  // Load transactions
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token used:', token);
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:5001/api/taxRules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Transaction data:', response.data);
      setRecords(response.data);
    } catch (error) {
      console.error('Axios error (fetchRecords):', error.response);
      toast.error(`Error: ${error.response?.data?.message || 'Failed to load transactions'}`);
    }
  };

  useEffect(() => {
    fetchRecords();

    socket.on('taxValidation', ({ recordId, isValid, message }) => {
      toast(message, {
        position: 'top-right',
        theme: 'light',
        type: isValid ? 'success' : 'error',
      });
      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Anomaly Detected',
          text: message,
          confirmButtonColor: '#4CAF50',
        });
      }
      fetchRecords(); // Refresh data after validation
    });

    return () => socket.off('taxValidation');
  }, []);

  // Validate inputs before submission
  const validateInputs = () => {
    let tempErrors = {};
    let isValid = true;

    if (!userTax) {
      tempErrors.userTax = 'Tax is required';
      isValid = false;
    } else if (isNaN(userTax) || parseFloat(userTax) <= 0) {
      tempErrors.userTax = 'Tax must be a positive number';
      isValid = false;
    }

    if (consumption && (isNaN(consumption) || parseFloat(consumption) <= 0)) {
      tempErrors.consumption = 'Consumption must be a positive number';
      isValid = false;
    }

    setValidationErrors(tempErrors);
    return isValid;
  };

  const handleValidate = async (recordId, collection) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }
    if (!recordId || !collection) {
      toast.error('No record selected.');
      return;
    }

    // Validate inputs before submission
    if (!validateInputs()) {
      toast.error('Please fix the errors before validating');
      return;
    }

    console.log('selectedRecord:', selectedRecord);
    const payload = {
      recordId,
      collection,
      userTax: parseFloat(userTax) || 0,
      consumption: consumption ? parseFloat(consumption) : null,
      isExport,
    };
    console.log('Payload sent:', payload);

    Swal.fire({
      title: 'Confirm Validation?',
      text: 'Please ensure the entered tax is correct.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Validate',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            'http://localhost:5001/api/taxRules/validate',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Server response:', response.data);
          if (response.data.isValid) {
            setRecords(
              records.map((r) =>
                r._id === recordId ? { ...r, isTaxValidated: true, taxCalculated: response.data.expectedTax } : r
              )
            );
            Swal.fire('Validated!', 'The tax has been successfully validated.', 'success');
            fetchRecords();
            setUserTax('');
            setConsumption('');
            setIsExport(false);
            setSelectedRecord(null);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: `The entered tax (${userTax}) is incorrect. Expected tax: ${response.data.expectedTax}`,
              confirmButtonColor: '#4CAF50',
            });
          }
        } catch (error) {
          console.error('Axios error (handleValidate):', error.response);
          toast.error(`Error: ${error.response?.data?.message || 'Validation failed'}`);
        }
      }
    });
  };

  return (
    <div style={{ background: '#f0f2f5', padding: '20px', minHeight: '100vh' }}>
      <h2 style={{ color: '#333' }}>Tax Validation</h2>

      {/* Tax Validation Section */}
      <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Validate a Transaction</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Entered Tax (TND)
            </label>
            <input
              type="number"
              step="0.01"
              value={userTax}
              onChange={(e) => {
                setUserTax(e.target.value);
                if (validationErrors.userTax) {
                  setValidationErrors({ ...validationErrors, userTax: '' });
                }
              }}
              placeholder="Enter tax (e.g., 19)"
              style={{
                padding: '10px',
                border: validationErrors.userTax ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                background: '#fff',
              }}
            />
            {validationErrors.userTax && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {validationErrors.userTax}
              </div>
            )}
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Consumption (kWh, if applicable)
            </label>
            <input
              type="number"
              value={consumption}
              onChange={(e) => {
                setConsumption(e.target.value);
                if (validationErrors.consumption) {
                  setValidationErrors({ ...validationErrors, consumption: '' });
                }
              }}
              placeholder="Consumption (e.g., 300)"
              style={{
                padding: '10px',
                border: validationErrors.consumption ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                background: '#fff',
              }}
            />
            {validationErrors.consumption && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {validationErrors.consumption}
              </div>
            )}
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
              <input
                type="checkbox"
                checked={isExport}
                onChange={(e) => {
                  setIsExport(e.target.checked);
                  console.log('isExport updated:', e.target.checked);
                }}
                style={{ marginRight: '5px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Export (IS 10%)</span>
            </label>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <button
              onClick={() => handleValidate(selectedRecord?._id, selectedRecord?.collection)}
              disabled={!selectedRecord}
              style={{
                padding: '10px 20px',
                background: selectedRecord ? '#4CAF50' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedRecord ? 'pointer' : 'not-allowed',
                width: '100%',
              }}
            >
              Validate
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#e0e0e0' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Amount</th>
            <th style={{ padding: '10px' }}>Tax Type</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Calculated Tax</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record._id}
              style={{
                background: selectedRecord?._id === record._id ? '#e3f2fd' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <td style={{ padding: '10px' }}>{record._id}</td>
              <td style={{ padding: '10px' }}>{record.category}</td>
              <td style={{ padding: '10px' }}>{record.amount}</td>
              <td style={{ padding: '10px' }}>{record.taxType}</td>
              <td style={{ padding: '10px' }}>
                {record.isTaxValidated ? 'Validated' : 'Not Validated'}
              </td>
              <td style={{ padding: '10px' }}>
                {record.taxCalculated ? `${record.taxCalculated} TND` : '-'}
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedRecord({ _id: record._id, collection: 'Transaction' });
                    console.log('selectedRecord updated:', { _id: record._id, collection: 'Transaction' });
                  }}
                  style={{
                    padding: '5px 10px',
                    background: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaxValidationDashboard;