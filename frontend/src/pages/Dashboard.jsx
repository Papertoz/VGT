import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import ParticleField from '../components/ParticleField';
import { Activity, TrendingUp, HeartPulse, Play, Settings, Zap, Calendar } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

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
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="main-content" style={{ position: 'relative' }}>
      <ParticleField particleCount={35} style={{ opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial="hidden" animate="visible" variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          style={{
            marginBottom: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}
        >
          <motion.div variants={fadeUp}>
            <p style={{
              fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem',
            }}>
              {getGreeting()}
            </p>
            <h1 style={{
              fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem',
            }}>
              {userProfile?.fullname?.split(' ')[0] || 'Athlete'}
            </h1>
            <p style={{ fontSize: '0.85rem' }}>Your daily training briefing.</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} /> Settings
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Strip */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem', marginBottom: '1.5rem',
            }}
          >
            {[
              { label: 'Weight', value: `${userProfile.weight || '--'}`, unit: 'KG' },
              { label: 'Height', value: `${userProfile.height || '--'}`, unit: 'CM' },
              { label: 'Level', value: userProfile.level || '--', unit: '' },
              { label: 'Goal', value: userProfile.aiPreferences?.fitnessGoal || '--', unit: '' },
            ].map((stat, i) => (
              <GlassCard key={i} variant="light" style={{ padding: '1rem' }}>
                <p style={{
                  fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem',
                }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{
                    fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800,
                    color: 'var(--text-primary)', lineHeight: 1, textTransform: 'capitalize',
                  }}>{stat.value}</span>
                  {stat.unit && (
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600,
                    }}>{stat.unit}</span>
                  )}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Workout of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard
            variant="glow"
            style={{
              marginBottom: '1.5rem',
              borderLeft: '4px solid var(--accent)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem',
            }}>
              <button 
                onClick={() => navigate('/workout')}
                disabled={!todayWorkout || todayWorkout.length === 0}
                style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                  background: (!todayWorkout || todayWorkout.length === 0) ? 'var(--glass-bg-light)' : 'var(--gradient-accent)',
                  border: 'none', cursor: (!todayWorkout || todayWorkout.length === 0) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: (!todayWorkout || todayWorkout.length === 0) ? 0.5 : 1
              }}>
                <Play size={20} color={(!todayWorkout || todayWorkout.length === 0) ? 'var(--text-muted)' : '#fff'} />
              </button>
              <div>
                <p style={{
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>Workout of the Day</p>
                <h2 style={{
                  margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)',
                }}>
                  {todayWorkout ? (todayWorkout.length > 0 ? 'Training Day' : 'Rest Day') : (loading ? 'Loading...' : 'Rest Day')}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', maxWidth: '600px', marginBottom: '1.25rem' }}>
              {todayWorkout
                ? `You have ${todayWorkout.length || 0} exercises scheduled for today. Ready to crush it?`
                : 'No active plan or scheduled workout for today. Enjoy your rest or create a new plan.'}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/workout')}
                disabled={!todayWorkout}
              >
                <Zap size={16} /> Start Training
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/weekly-plans')}
              >
                <Calendar size={16} /> Manage Plans
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottom Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* Recovery */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard variant="light" style={{ height: '100%' }}>
              <h4 style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem',
              }}>
                <HeartPulse size={18} color="var(--accent)" /> Recovery Protocol
              </h4>
              {loading ? (
                <div style={{ opacity: 0.5, fontWeight: 500, fontSize: '0.85rem' }}>
                  Generating AI recovery plan...
                </div>
              ) : (
                <div style={{
                  fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.7,
                }}>
                  {recoverySuggestions || 'No recovery suggestions available. Complete a workout first.'}
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard style={{ height: '100%' }}>
              <h4 style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem',
              }}>
                <TrendingUp size={18} color="var(--accent)" /> Progress Report
              </h4>
              {loading ? (
                <div style={{ opacity: 0.5, fontWeight: 500, fontSize: '0.85rem' }}>
                  Analyzing logs...
                </div>
              ) : (
                <div style={{
                  fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.7,
                }}>
                  {progressReport || 'Complete a workout to get your first AI progress report.'}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
