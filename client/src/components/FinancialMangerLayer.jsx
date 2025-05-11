import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import InputFormWithF from './child/InputFormWithF';
import UnitCountTwo from './child/UnitCountTwo';
import LastTransactionAcc from './child/LastTransactionAcc';
import Tax from './Tax.jsx';
import FinancialTrends from './FinancialTrends';
import FinancialSimulation from './FinancialSimulation';

const socket = io('http://localhost:5001', { withCredentials: true });

const styles = {
  section: {
    padding: '20px',
    position: 'relative',
    minHeight: '80vh',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  paginationPages: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  paginationBtn: (active) => ({
    padding: '8px 14px',
    fontSize: '14px',
    borderRadius: '20px',
    border: active ? '1px solid #007bff' : '1px solid #ccc',
    backgroundColor: active ? '#007bff' : '#f8f8f8',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
    transition: 'all 0.3s',
  }),
  paginationNav: {
    padding: '8px 14px',
    fontSize: '14px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  paginationNavDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  paginationEllipsis: {
    padding: '0 6px',
    fontSize: '16px',
  },
};

const FinancialMangerLayer = () => {
  const [notification, setNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Comme dans AccountantDashboardLayer

  useEffect(() => {
    socket.on('approvalStatus', (message) => {
      console.log('FinancialManger received approvalStatus:', message);
      setNotification(message);
    });

    return () => {
      socket.off('approvalStatus');
    };
  }, []);

  const dashboardItems = [
    <InputFormWithF key="input-form" />,
    <UnitCountTwo key="unit-count" />,
    <LastTransactionAcc
      key="last-transaction"
      showActions={false}
      title="Approval History"
      setNotification={setNotification}
    />,
    <Tax key="tax" />,
    <FinancialTrends key="financial-trends" />,
    <FinancialSimulation key="financial-simulation" />,
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dashboardItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dashboardItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button key="first" onClick={() => paginate(1)} style={styles.paginationBtn(false)}>
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis" style={styles.paginationEllipsis}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          style={styles.paginationBtn(currentPage === i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis" style={styles.paginationEllipsis}>...</span>);
      }
      pageNumbers.push(
        <button key="last" onClick={() => paginate(totalPages)} style={styles.paginationBtn(false)}>
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <section style={styles.section} className="row gy-4">
      <div style={styles.grid}>{currentItems}</div>

      <div style={styles.paginationContainer}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.paginationNav,
            ...(currentPage === 1 ? styles.paginationNavDisabled : {}),
          }}
        >
          ◀ Précédent
        </button>

        <div style={styles.paginationPages}>{renderPageNumbers()}</div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.paginationNav,
            ...(currentPage === totalPages ? styles.paginationNavDisabled : {}),
          }}
        >
          Suivant ▶
        </button>
      </div>
    </section>
  );
};

export default FinancialMangerLayer;