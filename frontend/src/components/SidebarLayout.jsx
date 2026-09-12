import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlobalAIChat from './GlobalAIChat';
import {
  LayoutDashboard, CalendarDays, Dumbbell, Play,
  MessageSquare, LogOut, BotMessageSquare, Apple,
  Settings, Sun, Moon
} from 'lucide-react';

const SidebarLayout = () => {
  const { userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Plans', path: '/weekly-plans', icon: <CalendarDays size={18} /> },
    { name: 'Exercises', path: '/exercises', icon: <Dumbbell size={18} /> },
    { name: 'Training', path: '/workout', icon: <Play size={18} /> },
    { name: 'Nutrition', path: '/nutrition', icon: <Apple size={18} /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--glass-bg-card)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 40,
        transition: 'background var(--transition), border-color var(--transition)',
      }}>
        {/* Brand */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Dumbbell size={16} color="#fff" />
            </div>
            <div>
              <span style={{
                fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem',
                color: 'var(--text-primary)',
              }}>VGT<span style={{ color: 'var(--accent)' }}>AI</span></span>
              <p style={{
                margin: 0, fontSize: '0.6rem', color: 'var(--text-muted)',
                fontWeight: 500, letterSpacing: '0.1em',
              }}>Virtual Gym Trainer</p>
            </div>
          </div>
        </div>

        {/* User Widget */}
        {userProfile && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer',
              transition: 'background var(--transition)',
            }}
            onClick={() => navigate('/settings')}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--gradient-accent)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontFamily: 'Outfit', fontWeight: 700, flexShrink: 0,
              overflow: 'hidden',
            }}>
              {userProfile.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                userProfile.fullname ? userProfile.fullname.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <h4 style={{
                margin: 0, fontSize: '0.82rem', fontFamily: 'Outfit',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{userProfile.fullname}</h4>
              <p style={{
                margin: 0, fontSize: '0.68rem', color: 'var(--accent)',
                fontWeight: 600, textTransform: 'capitalize',
              }}>{userProfile.level}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{
          flex: 1, padding: '0.75rem',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'all var(--transition)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: '0.35rem',
        }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', width: '100%',
              background: 'var(--glass-bg-light)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.8rem', fontFamily: 'Inter',
              transition: 'all var(--transition)',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* AI Coach */}
          <button
            onClick={() => setIsAIChatOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', width: '100%',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent)', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.8rem', fontFamily: 'Inter',
              transition: 'all var(--transition)',
            }}
          >
            <BotMessageSquare size={16} /> AI Coach
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', width: '100%',
              background: 'transparent', border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.8rem', fontFamily: 'Inter',
              transition: 'all var(--transition)',
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        background: 'var(--bg-primary)',
        minHeight: '100vh',
        transition: 'background var(--transition)',
      }}>
        <Outlet />
      </main>

      {/* AI Chat Sidebar */}
      <GlobalAIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default SidebarLayout;
