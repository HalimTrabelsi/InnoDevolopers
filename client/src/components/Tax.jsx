import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tax = () => {
  const [overdueInvoices, setOverdueInvoices] = useState([]);

  // Load transactions and identify overdue invoices
  const fetchOverdueInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token used:', token);
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:5001/api/taxRules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Transaction data:', response.data);

      const currentDate = new Date();
      const overdue = response.data
        .map((record) => {
          const dueDate = new Date(record.date);
          dueDate.setDate(dueDate.getDate() + 1);
          const isOverdue = currentDate > dueDate && !record.isTaxValidated;
          if (isOverdue) {
            const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
            return { ...record, daysOverdue };
          }
          return null;
        })
        .filter((record) => record !== null);

      setOverdueInvoices(overdue);
    } catch (error) {
      console.error('Axios error (fetchOverdueInvoices):', error.response);
      toast.error(`Error: ${error.response?.data?.message || 'Failed to load overdue invoices'}`);
    }
  };

  useEffect(() => {
    fetchOverdueInvoices();
  }, []);

  return (
    <div style={{ background: '#f0f2f5', padding: '20px', minHeight: '100vh' }}>
      {/* Overdue Invoices Section */}
      <div style={{ background: '#fff', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Overdue Invoices</h3>
        {overdueInvoices.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#ffcccc' }}>
                <th style={{ padding: '10px' }}>Transaction ID</th>
                <th style={{ padding: '10px' }}>Amount (TND)</th>
                <th style={{ padding: '10px' }}>Transaction Date</th>
                <th style={{ padding: '10px' }}>Due Date</th>
                <th style={{ padding: '10px' }}>Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {overdueInvoices.map((invoice) => {
                const dueDate = new Date(invoice.date);
                dueDate.setDate(dueDate.getDate() + 1);
                return (
                  <tr key={invoice._id}>
                    <td style={{ padding: '10px' }}>{invoice._id}</td>
                    <td style={{ padding: '10px' }}>{invoice.amount}</td>
                    <td style={{ padding: '10px' }}>{new Date(invoice.date).toLocaleDateString('en-US')}</td>
                    <td style={{ padding: '10px' }}>{dueDate.toLocaleDateString('en-US')}</td>
                    <td style={{ padding: '10px', color: '#dc3545' }}>{invoice.daysOverdue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#666' }}>No overdue invoices at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Tax;