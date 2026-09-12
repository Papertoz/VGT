import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, Zap, Target, HeartPulse, Dumbbell } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: <Target size={16} />, text: "Evaluate if my goal is realistic and safe" },
  { icon: <Dumbbell size={16} />, text: "Plan a 4-day push/pull split for me" },
  { icon: <HeartPulse size={16} />, text: "What should I do for recovery today?" },
  { icon: <Zap size={16} />, text: "Best exercises for muscle growth as a beginner?" },
];

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 1rem' }}>
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}
      />
    ))}
  </div>
);

const MessageBubble = ({ msg, index }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
        maxWidth: '80%', alignSelf: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--gradient-accent)' : 'var(--glass-bg-light)',
        border: `1px solid ${isUser ? 'var(--accent)' : 'var(--border-light)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser ? <User size={14} color="#fff" /> : <Bot size={14} color="var(--accent)" />}
      </div>
      <div style={{
        padding: '0.75rem 1rem',
        background: isUser ? 'var(--gradient-accent)' : 'var(--glass-bg-card)',
        border: isUser ? 'none' : '1px solid var(--border-light)',
        borderRadius: isUser ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
        color: isUser ? '#ffffff' : 'var(--text-primary)',
        fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
};

const AIChat = () => {
  const { token, userProfile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome, ${userProfile?.fullname?.split(' ')[0] || 'Athlete'}. I am your VGT AI Coach.\n\nI can evaluate your fitness goals, plan your weekly splits, advise on recovery, and coach you through any training challenge. What do you want to tackle today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;

    const userMessage = { role: 'user', content: msgText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    inputRef.current?.focus();

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: msgText })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.success ? data.response : 'Sorry, an error occurred. Please try again.'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const isFirstMessage = messages.length === 1;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle blue glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '350px',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-light)',
        zIndex: 10, position: 'relative',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--gradient-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <Bot size={18} color="#fff" />
        </div>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit', fontSize: '1rem', fontWeight: 700 }}>VGT AI Coach</h3>
          <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        position: 'relative', zIndex: 10,
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--glass-bg-light)',
              border: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bot size={14} color="var(--accent)" />
            </div>
            <div style={{
              background: 'var(--glass-bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <AnimatePresence>
        {isFirstMessage && !loading && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0, y: 20 }}
            style={{
              padding: '0 1.5rem 1rem',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', zIndex: 10,
            }}
          >
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p.text)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 0.8rem',
                  background: 'var(--glass-bg-light)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.78rem', fontWeight: 500, transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{p.icon}</span>
                {p.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-light)',
        zIndex: 10,
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '900px', margin: '0 auto' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about workouts, goals, recovery, nutrition..."
            disabled={loading}
            className="input-field"
            style={{ flex: 1, padding: '0.75rem 1rem' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.25rem',
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            <Send size={16} /> Send
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          VGT AI can make mistakes. Always verify with a qualified trainer.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
