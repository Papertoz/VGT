import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, Check, ChevronRight, Timer, X, Trophy, Zap } from 'lucide-react';

const REST_DURATION = 60; // seconds between sets

const ActiveWorkout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState({}); // { [exIdx]: Set([0,1,2...]) }
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

  // Rest timer
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
      // If all sets done, start rest timer
      const totalSets = exercises[exIdx]?.sets || 3;
      if (sets.size >= totalSets) {
        setResting(true);
      }
      return updated;
    });
  };

  const nextExercise = () => {
    setResting(false);
    clearInterval(timerRef.current);
    setRestTimer(REST_DURATION);
    if (currentExIdx + 1 >= exercises.length) {
      setFinished(true);
    } else {
      setCurrentExIdx(i => i + 1);
    }
  };

  const skipRest = () => {
    clearInterval(timerRef.current);
    setResting(false);
    setRestTimer(REST_DURATION);
  };

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p style={{ color: '#aaa', fontWeight: 700, fontSize: '1.5rem' }}>LOADING TODAY'S WORKOUT...</p>
      </div>
    );
  }

  // No plan / No workout
  if (!todayData || exercises.length === 0) {
    return (
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <div className="card-glow" style={{ maxWidth: '500px', padding: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>📋</span>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>NO WORKOUT TODAY</h2>
          <p style={{ color: '#888', marginBottom: '2rem' }}>
            No active plan found for today. Set up your weekly training schedule first.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => navigate('/weekly-plans')}>
              BUILD MY WEEKLY PLAN
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => navigate('/exercises')}>
              MANAGE EXERCISE LIBRARY
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Finished Screen
  if (finished) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-glow"
          style={{ maxWidth: '500px', width: '100%', padding: '4rem', textAlign: 'center' }}
        >
          <Trophy size={64} color="var(--accent-color)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '1rem' }}>WORKOUT COMPLETE!</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2rem' }}>
            You crushed {exercises.length} exercises. Recovery starts now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => navigate('/dashboard')}>
              BACK TO DASHBOARD
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => navigate('/chat')}>
              ASK AI FOR RECOVERY TIPS
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>TODAY'S <span style={{ color: 'var(--accent-color)' }}>TRAINING</span></h1>
          <p style={{ color: '#888', marginBottom: '2.5rem', fontWeight: 700 }}>{todayData.day?.toUpperCase()} — {exercises.length} EXERCISES</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {exercises.map((item, i) => {
              const ex = item.exercise || item;
              return (
                <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontFamily: 'Anton', fontSize: '2rem', color: 'rgba(229,62,62,0.4)', width: '40px' }}>{String(i+1).padStart(2,'0')}</span>
                    {ex.imageUrl && (
                      <div style={{ width: 50, height: 50, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>{ex.name || 'Exercise'}</h4>
                      <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{ex.muscleGroup}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#888', fontWeight: 700 }}>SETS</p>
                      <p style={{ margin: 0, fontFamily: 'Anton', fontSize: '1.5rem', color: '#fff' }}>{item.sets || 3}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#888', fontWeight: 700 }}>REPS</p>
                      <p style={{ margin: 0, fontFamily: 'Anton', fontSize: '1.5rem', color: '#fff' }}>{item.reps || 10}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.3rem' }} onClick={() => setStarted(true)}>
            <Play size={24} /> START WORKOUT
          </button>
        </div>
      </div>
    );
  }

  // Live Workout Screen
  const ex = currentEx?.exercise || currentEx;
  const totalSets = currentEx?.sets || 3;
  const totalReps = currentEx?.reps || 10;
  const doneSetCount = completedSets[currentExIdx]?.size || 0;
  const allSetsDone = doneSetCount >= totalSets;

  return (
    <div className="main-content">
      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <p style={{ color: '#888', fontWeight: 700, fontSize: '0.85rem' }}>EXERCISE {currentExIdx + 1} OF {exercises.length}</p>
          <p style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.85rem' }}>{Math.round(((currentExIdx) / exercises.length) * 100)}% COMPLETE</p>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)' }}>
          <div style={{ height: '100%', width: `${(currentExIdx / exercises.length) * 100}%`, background: 'var(--accent-color)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Left: Exercise Info */}
        <div>
          {ex?.imageUrl ? (
            <div style={{ marginBottom: '2rem', border: '2px solid var(--accent-color)', overflow: 'hidden' }}>
              <img src={ex.imageUrl} alt={ex?.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <div className="card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontSize: '5rem' }}>
              🏋️
            </div>
          )}

          <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '2.5rem' }}>{ex?.name || 'Exercise'}</h2>
          <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 800 }}>{ex?.muscleGroup?.toUpperCase()}</span>

          {ex?.description && (
            <p style={{ color: '#888', marginTop: '1.5rem', lineHeight: 1.7, fontSize: '0.95rem' }}>{ex.description}</p>
          )}

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div className="card" style={{ padding: '1rem 2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>SETS</p>
              <p style={{ margin: 0, fontFamily: 'Anton', fontSize: '2.5rem', color: 'var(--accent-color)' }}>{totalSets}</p>
            </div>
            <div className="card" style={{ padding: '1rem 2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>REPS</p>
              <p style={{ margin: 0, fontFamily: 'Anton', fontSize: '2.5rem', color: '#fff' }}>{totalReps}</p>
            </div>
            <div className="card" style={{ padding: '1rem 2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>REST</p>
              <p style={{ margin: 0, fontFamily: 'Anton', fontSize: '2.5rem', color: '#fff' }}>{REST_DURATION}s</p>
            </div>
          </div>
        </div>

        {/* Right: Set Tracker */}
        <div>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>SET TRACKER</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {Array.from({ length: totalSets }).map((_, setIdx) => {
              const done = completedSets[currentExIdx]?.has(setIdx);
              return (
                <button
                  key={setIdx}
                  onClick={() => !done && completeSet(currentExIdx, setIdx)}
                  disabled={done}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    background: done ? 'rgba(229,62,62,0.15)' : 'rgba(255,255,255,0.05)',
                    border: done ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    cursor: done ? 'default' : 'pointer',
                    width: '100%',
                    fontFamily: 'Inter',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>SET {setIdx + 1} — {totalReps} REPS</span>
                  {done
                    ? <Check size={24} color="var(--accent-color)" />
                    : <span style={{ color: '#555', fontWeight: 700, fontSize: '0.85rem' }}>TAP TO COMPLETE</span>
                  }
                </button>
              );
            })}
          </div>

          {/* Rest Timer */}
          <AnimatePresence>
            {resting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card-glow"
                style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}
              >
                <Timer size={32} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>REST TIME</h3>
                <p style={{ fontFamily: 'Anton', fontSize: '4rem', color: 'var(--accent-color)', margin: '0.5rem 0' }}>{restTimer}s</p>
                <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={skipRest}>
                  <Zap size={16} /> SKIP REST
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {allSetsDone && !resting && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem', marginTop: '1rem' }}
              onClick={nextExercise}
            >
              {currentExIdx + 1 >= exercises.length ? <><Trophy size={20} /> FINISH WORKOUT</> : <><ChevronRight size={20} /> NEXT EXERCISE</>}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
