import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      position: 'relative',
      background: 'var(--bg-primary)',
    }}>
      <AnimatedBackground intensity={0.8} />

      {/* Left — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '400px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Dumbbell size={22} color="#fff" />
            </div>
            <span style={{
              fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.6rem',
              color: 'var(--text-primary)',
            }}>VGT<span style={{ color: 'var(--accent)' }}>AI</span></span>
          </div>

          <h1 style={{
            fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: 900,
            color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem',
          }}>
            Your Fitness,{' '}
            <span style={{
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Reimagined</span>
          </h1>

          <p style={{
            fontSize: '0.95rem', color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: '2rem',
          }}>
            AI-powered workout planning, real-time tracking, and intelligent recovery — all in one platform.
          </p>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'AI Coach', value: '24/7' },
              { label: 'Exercises', value: '500+' },
              { label: 'Free', value: '100%' },
            ].map(item => (
              <div key={item.label}>
                <div style={{
                  fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem',
                  color: 'var(--accent)',
                }}>{item.value}</div>
                <div style={{
                  fontSize: '0.72rem', color: 'var(--text-muted)',
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            background: 'var(--glass-bg-card)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2 style={{
            marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '1.6rem',
          }}>
            {isLogin ? 'Welcome Back' : 'Join VGT AI'}
          </h2>
          <p style={{
            marginBottom: '1.5rem', fontSize: '0.85rem',
          }}>
            {isLogin ? 'Enter your details to access your dashboard.' : 'Create an account to start your journey.'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderLeft: '3px solid #ef4444',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            <span style={{
              color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500,
            }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.85rem' }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: '16px', height: '16px' }}
            />
            Google
          </button>

          <p style={{
            textAlign: 'center', marginTop: '1.25rem',
            fontSize: '0.82rem', color: 'var(--text-secondary)',
          }}>
            {isLogin ? "Don't have an account? " : "Already a member? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{
                color: 'var(--accent)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
