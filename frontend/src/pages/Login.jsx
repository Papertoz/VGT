import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      position: 'relative' 
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }} />

      {/* Glassy Form Panel */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '450px', 
        padding: '3rem', 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff'
      }}>
        
        <h2 style={{ marginBottom: '0.5rem', color: '#fff', textTransform: 'uppercase', fontSize: '2.5rem' }}>
          {isLogin ? 'WELCOME BACK' : 'JOIN VITAL'}
        </h2>
        <p style={{ color: '#ccc', marginBottom: '2rem', fontWeight: 500 }}>
          {isLogin ? 'Enter your details to access your dashboard.' : 'Create an account to start your journey.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#ff8a8a', padding: '1rem', borderLeft: '4px solid #dc2626', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="athlete@vital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'PROCESSING...' : isLogin ? 'LOG IN' : 'BECOME A MEMBER'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: '#ccc', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <button 
          type="button" 
          className="btn" 
          style={{ width: '100%', padding: '1.2rem', background: '#fff', color: '#111' }} 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px', marginRight: '0.5rem' }} />
          CONTINUE WITH GOOGLE
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#ccc' }}>
          {isLogin ? "Don't have an account? " : "Already a member? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-color)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Join Now' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
