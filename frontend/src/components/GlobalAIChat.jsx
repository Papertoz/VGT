import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, X } from 'lucide-react';

const TypingDots = () => (
  <div style={{ display: 'flex', gap: '0.3rem', padding: '0.5rem' }}>
    {[0, 1, 2].map(i => (
      <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-color)' }} />
    ))}
  </div>
);

const GlobalAIChat = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'I am your VGT AI Coach. Ask me anything about your workout, recovery, or nutrition.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.success ? data.response : 'Error. Please try again.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: 'var(--ai-sidebar-width)',
            background: 'rgba(8, 8, 8, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(229, 62, 62, 0.25)',
            zIndex: 200, display: 'flex', flexDirection: 'column',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--accent-glow)' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontFamily: 'Anton', fontSize: '1.1rem', letterSpacing: '1px' }}>VGT AI COACH</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700 }}>● ONLINE</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '0.25rem' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%'
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {msg.role === 'user' ? <User size={13} color="#fff" /> : <Bot size={13} color="var(--accent-color)" />}
                </div>
                <div style={{
                  padding: '0.75rem 1rem',
                  background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.07)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={13} color="var(--accent-color)" />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem' }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask your coach..."
                style={{
                  flex: 1, padding: '0.8rem 1rem',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  padding: '0.8rem', background: 'var(--accent-color)', border: 'none',
                  color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  opacity: input.trim() ? 1 : 0.5
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalAIChat;
