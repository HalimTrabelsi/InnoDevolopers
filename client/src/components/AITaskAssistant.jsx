import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AITaskAssistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/tasks/ai/assist',
        { query: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatHistory(prev => [...prev, { role: 'ai', text: response.data.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '❌ Unable to process your request.' }]);
    }

    setMessage('');
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <button style={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : '💬 AI Assistant'}
      </button>

      {isOpen && (
        <div style={styles.chatBox}>
          {/* Header */}
          <div style={styles.header}>
            <span>🤖 AI Task Assistant</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>×</button>
          </div>

          {/* Chat Content */}
          <div style={styles.chatContent} ref={chatContainerRef}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '8px' }}>
                  <div style={{ ...styles.avatar, backgroundColor: msg.role === 'user' ? '#007BFF' : '#28a745' }}></div>
                  <div style={{
                    ...styles.messageBubble,
                    backgroundColor: msg.role === 'user' ? '#007BFF' : '#28a745',
                    color: 'white',
                    textAlign: 'left'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ marginBottom: '10px', color: '#28a745' }}>Typing...</div>
            )}
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your question..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              style={styles.input}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              style={{ ...styles.sendButton, backgroundColor: loading ? '#ccc' : '#007BFF' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  chatBox: {
    width: '350px',
    height: '500px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
  },
  chatContent: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  messageBubble: {
    padding: '10px',
    borderRadius: '12px',
    maxWidth: '220px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  inputArea: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    padding: '10px',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  sendButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default AITaskAssistant;
