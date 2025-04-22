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
          title: 'Anomalie détectée',
          text: message,
          confirmButtonColor: '#4CAF50',
        });
      }
      fetchRecords(); // Rafraîchir les données après validation
    });

    return () => socket.off('taxValidation');
  }, []);

  // Validation des champs avant soumission
  const validateInputs = () => {
    let tempErrors = {};
    let isValid = true;

    if (!userTax) {
      tempErrors.userTax = "La taxe est requise";
      isValid = false;
    } else if (isNaN(userTax) || parseFloat(userTax) <= 0) {
      tempErrors.userTax = "La taxe doit être un nombre positif";
      isValid = false;
    }

    if (consumption && (isNaN(consumption) || parseFloat(consumption) <= 0)) {
      tempErrors.consumption = "La consommation doit être un nombre positif";
      isValid = false;
    }

    setValidationErrors(tempErrors);
    return isValid;
  };

  const handleValidate = async (recordId, collection) => {
    const token = localStorage.getItem('token');
    if (!token) {
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
    console.log('Payload envoyé:', payload);

    Swal.fire({
      title: 'Confirmer la validation ?',
      text: 'Vérifiez que la taxe saisie est correcte.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Valider',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            'http://localhost:5001/api/taxRules/validate',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Réponse serveur:', response.data);
          if (response.data.isValid) {
            setRecords(
              records.map((r) =>
                r._id === recordId ? { ...r, isTaxValidated: true, taxCalculated: response.data.expectedTax } : r
              )
            );
            Swal.fire('Validé !', 'La taxe a été validée avec succès.', 'success');
            fetchRecords();
            setUserTax('');
            setConsumption('');
            setIsExport(false);
            setSelectedRecord(null);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur de validation',
              text: `La taxe saisie (${userTax}) est incorrecte. Taxe attendue : ${response.data.expectedTax}`,
              confirmButtonColor: '#4CAF50',
            });
          }
        } catch (error) {
          console.error('Erreur Axios (handleValidate):', error.response);
          toast.error(`Erreur : ${error.response?.data?.message || 'Validation échouée'}`);
        }
      }
    });
  };

  return (
    <div style={{ background: '#f0f2f5', padding: '20px', minHeight: '100vh' }}>
      <h2 style={{ color: '#333' }}>Validation Fiscale (Tunisie)</h2>

      {/* Section de validation fiscale */}
      <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Valider une Transaction</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Taxe Saisie (TND)
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
              placeholder="Saisir la taxe (ex. 19)"
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
              Consommation (kWh, si applicable)
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
              placeholder="Consommation (ex. 300)"
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
                  console.log('isExport mis à jour:', e.target.checked);
                }}
                style={{ marginRight: '5px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Exportation (IS 10%)</span>
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
              Valider
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des transactions */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#e0e0e0' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Catégorie</th>
            <th style={{ padding: '10px' }}>Montant</th>
            <th style={{ padding: '10px' }}>Type de Taxe</th>
            <th style={{ padding: '10px' }}>Statut</th>
            <th style={{ padding: '10px' }}>Taxe Calculée</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td style={{ padding: '10px' }}>{record._id}</td>
              <td style={{ padding: '10px' }}>{record.category}</td>
              <td style={{ padding: '10px' }}>{record.amount}</td>
              <td style={{ padding: '10px' }}>{record.taxType}</td>
              <td style={{ padding: '10px' }}>
                {record.isTaxValidated ? 'Validé' : 'Non validé'}
              </td>
              <td style={{ padding: '10px' }}>
                {record.taxCalculated ? `${record.taxCalculated} TND` : '-'}
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedRecord({ _id: record._id, collection: 'Transaction' });
                    console.log('selectedRecord mis à jour:', { _id: record._id, collection: 'Transaction' });
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
                  Sélectionner
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