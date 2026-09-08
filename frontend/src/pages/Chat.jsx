import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    content: "👋 Hey there! I'm your AI shopping assistant. Tell me — what are you looking for today?",
    type: 'text'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => 'chat_' + Math.random().toString(36).substr(2, 9));
  const [convoState, setConvoState] = useState(null);
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: userMessage.content })
      });
      
      const data = await res.json();
      
      setConvoState(data.state);

      if (data.action === 'SHOW_RECOMMENDATIONS') {
        const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: data.message, type: 'text' };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.recommendations && data.recommendations.length > 0) {
          const recsMsg = { id: Date.now() + 2, role: 'assistant', recommendations: data.recommendations, alternatives: data.alternatives, type: 'recommendations' };
          setMessages(prev => [...prev, recsMsg]);
        }
      } else {
        const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: data.message, type: 'text' };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again.", type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window glass-panel animate-slide-in">
        <header className="chat-header">
          <h2>AI Product Assistant ✨</h2>
          <p className="subtitle">Let's find the perfect product for you.</p>
        </header>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              {msg.type === 'text' && (
                <div className={`message bubble ${msg.role}`}>
                  {msg.content}
                </div>
              )}
              {msg.type === 'recommendations' && (
                <div className="recommendations-container">
                  <h3 className="rec-title">Top Recommendation</h3>
                  {msg.recommendations.map(rec => (
                    <div key={rec.id} className="rec-card glass-panel">
                      <div className="rec-header">
                        <h4>{rec.name}</h4>
                        <span className="price">₹{Number(rec.price).toLocaleString()}</span>
                      </div>
                      <p className="brand">{rec.brand}</p>
                      <div className="reasons">
                        {rec.matchReasons && rec.matchReasons.map((r, i) => (
                          <span key={i} className="reason-tag">✅ {r}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {msg.alternatives && msg.alternatives.length > 0 && (
                    <>
                      <h4 className="alt-title">Great Alternatives</h4>
                      <div className="alternatives-grid">
                        {msg.alternatives.map(alt => (
                          <div key={alt.id} className="alt-card glass-panel">
                            <h5>{alt.name}</h5>
                            <span className="price">₹{Number(alt.price).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message bubble assistant typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="chat-input"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="btn-primary send-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
