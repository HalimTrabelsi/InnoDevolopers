
import React, { useState } from 'react';
import axios from 'axios';

const AddDeadlineForm = ({ onAdd }) => {
const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Validate inputs 
    if (!title || !date || !message) {
      setError("All fields are required");
      return;
    }

    // Prepare the new deadline object to send in the POST request
    const newDeadline = {
      title,
      date,
      message,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/tax-deadlines', newDeadline, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        alert('Deadline created successfully');
        // Optionally, reset the form
        setTitle('');
        setDate('');
        setMessage('');
      }
    } catch (error) {
      console.error("Error creating deadline:", error);
      setError("An error occurred while creating the deadline");
    }
  };

  return (
    <div>
      <h2>Create New Tax Deadline</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Deadline Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Add Deadline</button>
      </form>
    </div>
  );
};

export default AddDeadlineForm;

