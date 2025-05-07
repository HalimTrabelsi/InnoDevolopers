import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap'; // Ensure you install bootstrap

export default function TransactionCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        extendedProps: {
          ...transaction,
        }
      }));

      setEvents(transactionEvents);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventContent = ({ event }) => (
    <div style={{ fontSize: '0.65rem', fontWeight: '400', textAlign: 'center' }}>
      {event.title}
    </div>
  );

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="d-flex justify-content-center my-3">
      <div className="card shadow-sm p-3" style={{ width: '800px', maxWidth: '90%' }}>
        <h5 className="text-center mb-3" style={{ fontWeight: '500' }}>📅 Transactions</h5>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
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
            eventClick={handleEventClick}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
          />
        )}

        {/* Modal for event details */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <>
                <p><strong>Amount:</strong> ${selectedEvent.extendedProps.amount.toFixed(2)}</p>
                <p><strong>Type:</strong> {selectedEvent.extendedProps.type}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.extendedProps.date).toLocaleString()}</p>
                <p><strong>Description:</strong> {selectedEvent.extendedProps.description || 'N/A'}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
