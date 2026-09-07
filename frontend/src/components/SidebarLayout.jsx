import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalAIChat from './GlobalAIChat';
import { LayoutDashboard, CalendarDays, Dumbbell, Play, MessageSquare, LogOut, BotMessageSquare, Apple } from 'lucide-react';

const SidebarLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const navItems = [
    { name: 'DASHBOARD', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'PLANS', path: '/weekly-plans', icon: <CalendarDays size={20} /> },
    { name: 'EXERCISES', path: '/exercises', icon: <Dumbbell size={20} /> },
    { name: 'TRAINING', path: '/workout', icon: <Play size={20} /> },
    { name: 'NUTRITION', path: '/nutrition', icon: <Apple size={20} /> },
    { name: 'CHAT', path: '/chat', icon: <MessageSquare size={20} /> }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Glass Black Left Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(10, 10, 10, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(229, 62, 62, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 40,
        color: '#fff'
      }}>
        {/* Brand */}
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '2.2rem' }}>VGT<span style={{ color: 'var(--accent-color)' }}>AI</span></h2>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#555', fontWeight: 700, letterSpacing: '2px' }}>VIRTUAL GYM TRAINER</p>
        </div>

        {/* User Profile Mini Widget */}
        {userProfile && (
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontFamily: 'Anton', boxShadow: '0 0 20px var(--accent-glow)', flexShrink: 0 }}>
              {userProfile.fullname ? userProfile.fullname.charAt(0) : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Anton', letterSpacing: '1px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile.fullname}</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase' }}>{userProfile.level}</p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.9rem 1rem',
                color: isActive ? '#fff' : '#666',
                background: isActive ? 'rgba(229,62,62,0.15)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '1px',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
              })}
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsAIChatOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.9rem 1rem', width: '100%',
              background: 'rgba(229,62,62,0.12)',
              border: '1px solid rgba(229,62,62,0.3)',
              color: 'var(--accent-color)', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px', fontFamily: 'Inter',
              textTransform: 'uppercase'
            }}
          >
            <BotMessageSquare size={18} /> OPEN AI COACH
          </button>
          
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', width: '100%',
              background: 'transparent', border: 'none',
              color: '#555', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', fontFamily: 'Inter',
              textTransform: 'uppercase'
            }}
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, background: 'var(--bg-color)', minHeight: '100vh' }}>
        <Outlet />
      </main>

      {/* Persistent AI Sidebar */}
      <GlobalAIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default SidebarLayout;
