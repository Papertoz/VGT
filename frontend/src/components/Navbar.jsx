import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const navItems = [
    { name: 'DASHBOARD', path: '/dashboard' },
    { name: 'PLANS', path: '/weekly-plans' },
    { name: 'EXERCISES', path: '/exercises' },
    { name: 'TRAINING', path: '/workout' },
    { name: 'AI COACH', path: '/chat' }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#000',
      borderBottom: '1px solid var(--border-color)',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', color: '#000', padding: '0.5rem', fontWeight: 900, fontFamily: 'Montserrat', fontSize: '1.2rem', letterSpacing: '-1px' }}>
            VGT
          </div>
        </Link>

        <div style={{ display: 'none', '@media (minWidth: 768px)': { display: 'flex' }, gap: '2rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  textDecoration: 'none', 
                  fontFamily: 'Montserrat', 
                  fontWeight: 700, 
                  fontSize: '0.9rem', 
                  letterSpacing: '0.1em', 
                  color: isActive ? '#fff' : 'var(--text-secondary)'
                }} 
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
            </div>
          )}
          <span style={{ fontSize: '0.85rem', fontFamily: 'Montserrat', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {currentUser.displayName}
          </span>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
