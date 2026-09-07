import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, Zap, Target, HeartPulse, Dumbbell } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: <Target size={18} />, text: "Evaluate if my goal is realistic and safe" },
  { icon: <Dumbbell size={18} />, text: "Plan a 4-day push/pull split for me" },
  { icon: <HeartPulse size={18} />, text: "What should I do for recovery today?" },
  { icon: <Zap size={18} />, text: "Best exercises for muscle growth as a beginner?" },
];

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '1rem 1.5rem' }}>
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)' }}
      />
    ))}
  </div>
);

const MessageBubble = ({ msg, index }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
        maxWidth: '80%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
        border: isUser ? '2px solid var(--accent-color)' : '2px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isUser ? <User size={16} color="#fff" /> : <Bot size={16} color="var(--accent-color)" />}
      </div>

      {/* Bubble */}
      <div style={{
        padding: '1rem 1.5rem',
        background: isUser
          ? 'var(--accent-color)'
          : 'rgba(255,255,255,0.06)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
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
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle red glow bg */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(circle, rgba(229,62,62,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        zIndex: 10, position: 'relative'
      }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}>
          <Bot size={22} color="#fff" />
        </div>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontFamily: 'Anton', fontSize: '1.4rem', letterSpacing: '2px' }}>VGT AI COACH</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 700 }}>● ONLINE</p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '2rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        position: 'relative', zIndex: 10
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={16} color="var(--accent-color)" />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts — shown when chat is fresh */}
      <AnimatePresence>
        {isFirstMessage && !loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', zIndex: 10 }}
          >
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p.text)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.9rem 1.2rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#ccc', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.85rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-color)'; e.target.style.color = '#fff'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#ccc'; }}
              >
                <span style={{ color: 'var(--accent-color)' }}>{p.icon}</span>
                {p.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about workouts, goals, recovery, nutrition..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'Inter',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '1rem 2rem',
              background: input.trim() ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px',
              fontFamily: 'Inter',
            }}
          >
            <Send size={18} /> SEND
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#555' }}>
          VGT AI can make mistakes. Always verify with a qualified trainer.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
