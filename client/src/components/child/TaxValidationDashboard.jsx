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

<<<<<<< HEAD
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
=======
  // Chargement des transactions
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token utilisé:', token);
      if (!token) throw new Error('Aucun token trouvé');
      const response = await axios.get('http://localhost:5001/api/taxRules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Données transactions:', response.data);
      setRecords(response.data);
    } catch (error) {
      console.error('Erreur Axios (fetchRecords):', error.response);
      toast.error(`Erreur : ${error.response?.data?.message || 'Impossible de charger les transactions'}`);
>>>>>>> origin
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
<<<<<<< HEAD
          title: 'Anomaly Detected',
=======
          title: 'Anomalie détectée',
>>>>>>> origin
          text: message,
          confirmButtonColor: '#4CAF50',
        });
      }
<<<<<<< HEAD
      fetchRecords(); // Refresh data after validation
=======
      fetchRecords(); // Rafraîchir les données après validation
>>>>>>> origin
    });

    return () => socket.off('taxValidation');
  }, []);

<<<<<<< HEAD
  // Validate inputs before submission
=======
  // Validation des champs avant soumission
>>>>>>> origin
  const validateInputs = () => {
    let tempErrors = {};
    let isValid = true;

    if (!userTax) {
<<<<<<< HEAD
      tempErrors.userTax = 'Tax is required';
      isValid = false;
    } else if (isNaN(userTax) || parseFloat(userTax) <= 0) {
      tempErrors.userTax = 'Tax must be a positive number';
=======
      tempErrors.userTax = "La taxe est requise";
      isValid = false;
    } else if (isNaN(userTax) || parseFloat(userTax) <= 0) {
      tempErrors.userTax = "La taxe doit être un nombre positif";
>>>>>>> origin
      isValid = false;
    }

    if (consumption && (isNaN(consumption) || parseFloat(consumption) <= 0)) {
<<<<<<< HEAD
      tempErrors.consumption = 'Consumption must be a positive number';
=======
      tempErrors.consumption = "La consommation doit être un nombre positif";
>>>>>>> origin
      isValid = false;
    }

    setValidationErrors(tempErrors);
    return isValid;
  };

  const handleValidate = async (recordId, collection) => {
    const token = localStorage.getItem('token');
    if (!token) {
<<<<<<< HEAD
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
=======
      toast.error('Aucun token trouvé. Veuillez vous connecter.');
      return;
    }
    if (!recordId || !collection) {
      toast.error('Aucun enregistrement sélectionné.');
      return;
    }

    // Valider les champs avant envoi
    if (!validateInputs()) {
      toast.error("Veuillez corriger les erreurs avant de valider");
>>>>>>> origin
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
<<<<<<< HEAD
    console.log('Payload sent:', payload);

    Swal.fire({
      title: 'Confirm Validation?',
      text: 'Please ensure the entered tax is correct.',
=======
    console.log('Payload envoyé:', payload);

    Swal.fire({
      title: 'Confirmer la validation ?',
      text: 'Vérifiez que la taxe saisie est correcte.',
>>>>>>> origin
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
<<<<<<< HEAD
      confirmButtonText: 'Validate',
      cancelButtonText: 'Cancel',
=======
      confirmButtonText: 'Valider',
>>>>>>> origin
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            'http://localhost:5001/api/taxRules/validate',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
<<<<<<< HEAD
          console.log('Server response:', response.data);
=======
          console.log('Réponse serveur:', response.data);
>>>>>>> origin
          if (response.data.isValid) {
            setRecords(
              records.map((r) =>
                r._id === recordId ? { ...r, isTaxValidated: true, taxCalculated: response.data.expectedTax } : r
              )
            );
<<<<<<< HEAD
            Swal.fire('Validated!', 'The tax has been successfully validated.', 'success');
=======
            Swal.fire('Validé !', 'La taxe a été validée avec succès.', 'success');
>>>>>>> origin
            fetchRecords();
            setUserTax('');
            setConsumption('');
            setIsExport(false);
            setSelectedRecord(null);
          } else {
            Swal.fire({
              icon: 'error',
<<<<<<< HEAD
              title: 'Validation Error',
              text: `The entered tax (${userTax}) is incorrect. Expected tax: ${response.data.expectedTax}`,
=======
              title: 'Erreur de validation',
              text: `La taxe saisie (${userTax}) est incorrecte. Taxe attendue : ${response.data.expectedTax}`,
>>>>>>> origin
              confirmButtonColor: '#4CAF50',
            });
          }
        } catch (error) {
<<<<<<< HEAD
          console.error('Axios error (handleValidate):', error.response);
          toast.error(`Error: ${error.response?.data?.message || 'Validation failed'}`);
=======
          console.error('Erreur Axios (handleValidate):', error.response);
          toast.error(`Erreur : ${error.response?.data?.message || 'Validation échouée'}`);
>>>>>>> origin
        }
      }
    });
  };

  return (
    <div style={{ background: '#f0f2f5', padding: '20px', minHeight: '100vh' }}>
<<<<<<< HEAD
      <h2 style={{ color: '#333' }}>Tax Validation</h2>

      {/* Tax Validation Section */}
      <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Validate a Transaction</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Entered Tax (TND)
=======
      <h2 style={{ color: '#333' }}>Validation Fiscale (Tunisie)</h2>

      {/* Section de validation fiscale */}
      <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Valider une Transaction</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Taxe Saisie (TND)
>>>>>>> origin
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
<<<<<<< HEAD
              placeholder="Enter tax (e.g., 19)"
=======
              placeholder="Saisir la taxe (ex. 19)"
>>>>>>> origin
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
<<<<<<< HEAD
              Consumption (kWh, if applicable)
=======
              Consommation (kWh, si applicable)
>>>>>>> origin
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
<<<<<<< HEAD
              placeholder="Consumption (e.g., 300)"
=======
              placeholder="Consommation (ex. 300)"
>>>>>>> origin
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
<<<<<<< HEAD
                  console.log('isExport updated:', e.target.checked);
                }}
                style={{ marginRight: '5px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Export (IS 10%)</span>
=======
                  console.log('isExport mis à jour:', e.target.checked);
                }}
                style={{ marginRight: '5px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Exportation (IS 10%)</span>
>>>>>>> origin
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
<<<<<<< HEAD
              Validate
=======
              Valider
>>>>>>> origin
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Transactions Table */}
=======
      {/* Tableau des transactions */}
>>>>>>> origin
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#e0e0e0' }}>
            <th style={{ padding: '10px' }}>ID</th>
<<<<<<< HEAD
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Amount</th>
            <th style={{ padding: '10px' }}>Tax Type</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Calculated Tax</th>
=======
            <th style={{ padding: '10px' }}>Catégorie</th>
            <th style={{ padding: '10px' }}>Montant</th>
            <th style={{ padding: '10px' }}>Type de Taxe</th>
            <th style={{ padding: '10px' }}>Statut</th>
            <th style={{ padding: '10px' }}>Taxe Calculée</th>
>>>>>>> origin
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
<<<<<<< HEAD
            <tr
              key={record._id}
              style={{
                background: selectedRecord?._id === record._id ? '#e3f2fd' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
=======
            <tr key={record._id}>
>>>>>>> origin
              <td style={{ padding: '10px' }}>{record._id}</td>
              <td style={{ padding: '10px' }}>{record.category}</td>
              <td style={{ padding: '10px' }}>{record.amount}</td>
              <td style={{ padding: '10px' }}>{record.taxType}</td>
              <td style={{ padding: '10px' }}>
<<<<<<< HEAD
                {record.isTaxValidated ? 'Validated' : 'Not Validated'}
=======
                {record.isTaxValidated ? 'Validé' : 'Non validé'}
>>>>>>> origin
              </td>
              <td style={{ padding: '10px' }}>
                {record.taxCalculated ? `${record.taxCalculated} TND` : '-'}
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedRecord({ _id: record._id, collection: 'Transaction' });
<<<<<<< HEAD
                    console.log('selectedRecord updated:', { _id: record._id, collection: 'Transaction' });
=======
                    console.log('selectedRecord mis à jour:', { _id: record._id, collection: 'Transaction' });
>>>>>>> origin
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
<<<<<<< HEAD
                  Select
=======
                  Sélectionner
>>>>>>> origin
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