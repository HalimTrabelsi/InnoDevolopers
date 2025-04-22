import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaImage, FaMicrophone, FaPaperclip } from 'react-icons/fa';

const API_KEY = "AIzaSyAIZt9fcnbLb633rGOhQ1ItYRTpFm9rH-g";

const GeminiChat = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Salut ! Je suis votre assistant Gemini. Posez-moi une question ou envoyez-moi une image/audio.", type: "text" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview({
        url: event.target.result,
        type: file.type.startsWith('image/') ? 'image' : 'audio',
        file
      });
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      reader.readAsDataURL(file);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setMediaPreview({
            url: audioUrl,
            type: 'audio',
            file: new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
          });
        };

        mediaRecorderRef.current.start();
      })
      .catch(err => {
        console.error("Erreur d'enregistrement:", err);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !mediaPreview) || loading) return;

    const userMessage = { 
      from: "user", 
      text: input,
      type: mediaPreview?.type || "text",
      mediaUrl: mediaPreview?.url
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setMediaPreview(null);
    setLoading(true);

    try {
      let prompt = input;
      if (mediaPreview) {
        prompt = mediaPreview.type === 'image' 
          ? `${input} (image jointe)` 
          : `${input} (audio joint)`;
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }], role: "user" }]
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erreur de l'API");

      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu générer de réponse.";
      setMessages(prev => [...prev, { from: "bot", text: botReply, type: "text" }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: `Erreur : ${err.message}`, type: "text" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaMessage = (message) => {
    if (message.type === 'image') {
      return <img src={message.mediaUrl} alt="User content" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '5px', borderRadius: '8px' }} />;
    } else if (message.type === 'audio') {
      return (
        <audio controls style={{ marginTop: '5px', width: '100%' }}>
          <source src={message.mediaUrl} type="audio/wav" />
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      );
    }
    return null;
  };

  return (
    <>
      {/* Floating Avatar Button */}
      {!open && (
        <button 
          onClick={() => setOpen(true)} 
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            border: 'none',
            borderRadius: '50%',
            width: 60,
            height: 60,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            zIndex: 9999,
            overflow: 'hidden',
            padding: 0,
            background: 'linear-gradient(135deg, #4285F4, #34A853)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 30,
          width: 350,
          maxHeight: '60vh',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: 12,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999
        }}>
          {/* Header with Avatar */}
          <div style={{
            padding: 10,
            backgroundColor: '#4285F4',
            color: 'white',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4285F4',
                fontWeight: 'bold'
              }}>
                G
              </div>
              <strong>Gemini</strong>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                fontSize: 18,
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: 10,
            overflowY: 'auto',
            backgroundColor: '#f5f5f5'
          }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  marginBottom: 10,
                  textAlign: msg.from === "bot" ? "left" : "right"
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: msg.from === "bot" ? "0 18px 18px 18px" : "18px 0 18px 18px",
                  backgroundColor: msg.from === "bot" ? "#e3f2fd" : "#4285F4",
                  color: msg.from === "bot" ? "#000" : "#fff",
                  maxWidth: "80%"
                }}>
                  <strong>{msg.from === "bot" ? "Gemini" : "Vous"}:</strong>
                  <div style={{ marginTop: 5 }}>{msg.text}</div>
                  {renderMediaMessage(msg)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                padding: "10px 15px",
                borderRadius: "0 18px 18px 18px",
                backgroundColor: "#e3f2fd",
                color: "#000",
                marginBottom: 12
              }}>
                <strong>Gemini:</strong>
                <div style={{ marginTop: 5 }}>Réfléchis...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div style={{
              padding: 10,
              backgroundColor: '#e3f2fd',
              borderTop: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {mediaPreview.type === 'image' ? (
                  <>
                    <FaImage />
                    <span>Image prête à envoyer</span>
                  </>
                ) : (
                  <>
                    <FaMicrophone />
                    <span>Audio prêt à envoyer</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setMediaPreview(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff4444',
                  cursor: 'pointer'
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div style={{ padding: 10, borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{
                  background: '#e3f2fd',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FaImage />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,audio/*"
                style={{ display: 'none' }}
              />
              
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  background: isRecording ? '#ff4444' : '#e3f2fd',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FaMicrophone />
              </button>
            </div>
            
            <div style={{ display: 'flex' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginRight: 5,
                  outline: 'none'
                }}
                disabled={loading}
              />
              <button 
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !mediaPreview)}
                style={{
                  backgroundColor: "#4285F4",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  opacity: (loading || (!input.trim() && !mediaPreview)) ? 0.6 : 1
                }}
              >
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;