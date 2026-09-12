import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { Play, Check, ChevronRight, Timer, X, Trophy, Zap } from 'lucide-react';

const REST_DURATION = 60;

const ActiveWorkout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [resting, setResting] = useState(false);
  const [restTimer, setRestTimer] = useState(REST_DURATION);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const fetchToday = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/weeklyplan/today', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setTodayData(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchToday();
  }, [token]);

  useEffect(() => {
    if (resting) {
      timerRef.current = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setResting(false);
            setRestTimer(REST_DURATION);
            return REST_DURATION;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [resting]);

  const exercises = todayData?.workout || [];
  const currentEx = exercises[currentExIdx];

  const completeSet = (exIdx, setIdx) => {
    setCompletedSets(prev => {
      const sets = new Set(prev[exIdx] || []);
      sets.add(setIdx);
      const updated = { ...prev, [exIdx]: sets };
      const totalSets = exercises[exIdx]?.sets || 3;
      if (sets.size >= totalSets) setResting(true);
      return updated;
    });
  };

  const nextExercise = () => {
    setResting(false);
    clearInterval(timerRef.current);
    setRestTimer(REST_DURATION);
    if (currentExIdx + 1 >= exercises.length) setFinished(true);
    else setCurrentExIdx(i => i + 1);
  };

  const skipRest = () => {
    clearInterval(timerRef.current);
    setResting(false);
    setRestTimer(REST_DURATION);
  };

  if (loading) {
    return (
      <div className="main-content" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
      }}>
        <p style={{ fontWeight: 500, fontSize: '1rem' }}>Loading today's workout...</p>
      </div>
    );
  }

  if (!todayData || exercises.length === 0) {
    return (
      <div className="main-content" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
      }}>
        <GlassCard variant="glow" style={{ maxWidth: '450px', padding: '3rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📋</span>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Workout Today</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            No active plan found for today. Set up your weekly training schedule first.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/weekly-plans')}>
              Build My Weekly Plan
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/exercises')}>
              Manage Exercise Library
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="main-content" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
      }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <GlassCard variant="glow" style={{ maxWidth: '450px', width: '100%', padding: '3rem', textAlign: 'center' }}>
            <Trophy size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Exercise completed
            </h1>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              You crushed {exercises.length} exercises. Recovery starts now.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/chat')}>
                Ask AI for Recovery Tips
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="main-content" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
      }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Today's <span style={{ color: 'var(--accent)' }}>Training</span>
          </h1>
          <p style={{ fontSize: '0.82rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            {todayData.day?.toUpperCase()} — {exercises.length} exercises
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {exercises.map((item, i) => {
              const ex = item.exercise || item;
              return (
                <GlassCard key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800,
                      color: 'var(--accent)', opacity: 0.5, width: '30px',
                    }}>{String(i+1).padStart(2,'0')}</span>
                    {ex.imageUrl && (
                      <div style={{
                        width: 40, height: 40, overflow: 'hidden', flexShrink: 0,
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ex.name || 'Exercise'}</h4>
                      <p style={{ margin: 0, fontSize: '0.72rem' }}>{ex.muscleGroup}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)' }}>SETS</p>
                      <p style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.sets || 3}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)' }}>REPS</p>
                      <p style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.reps || 10}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }} onClick={() => setStarted(true)}>
            <Play size={18} /> Start Workout
          </button>
        </div>
      </div>
    );
  }

  // Live Workout
  const ex = currentEx?.exercise || currentEx;
  const totalSets = currentEx?.sets || 3;
  const totalReps = currentEx?.reps || 10;
  const doneSetCount = completedSets[currentExIdx]?.size || 0;
  const allSetsDone = doneSetCount >= totalSets;
  const progress = (currentExIdx / exercises.length) * 100;

  return (
    <div className="main-content">
      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>
            Exercise {currentExIdx + 1} of {exercises.length}
          </p>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
            {Math.round(progress)}% Complete
          </p>
        </div>
        <div style={{
          width: '100%', height: '4px', background: 'var(--border)',
          borderRadius: '2px', overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: 'var(--gradient-accent)', borderRadius: '2px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Exercise Info */}
        <div>
          {ex?.imageUrl ? (
            <div style={{
              marginBottom: '1.5rem', border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
            }}>
              <img src={ex.imageUrl} alt={ex?.name} style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <GlassCard style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '3.5rem' }}>
              🏋️
            </GlassCard>
          )}

          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '1.5rem' }}>{ex?.name || 'Exercise'}</h2>
          <span style={{
            background: 'var(--accent-subtle)', color: 'var(--accent)',
            padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 600,
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)',
          }}>{ex?.muscleGroup?.toUpperCase()}</span>

          {ex?.description && (
            <p style={{ marginTop: '1rem', lineHeight: 1.7, fontSize: '0.82rem' }}>{ex.description}</p>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { label: 'Sets', value: totalSets },
              { label: 'Reps', value: totalReps },
              { label: 'Rest', value: `${REST_DURATION}s` },
            ].map(item => (
              <GlassCard key={item.label} style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.label}</p>
                <p style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: item.label === 'Sets' ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {item.value}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right: Set Tracker */}
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Set Tracker</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {Array.from({ length: totalSets }).map((_, setIdx) => {
              const done = completedSets[currentExIdx]?.has(setIdx);
              return (
                <motion.button
                  key={setIdx}
                  whileTap={!done ? { scale: 0.98 } : {}}
                  onClick={() => !done && completeSet(currentExIdx, setIdx)}
                  disabled={done}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem',
                    background: done ? 'var(--accent-subtle)' : 'var(--glass-bg-light)',
                    border: `1px solid ${done ? 'var(--accent)' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)', cursor: done ? 'default' : 'pointer',
                    width: '100%', fontFamily: 'Inter', transition: 'all var(--transition)',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Set {setIdx + 1} — {totalReps} Reps
                  </span>
                  {done
                    ? <Check size={18} color="var(--accent)" />
                    : <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem' }}>Tap to complete</span>
                  }
                </motion.button>
              );
            })}
          </div>

          {/* Rest Timer */}
          <AnimatePresence>
            {resting && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassCard variant="glow" style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                  <Timer size={24} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>Rest Time</h3>
                  <p style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', margin: '0.25rem 0' }}>
                    {restTimer}s
                  </p>
                  <button className="btn btn-secondary" style={{ marginTop: '0.5rem', width: '100%' }} onClick={skipRest}>
                    <Zap size={14} /> Skip Rest
                  </button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {allSetsDone && !resting && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              onClick={nextExercise}
            >
              {currentExIdx + 1 >= exercises.length ? <><Trophy size={16} /> Finish Workout</> : <><ChevronRight size={16} /> Next Exercise</>}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
