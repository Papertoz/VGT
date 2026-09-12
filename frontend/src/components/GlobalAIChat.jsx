import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, X } from 'lucide-react';

const TypingDots = () => (
  <div style={{ display: 'flex', gap: '0.25rem', padding: '0.4rem' }}>
    {[0, 1, 2].map(i => (
      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
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
            background: 'var(--glass-bg-card)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            borderLeft: '1px solid var(--border-accent)',
            zIndex: 200, display: 'flex', flexDirection: 'column',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
              }}>
                <Bot size={14} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit', fontSize: '0.85rem', fontWeight: 700 }}>AI Coach</h4>
                <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 600 }}>● Online</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '0.2rem',
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', gap: '0.5rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'var(--gradient-accent)' : 'var(--glass-bg-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'user' ? <User size={11} color="#fff" /> : <Bot size={11} color="var(--accent)" />}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: msg.role === 'user' ? 'var(--gradient-accent)' : 'var(--glass-bg-light)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)',
                  borderRadius: msg.role === 'user' ? 'var(--radius-sm) var(--radius-sm) 2px var(--radius-sm)' : 'var(--radius-sm) var(--radius-sm) var(--radius-sm) 2px',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.78rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--glass-bg-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot size={11} color="var(--accent)" />
                </div>
                <div style={{
                  background: 'var(--glass-bg-light)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.4rem',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask your coach..."
                className="input-field"
                style={{ flex: 1, padding: '0.6rem 0.75rem', fontSize: '0.82rem' }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem', opacity: input.trim() ? 1 : 0.5,
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalAIChat;
