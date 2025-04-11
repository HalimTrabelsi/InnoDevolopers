import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaEye, FaTimes } from 'react-icons/fa';
import QRCode from 'react-qr-code';

// Initialisation de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionsTable = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [view, setView] = useState('table');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Charger les transactions depuis l'API
  useEffect(() => {
    axios.get(`http://localhost:5001/transaction/transactions/67ce6e61e991a44fb4bfe596`)
      .then(response => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      })
      .catch(error => console.error('Erreur transactions:', error));
  }, [userId]);

  // Bascule entre le tableau et les statistiques
  const toggleView = () => {
    setView(view === 'table' ? 'stat' : 'table');
  };

  // Ouvrir le modal avec les détails de la transaction
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
  };

  const columns = [
    { name: 'Montant', selector: row => `${row.amount} TND`, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Type', selector: row => row.type === 'debit' ? 'Débit 💸' : 'Crédit 💰', sortable: true },
    { name: 'Date', selector: row => new Date(row.date).toLocaleDateString(), sortable: true },
    { name: 'Anomalie', selector: row => row.anomalie ? 'Oui' : 'Non', sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <button 
          className="details-btn"
          onClick={() => openTransactionDetails(row)}
          title="Voir détails"
        >
          <FaEye />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const chartData = {
    labels: transactions.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Montant des Transactions',
        data: transactions.map(t => t.amount),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="transaction-container">
      <button onClick={toggleView} className="view-toggle-btn">
        {view === 'table' ? 'Afficher les statistiques' : 'Afficher le tableau'}
      </button>

      {view === 'table' ? (
        <DataTable
          title="Transactions de l'utilisateur"
          columns={columns}
          data={filteredTransactions}
          pagination
          highlightOnHover
          responsive
          defaultSortFieldId="date"
          defaultSortAsc={false}
          className="transaction-table"
        />
      ) : (
        <div>
          <h2>Statistiques des Transactions</h2>
          <Line data={chartData} />
        </div>
      )}

      {/* Modal de détails de transaction */}
      {showModal && selectedTransaction && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">Détails de la Transaction</h3>
        <button className="close-btn" onClick={closeModal}>
          <FaTimes />
        </button>
      </div>
      
      <div className="modal-body">
        <div className="transaction-info">
          <div className="transaction-details">
            <div className="detail-item">
              <div className="detail-label">ID Transaction</div>
              <div className="detail-value">{selectedTransaction._id}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Montant</div>
              <div className="detail-value">{selectedTransaction.amount} TND</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Type</div>
              <div className="detail-value">
                {selectedTransaction.type === 'debit' ? 'Débit' : 'Crédit'}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Date</div>
              <div className="detail-value">
                {new Date(selectedTransaction.date).toLocaleString()}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Description</div>
              <div className="detail-value">{selectedTransaction.description}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Anomalie</div>
              <div className={`detail-value ${selectedTransaction.anomalie ? 'anomalie-true' : 'anomalie-false'}`}>
                {selectedTransaction.anomalie ? 'Oui' : 'Non'}
              </div>
            </div>
            
            {selectedTransaction.anomalie && (
              <div className="detail-item">
                <div className="detail-label">Commentaire Anomalie</div>
                <div className="detail-value">
                  {selectedTransaction.commentaireAnomalie || 'Aucun commentaire'}
                </div>
              </div>
            )}
            
            <div className="detail-item">
              <div className="detail-label">Compte Source</div>
              <div className="detail-value">
                {accounts[selectedTransaction.compteBancaire]?.numeroCompte || 'Inconnu'}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Destinataire</div>
              <div className="detail-value">
                {accounts[selectedTransaction.recipient]?.name || 'Inconnu'}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Localisation</div>
              <div className="detail-value">
                {selectedTransaction.location || 'Non spécifiée'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="qr-sidebar">
          <h4 className="qr-title">QR Code de Transaction</h4>
          <div className="qr-container">
            <QRCode 
              value={JSON.stringify({
                id: selectedTransaction._id,
                amount: selectedTransaction.amount,
                date: selectedTransaction.date,
                type: selectedTransaction.type,
                from: accounts[selectedTransaction.compteBancaire]?.numeroCompte,
                to: accounts[selectedTransaction.recipient]?.name
              })}
              size={200}
            />
          </div>
          <p>Scannez ce code pour vérifier la transaction</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TransactionsTable; 
