import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { format } from "date-fns";
import { FaTrash, FaExchangeAlt, FaFilter, FaTable, FaWallet, FaQrcode, FaPrint } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCodeGenerator from "qrcode";
import { QRCode } from "react-qr-code";
import PaymentModal from "../stripe/PaymentFromExpress"; // Importer le composant PaymentModal
import "./CompteBancaireTable.css";
import { Dialog } from '@mui/material';
import Modal from '@mui/material/Modal';


const CompteBancaireTable = ({ userId, refresh, onRefresh }) => {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // État pour la modale de paiement
  const [filterText, setFilterText] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

  const fetchComptes = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/compteBancaire/all/${userId}`);
      setComptes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des comptes");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchComptes();
  }, [fetchComptes, refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce compte ?")) {
      try {
        await axios.delete(`http://localhost:5001/compteBancaire/${id}`);
        toast.success("Compte supprimé avec succès");
        onRefresh();
      } catch (error) {
        toast.error("Erreur lors de la suppression du compte");
      }
    }
  };

  const openQrModal = (compte) => {
    setSelectedCompte(compte);
    setIsQrModalOpen(true);
  };

  const handleTransactionClick = (numeroCompte) => {
    if (!numeroCompte || !userId) {
      console.error("Numéro de compte ou userId manquant");
      toast.error("Impossible d'effectuer la transaction : informations manquantes");
      return;
    }

    console.log("Redirection vers /add-transaction avec :", { userId, numeroCompte });
    navigate("/add-transaction", {
      state: {
        sourceAccount: numeroCompte,
        userId: userId,
      },
    });
  };

  const handlePrintPDF = (compte) => {
    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;

    // En-tête
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Account Statement", margin, yPos);
    yPos += 10;

    // Date d'impression
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, margin, yPos);
    yPos += 15;

    // Tableau des informations
    autoTable(doc, {
      startY: yPos,
      head: [["Account Number", "Creation Date", "Last Update", "Balance"]],
      body: [
        [
          compte.numeroCompte,
          format(new Date(compte.createdAt), "dd/MM/yyyy"),
          format(new Date(compte.updatedAt), "dd/MM/yyyy"),
          `${compte.balance} TND`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { font: "helvetica", fontSize: 12 },
    });

    // Générer le QR code en bas à droite
    const qrSize = 50; // Taille du QR code
    const qrData = JSON.stringify({
      account: compte.numeroCompte,
      balance: compte.balance,
      date: new Date().toISOString(),
    });

    // Création d'un canvas caché dans le DOM
    const canvas = document.createElement("canvas");
    canvas.width = qrSize * 4; // Augmenter la résolution
    canvas.height = qrSize * 4;
    document.body.appendChild(canvas);

    QRCodeGenerator.toCanvas(
      canvas,
      qrData,
      { width: qrSize * 4, margin: 2 }, // Augmenter la résolution et la marge
      (error) => {
        if (error) {
          console.error("Erreur QR code:", error);
          toast.error("Erreur génération QR code");
          return;
        }

        // Ajout au PDF en bas à droite
        const qrX = doc.internal.pageSize.width - margin - qrSize;
        const qrY = doc.internal.pageSize.height - margin - qrSize;
        doc.addImage(canvas, "PNG", qrX, qrY, qrSize, qrSize);

        // Nettoyage du canvas
        document.body.removeChild(canvas);

        // Pied de page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - margin - 30,
            doc.internal.pageSize.height - margin - 10
          );
        }

        // Sauvegarder le PDF
        doc.save(`account-statement-${compte.numeroCompte}.pdf`);
      }
    );
  };

  const filteredComptes = comptes.filter(
    (compte) =>
      compte.numeroCompte.toLowerCase().includes(filterText.toLowerCase()) ||
      compte.balance.toString().includes(filterText)
  );

  const columns = [
    { name: "Account Number", selector: (row) => row.numeroCompte, sortable: true, grow: 2 },
    { name: "Balance", selector: (row) => `${row.balance} TND`, sortable: true, grow: 1 },
    { name: "Creation Date", selector: (row) => format(new Date(row.createdAt), "dd/MM/yyyy"), sortable: true, grow: 1 },
    { name: "Last Update", selector: (row) => format(new Date(row.updatedAt), "dd/MM/yyyy"), sortable: true, grow: 1 },
    {
      name: "Actions",
      cell: (row) => (
        <div className="actions">
          <button onClick={() => handleDelete(row._id)} className="delete-button">
            <FaTrash />
          </button>
          <button
            onClick={() => handleTransactionClick(row.numeroCompte)}
            className="transfer-button"
          >
            <FaExchangeAlt />
          </button>
          <button onClick={() => openQrModal(row)} className="qr-button">
            <FaQrcode />
          </button>
          <button onClick={() => handlePrintPDF(row)} className="print-button">
            <FaPrint />
          </button>
        </div>
      ),
      grow: 2,
    },
  ];

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="compte-bancaire-container">
          <div className="compte-bancaire-content">
            
            <h2 className="compte-bancaire-title">💳 List of Bank Accounts</h2>
            <div className="toolbar">
              <div className="filter-container">
                <FaFilter className="filter-icon" />
                <input
                  type="text"
                  placeholder="Filtrer par N° Compte ou Solde..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <button onClick={() => setIsPaymentModalOpen(true)} className="btn btn-success">
              Load Balance
              </button>
              <button
                onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                className="view-toggle-button"
              >
                {viewMode === "table" ? <FaWallet className="view-icon" /> : <FaTable className="view-icon" />}
                {viewMode === "table" ? "Vue Wallet" : "Vue Tableau"}
              </button>
            </div>

            {loading ? (
              <p className="loading-message">Loading accounts...</p>
            ) : filteredComptes.length === 0 ? (
              <p className="no-data-message">No bank account found.</p>
            ) : viewMode === "table" ? (
              <DataTable
                columns={columns}
                data={filteredComptes}
                pagination
                highlightOnHover
                striped
                customStyles={{
                  headCells: {
                    style: {
                      backgroundColor: "#4F46E5",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontSize: "14px",
                    },
                  },
                  rows: {
                    style: {
                      backgroundColor: "#F3F4F6",
                      "&:hover": {
                        backgroundColor: "#E0E7FF",
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="cards-container">
                {filteredComptes.map((compte) => (
                  <div key={compte._id} className="card">
                    <div className="card-header">
                      <FaWallet className="wallet-icon" />
                      <h3 className="card-title">{compte.numeroCompte}</h3>
                    </div>
                    <p className="card-balance">Balance: {compte.balance} TND</p>
                    <p className="card-date">Creation {format(new Date(compte.createdAt), "dd/MM/yyyy")}</p>
                    <p className="card-date">Last update {format(new Date(compte.updatedAt), "dd/MM/yyyy")}</p>
                    <div className="card-actions">
                      <button onClick={() => handleTransactionClick(compte.numeroCompte)} className="transfer-button">
                        <FaExchangeAlt />
                      </button>
                      <button onClick={() => openQrModal(compte)} className="qr-button">
                        <FaQrcode />
                      </button>
                      <button onClick={() => handlePrintPDF(compte)} className="print-button">
                        <FaPrint />
                      </button>
                      <button onClick={() => handleDelete(compte._id)} className="delete-button">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isQrModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="modal-title">Informations du Compte</h3>
                  <div className="qr-code-container">
                    <QRCode
                      value={JSON.stringify(selectedCompte)}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>
                  <div className="modal-info">
                    <p><strong>N° Compte:</strong> {selectedCompte.numeroCompte}</p>
                    <p><strong>Solde:</strong> {selectedCompte.balance} TND</p>
                  </div>
                  <button onClick={() => setIsQrModalOpen(false)} className="close-button">
                    Fermer
                  </button>
                </div>
              </div>
            )}

<Dialog open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
<PaymentModal
userId={userId}
onClose={() => setIsPaymentModalOpen(false)}
onPaymentSuccess={() => {
  fetchComptes();
  toast.success("Paiement réussi !");
}}
/>
</Dialog>



          </div>
          
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
};

export default CompteBancaireTable;