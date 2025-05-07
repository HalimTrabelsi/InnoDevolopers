import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import axios from 'axios';

export default function TransactionCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/transactions/viewTransaction');
      const transactionEvents = data.map((transaction, index) => ({
        id: transaction._id,
        title: `#${index + 1} | $${transaction.amount.toFixed(2)}`,
        start: transaction.date,
        allDay: true,
        backgroundColor: transaction.type === 'credit' ? '#198754' : '#dc3545',
        borderColor: transaction.type === 'credit' ? '#198754' : '#dc3545',
        textColor: '#ffffff',
      }));

      setEvents(transactionEvents);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const renderEventContent = ({ event }) => (
    <div style={{ fontSize: '0.65rem', fontWeight: '400', textAlign: 'center' }}>
      {event.title}
    </div>
  );

  return (
    <div className="d-flex justify-content-center my-3">
      <div className="card shadow-sm p-2" style={{ width: '800px', maxWidth: '90%' }}>
        <h5 className="text-center mb-2" style={{ fontWeight: '500' }}>📅 Transactions</h5>
        <FullCalendar
          themeSystem="bootstrap5"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',  
            center: 'title',  
            right: 'dayGridMonth,timeGridWeek,timeGridDay',  
          }}
          height="600px"
          events={events}
          eventContent={renderEventContent}
          dayMaxEvents={1}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>
    </div>
  );
}
