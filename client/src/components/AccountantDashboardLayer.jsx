import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignStaticAcc from './child/CampaignStaticAcc';
import LastTransactionAcc from './child/LastTransactionAcc';
import UnitCountAcc from './child/UnitCountAcc';
import TaxValidation from './child/TaxValidationDashboard';
import PrioritizedTasks from './PrioritizedTasks';
import AITaskAssistant from './AITaskAssistant';

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
  assistantWrapper: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

const AccountantDashboardLayer = () => {
  const [notification, setNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    socket.on('newApproval', (message) => {
      console.log('newApproval:', message);
      setNotification(message);
    });

    return () => {
      socket.off('newApproval');
    };
  }, []);

  const dashboardItems = [
    <UnitCountAcc key="unit-count" />,
    <CampaignStaticAcc key="campaign-static" />,
    <LastTransactionAcc key="last-transaction" showActions={true} setNotification={setNotification} />,
    <TaxValidation key="tax-validation" setNotification={setNotification} />,
    <PrioritizedTasks key="prioritized-tasks" />,
    // AITaskAssistant est retiré de cette liste
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
    <>
      <section style={styles.section}>
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

      {/* Assistant positionné en bas centre de l'écran */}
      <div style={styles.assistantWrapper}>
        <AITaskAssistant />
      </div>
    </>
  );
};

export default AccountantDashboardLayer;
