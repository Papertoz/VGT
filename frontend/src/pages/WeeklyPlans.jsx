import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Plus, Star, Trash2, ChevronDown, ChevronUp, Check, X, Save } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const WeeklyPlans = () => {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [savingDay, setSavingDay] = useState(null);
  const [drafts, setDrafts] = useState({});

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/weeklyplan/allplans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchExercises = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/exercises', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setExercises(data.exercises);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) { fetchPlans(); fetchExercises(); }
  }, [token]);

  useEffect(() => {
    const initialDrafts = {};
    plans.forEach(plan => {
      initialDrafts[plan._id] = {};
      DAYS.forEach(day => {
        const found = plan.days?.find(d => d.day === day);
        initialDrafts[plan._id][day] = found ? found.exercises.map(ex => ({
          exercise: ex.exercise?._id || ex.exercise,
          sets: ex.sets || 3, reps: ex.reps || 10, duration: ex.duration || 0
        })) : [];
      });
    });
    setDrafts(initialDrafts);
  }, [plans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/weeklyplan/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          planName: newPlanName, description: newPlanDesc,
          days: DAYS.map(day => ({ day, exercises: [] })), isActive: false
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateForm(false);
        setNewPlanName(''); setNewPlanDesc('');
        fetchPlans();
      }
    } catch (err) { console.error(err); }
  };

  const handleActivate = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/weeklyplan/activate/${id}`, {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const handleDeactivate = async (plan) => {
    try {
      await fetch(`http://localhost:3000/api/weeklyplan/update/${plan._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isActive: false })
      });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this training plan permanently?')) return;
    try {
      await fetch(`http://localhost:3000/api/weeklyplan/delete/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const addExerciseToDay = (planId, day) => {
    if (!exercises.length) return alert('Add some exercises to your library first!');
    setDrafts(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [day]: [...(prev[planId]?.[day] || []), { exercise: exercises[0]._id, sets: 3, reps: 10, duration: 0 }]
      }
    }));
  };

  const removeExerciseFromDay = (planId, day, idx) => {
    setDrafts(prev => ({
      ...prev,
      [planId]: { ...prev[planId], [day]: prev[planId][day].filter((_, i) => i !== idx) }
    }));
  };

  const updateExerciseField = (planId, day, idx, field, value) => {
    setDrafts(prev => {
      const updated = [...prev[planId][day]];
      updated[idx] = { ...updated[idx], [field]: field === 'exercise' ? value : Number(value) };
      return { ...prev, [planId]: { ...prev[planId], [day]: updated } };
    });
  };

  const saveDayExercises = async (planId, day) => {
    setSavingDay(day);
    try {
      const plan = plans.find(p => p._id === planId);
      const fullDays = DAYS.map(d => ({ day: d, exercises: (drafts[planId]?.[d] || []) }));
      const res = await fetch(`http://localhost:3000/api/weeklyplan/update/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planName: plan.planName, description: plan.description, days: fullDays })
      });
      const data = await res.json();
      if (data.success) { fetchPlans(); setExpandedDay(null); }
    } catch (err) { console.error(err); }
    finally { setSavingDay(null); }
  };

  const selectStyle = {
    padding: '0.4rem', background: 'var(--glass-bg-light)',
    border: '1px solid var(--border-light)', color: 'var(--text-primary)',
    fontFamily: 'Inter', fontSize: '0.78rem', flex: 1,
    borderRadius: 'var(--radius-sm)',
  };

  const numStyle = {
    padding: '0.4rem', background: 'var(--glass-bg-light)',
    border: '1px solid var(--border-light)', color: 'var(--text-primary)',
    width: '55px', textAlign: 'center', fontFamily: 'Inter', fontSize: '0.78rem',
    borderRadius: 'var(--radius-sm)',
  };

  return (
    <div className="main-content">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Training Plans
            </h1>
            <p style={{ fontSize: '0.85rem' }}>{plans.length} plans created</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus size={16} /> New Plan
          </button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <GlassCard variant="glow" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Create New Plan</h3>
                <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input className="input-field" placeholder="Plan Name (e.g. PPL Split)" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} required />
                  <input className="input-field" placeholder="Description (optional)" value={newPlanDesc} onChange={e => setNewPlanDesc(e.target.value)} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary">Create Plan</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}><X size={14} /> Cancel</button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <p style={{ fontWeight: 500, fontSize: '0.85rem' }}>Loading plans...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {plans.length === 0 && (
              <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>No plans yet. Build your first routine!</p>
              </GlassCard>
            )}

            {plans.map(plan => (
              <GlassCard key={plan._id} style={{
                borderLeft: plan.isActive ? '3px solid var(--accent)' : undefined,
              }}>
                {/* Plan Header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: expandedPlan === plan._id ? '1.5rem' : 0,
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.15rem' }}>{plan.planName}</h3>
                      {plan.isActive && (
                        <span style={{
                          background: 'var(--accent-subtle)', color: 'var(--accent)',
                          padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 600,
                          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)',
                          display: 'flex', alignItems: 'center', gap: '0.2rem',
                        }}>
                          <Star size={10} /> Active
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem' }}>{plan.description || 'No description'}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {plan.isActive ? (
                      <button className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '0.4rem 0.75rem' }} onClick={() => handleDeactivate(plan)}>Deactivate</button>
                    ) : (
                      <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.4rem 0.75rem' }} onClick={() => handleActivate(plan._id)}><Check size={12} /> Activate</button>
                    )}
                    <button className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '0.4rem 0.75rem' }}
                      onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}
                    >
                      {expandedPlan === plan._id ? <><ChevronUp size={14} /> Close</> : <><ChevronDown size={14} /> Edit Days</>}
                    </button>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.3rem',
                    }} onClick={() => handleDeletePlan(plan._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Day Builder */}
                <AnimatePresence>
                  {expandedPlan === plan._id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '0.35rem', marginBottom: '1rem',
                      }}>
                        {DAYS.map(day => {
                          const dayExercises = drafts[plan._id]?.[day] || [];
                          const isExpanded = expandedDay === `${plan._id}-${day}`;
                          return (
                            <div key={day} style={{
                              border: `1px solid ${isExpanded ? 'var(--accent)' : 'var(--border-light)'}`,
                              borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                            }}>
                              <button
                                onClick={() => setExpandedDay(isExpanded ? null : `${plan._id}-${day}`)}
                                style={{
                                  width: '100%', padding: '0.5rem 0.3rem',
                                  background: isExpanded ? 'var(--accent-subtle)' : 'var(--glass-bg-light)',
                                  border: 'none', color: isExpanded ? 'var(--accent)' : 'var(--text-secondary)',
                                  cursor: 'pointer', fontWeight: 600, fontSize: '0.65rem',
                                  textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter',
                                }}
                              >
                                {day.slice(0, 3)}
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: 500 }}>
                                  {dayExercises.length} ex
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Day Panel */}
                      <AnimatePresence>
                        {expandedDay && expandedDay.startsWith(plan._id) && (() => {
                          const day = expandedDay.replace(`${plan._id}-`, '');
                          const dayExs = drafts[plan._id]?.[day] || [];
                          return (
                            <motion.div key={expandedDay} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              style={{
                                background: 'var(--glass-bg-light)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '1.25rem', marginBottom: '0.75rem',
                              }}
                            >
                              <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '1rem',
                              }}>
                                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                  {day.charAt(0).toUpperCase() + day.slice(1)} — Exercises
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '0.35rem 0.7rem' }}
                                    onClick={() => addExerciseToDay(plan._id, day)}
                                  >
                                    <Plus size={12} /> Add
                                  </button>
                                  <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.35rem 0.7rem' }}
                                    onClick={() => saveDayExercises(plan._id, day)} disabled={savingDay === day}
                                  >
                                    <Save size={12} /> {savingDay === day ? 'Saving...' : 'Save'}
                                  </button>
                                </div>
                              </div>

                              {dayExs.length === 0 ? (
                                <p style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                                  No exercises for {day}. Click Add to assign exercises.
                                </p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {dayExs.map((ex, idx) => (
                                    <div key={idx} style={{
                                      display: 'flex', gap: '0.5rem', alignItems: 'center',
                                      padding: '0.5rem',
                                      background: 'var(--glass-bg-card)',
                                      borderRadius: 'var(--radius-sm)',
                                    }}>
                                      <select value={ex.exercise}
                                        onChange={e => updateExerciseField(plan._id, day, idx, 'exercise', e.target.value)}
                                        style={selectStyle}
                                      >
                                        {exercises.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                                      </select>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <label style={{ margin: 0, fontSize: '0.6rem' }}>Sets</label>
                                        <input type="number" min="1" value={ex.sets}
                                          onChange={e => updateExerciseField(plan._id, day, idx, 'sets', e.target.value)}
                                          style={numStyle}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <label style={{ margin: 0, fontSize: '0.6rem' }}>Reps</label>
                                        <input type="number" min="1" value={ex.reps}
                                          onChange={e => updateExerciseField(plan._id, day, idx, 'reps', e.target.value)}
                                          style={numStyle}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <label style={{ margin: 0, fontSize: '0.6rem' }}>Min</label>
                                        <input type="number" min="0" value={ex.duration}
                                          onChange={e => updateExerciseField(plan._id, day, idx, 'duration', e.target.value)}
                                          style={numStyle}
                                        />
                                      </div>
                                      <button style={{
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444',
                                      }} onClick={() => removeExerciseFromDay(plan._id, day, idx)}>
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyPlans;
