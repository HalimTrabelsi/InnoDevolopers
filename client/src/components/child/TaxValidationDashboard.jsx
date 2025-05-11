import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import { Icon } from "@iconify/react/dist/iconify.js";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      fetchRecords();
    });

    return () => socket.off('taxValidation');
  }, []);

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

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = records.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="col-lg-12">
      {/* Validation Form Card */}
      <div className="card shadow-none border bg-gradient-start-5 h-100 mb-4">
        <div className="card-body p-20">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="fw-medium text-primary-light mb-1">Validate a Transaction</p>
            </div>
            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
              <Icon icon="solar:calculator-bold" className="text-white text-2xl mb-0" />
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 mt-12">
            <div className="flex-1 min-w-[200px]">
              <label className="d-block mb-1 text-secondary-light">Entered Tax (TND)</label>
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
                className={`w-100 p-2 border ${validationErrors.userTax ? 'border-danger' : 'border-gray-300'} rounded`}
              />
              {validationErrors.userTax && (
                <div className="text-danger text-sm mt-1">{validationErrors.userTax}</div>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="d-block mb-1 text-secondary-light">Consumption (kWh, if applicable)</label>
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
                className={`w-100 p-2 border ${validationErrors.consumption ? 'border-danger' : 'border-gray-300'} rounded`}
              />
              {validationErrors.consumption && (
                <div className="text-danger text-sm mt-1">{validationErrors.consumption}</div>
              )}
            </div>
            <div className="flex-1 min-w-[200px] d-flex align-items-center">
              <label className="d-flex align-items-center text-secondary-light">
                <input
                  type="checkbox"
                  checked={isExport}
                  onChange={(e) => {
                    setIsExport(e.target.checked);
                    console.log('isExport updated:', e.target.checked);
                  }}
                  className="me-2"
                />
                <span className="fw-bold">Export (IS 10%)</span>
              </label>
            </div>
            <div className="flex-1 min-w-[200px]">
              <button
                onClick={() => handleValidate(selectedRecord?._id, selectedRecord?.collection)}
                disabled={!selectedRecord}
                className={`w-100 p-2 text-white rounded ${selectedRecord ? 'bg-success' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="card shadow-none border bg-gradient-start-5 h-100">
        <div className="card-body p-20">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="fw-medium text-primary-light mb-1">Tax Validation Records</p>
            </div>
            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
              <Icon icon="solar:document-text-bold" className="text-white text-2xl mb-0" />
            </div>
          </div>
          <div className="table-responsive mt-12">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col" className="fs-5">ID</th>
                  <th scope="col" className="fs-5">Category</th>
                  <th scope="col" className="fs-5">Amount</th>
                  <th scope="col" className="fs-5">Tax Type</th>
                  <th scope="col" className="fs-5 text-center">Status</th>
                  <th scope="col" className="fs-5">Calculated Tax</th>
                  <th scope="col" className="fs-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <tr
                      key={record._id}
                      className={`align-middle ${selectedRecord?._id === record._id ? 'bg-info-light' : ''}`}
                    >
                      <td className="text-lg text-secondary-light fw-semibold">{record._id}</td>
                      <td className="text-lg text-secondary-light fw-semibold">{record.category || 'N/A'}</td>
                      <td className="text-lg text-secondary-light fw-semibold">{record.amount || 'N/A'}</td>
                      <td className="text-lg text-secondary-light fw-semibold">{record.taxType || 'N/A'}</td>
                      <td className="text-center">
                        <span
                          className={`bg-${record.isTaxValidated ? 'success' : 'warning'}-focus text-${record.isTaxValidated ? 'success' : 'warning'}-main px-24 py-4 rounded-pill fw-medium text-sm`}
                        >
                          {record.isTaxValidated ? 'Validated' : 'Not Validated'}
                        </span>
                      </td>
                      <td className="text-lg text-secondary-light fw-semibold">
                        {record.taxCalculated ? `${record.taxCalculated} TND` : '-'}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedRecord({ _id: record._id, collection: 'Transaction' });
                            console.log('selectedRecord updated:', { _id: record._id, collection: 'Transaction' });
                          }}
                          className="btn btn-primary btn-sm px-3 py-2"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted fs-5 py-4">
                      No records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {records.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="btn btn-primary me-2"
              >
                Previous
              </button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="btn btn-primary ms-2"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxValidationDashboard;