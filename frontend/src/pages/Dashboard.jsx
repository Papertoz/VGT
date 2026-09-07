import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, MessageSquare, TrendingUp, HeartPulse, Play, Settings } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userProfile, token } = useAuth();
  const navigate = useNavigate();
  const [progressReport, setProgressReport] = useState(null);
  const [recoverySuggestions, setRecoverySuggestions] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [progressRes, recoveryRes, todayRes] = await Promise.all([
          fetch('http://localhost:3000/api/ai/progress-report', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3000/api/ai/recovery-suggestions', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3000/api/weeklyplan/today', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const progressData = await progressRes.json();
        const recoveryData = await recoveryRes.json();
        const todayData = await todayRes.json();

        if (progressData.success) setProgressReport(progressData.response);
        if (recoveryData.success) setRecoverySuggestions(recoveryData.response);
        if (todayData.success) setTodayWorkout(todayData.workout);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
            {getGreeting()},<br/><span style={{ color: '#111' }}>{userProfile?.fullname?.split(' ')[0] || 'ATHLETE'}.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px' }}>YOUR DAILY TRAINING BRIEFING.</p>
        </div>
        <button className="btn btn-secondary" style={{ background: '#fff', color: '#111', border: '1px solid #111' }} onClick={() => alert('Profile settings coming soon')}>
          <Settings size={18} /> SETTINGS
        </button>
      </div>

      {/* Profile Overview Card (Light) */}
      {userProfile && (
        <div className="card-light" style={{ marginBottom: '2rem', display: 'flex', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px' }}>CURRENT STATS</p>
            <div style={{ display: 'flex', gap: '3rem', marginTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '2.5rem', fontFamily: 'Anton', lineHeight: 1 }}>{userProfile.weight}</span><span style={{ color: 'var(--text-secondary)', fontWeight: 700, marginLeft: '0.2rem' }}>KG</span>
              </div>
              <div>
                <span style={{ fontSize: '2.5rem', fontFamily: 'Anton', lineHeight: 1 }}>{userProfile.height}</span><span style={{ color: 'var(--text-secondary)', fontWeight: 700, marginLeft: '0.2rem' }}>CM</span>
              </div>
              <div>
                <span style={{ fontSize: '2.5rem', fontFamily: 'Anton', lineHeight: 1, color: 'var(--accent-color)' }}>{userProfile.level}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workout of the Day Highlight (Stark Black) */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '8px solid var(--accent-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent-color)', padding: '1rem' }}>
            <Play size={32} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--accent-color)', fontSize: '1rem', letterSpacing: '2px' }}>WORKOUT OF THE DAY</h3>
            <h2 style={{ margin: 0, fontSize: '3rem', color: '#fff' }}>{todayWorkout ? todayWorkout.name : (loading ? 'LOADING...' : 'REST DAY')}</h2>
          </div>
        </div>
        
        <p style={{ color: '#aaa', maxWidth: '600px', fontSize: '1.1rem' }}>
          {todayWorkout 
            ? `You have ${todayWorkout.exercises?.length || 0} exercises scheduled for today. Ready to crush it?` 
            : 'No active plan or scheduled workout for today. Enjoy your rest or create a new plan.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/workout')}
            disabled={!todayWorkout}
            style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}
          >
            START TRAINING
          </button>
          <button className="btn btn-secondary" style={{ background: '#333', color: '#fff', border: 'none' }} onClick={() => navigate('/weekly-plans')}>
            MANAGE PLANS
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Recovery Suggestions (Light) */}
        <div className="card-light" style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            <HeartPulse size={24} color="var(--accent-color)" /> RECOVERY PROTOCOL
          </h4>
          {loading ? (
            <div style={{ opacity: 0.5, fontWeight: 600 }}>GENERATING AI RECOVERY PLAN...</div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', flex: 1, fontWeight: 500 }}>
              {recoverySuggestions || 'No recovery suggestions available. Complete a workout first.'}
            </div>
          )}
        </div>

        {/* Progress Report (Black) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', color: '#fff' }}>
            <TrendingUp size={24} color="var(--accent-color)" /> PROGRESS REPORT
          </h4>
          {loading ? (
            <div style={{ opacity: 0.5, color: '#aaa', fontWeight: 600 }}>ANALYZING LOGS...</div>
          ) : (
            <div style={{ color: '#aaa', fontSize: '0.95rem', whiteSpace: 'pre-wrap', fontWeight: 500 }}>
              {progressReport || 'Complete a workout to get your first AI progress report.'}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
