import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { Button, Alert } from 'reactstrap';

const VoiceCommand = ({ onCommand }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Vérifie si le navigateur supporte la reconnaissance vocale
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      if (onCommand) {
        onCommand(result.toLowerCase());
      }
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale :', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onCommand]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const toggleListening = () => {
    if (!listening) {
      startListening();
    } else {
      stopListening();
    }
  };

  if (!browserSupported) {
    return (
      <Alert color="danger" className="m-3">
        Votre navigateur ne supporte pas la reconnaissance vocale.
      </Alert>
    );
  }

  return (
    <>
      <Button
        color={listening ? "danger" : "secondary"}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '100px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        }}
        onClick={toggleListening}
        title={listening ? "Arrêter la reconnaissance" : "Démarrer la reconnaissance"}
      >
        {listening ? <FaStop size={20} /> : <FaMicrophone size={20} />}
      </Button>

      {/* Affichage optionnel du transcript */}
      {transcript && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '100px',
            backgroundColor: '#fff',
            padding: '10px 15px',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            maxWidth: '300px',
            zIndex: 998,
          }}
        >
          <strong>Commande détectée :</strong>
          <p style={{ margin: 0, fontStyle: 'italic' }}>{transcript}</p>
        </div>
      )}
    </>
  );
};

export default VoiceCommand;
