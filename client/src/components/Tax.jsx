import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tax = () => {
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre de factures par page, comme dans LastTransactionAcc

  // Load transactions and identify overdue invoices
  const fetchOverdueInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token used:', token);
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:5001/api/taxRules', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      console.log('Transaction data:', response.data);

      const currentDate = new Date();
      const overdue = response.data
        .map((record) => {
          const dueDate = new Date(record.date);
          dueDate.setDate(dueDate.getDate() + 1);
          const isOverdue = currentDate > dueDate && !record.isTaxValidated;
          if (isOverdue) {
            const daysOverdue = Math.floor(
              (currentDate - dueDate) / (1000 * 60 * 60 * 24)
            );
            return { ...record, daysOverdue };
          }
          return null;
        })
        .filter((record) => record !== null);

      setOverdueInvoices(overdue);
    } catch (error) {
      console.error('Axios error (fetchOverdueInvoices):', error.response);
      toast.error(
        `Error: ${error.response?.data?.message || 'Failed to load overdue invoices'}`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  useEffect(() => {
    fetchOverdueInvoices();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(overdueInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = overdueInvoices.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Overdue Invoices</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Amount (TND)</th>
                  <th scope="col">Transaction Date</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Days Overdue</th>
                  <th scope="col" className="text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => {
                    const dueDate = new Date(invoice.date);
                    dueDate.setDate(dueDate.getDate() + 1);
                    return (
                      <tr key={invoice._id}>
                        <td>{invoice._id}</td>
                        <td>{invoice.amount}</td>
                        <td>{new Date(invoice.date).toLocaleDateString('en-US')}</td>
                        <td>{dueDate.toLocaleDateString('en-US')}</td>
                        <td>{invoice.daysOverdue}</td>
                        <td className="text-center">
                          <span className="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm">
                            Overdue
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary-light">
                      No overdue invoices at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination comme dans LastTransactionAcc */}
          {overdueInvoices.length > itemsPerPage && (
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

export default Tax;