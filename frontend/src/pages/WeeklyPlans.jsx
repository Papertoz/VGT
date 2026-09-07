import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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
  // Local draft edits per plan { [planId]: { [day]: exercises[] } }
  const [drafts, setDrafts] = useState({});

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/weeklyplan/allplans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  // Initialize drafts when plans are fetched
  useEffect(() => {
    const initialDrafts = {};
    plans.forEach(plan => {
      initialDrafts[plan._id] = {};
      DAYS.forEach(day => {
        const found = plan.days?.find(d => d.day === day);
        initialDrafts[plan._id][day] = found ? found.exercises.map(ex => ({
          exercise: ex.exercise?._id || ex.exercise,
          sets: ex.sets || 3,
          reps: ex.reps || 10,
          duration: ex.duration || 0
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
          planName: newPlanName,
          description: newPlanDesc,
          days: DAYS.map(day => ({ day, exercises: [] })),
          isActive: false
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
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const handleDeactivate = async (plan) => {
    // To deactivate, we send an update with isActive: false
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
    if (!window.confirm('DELETE this training plan permanently?')) return;
    try {
      await fetch(`http://localhost:3000/api/weeklyplan/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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
      [planId]: {
        ...prev[planId],
        [day]: prev[planId][day].filter((_, i) => i !== idx)
      }
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
      // Build the full days array from draft
      const fullDays = DAYS.map(d => ({
        day: d,
        exercises: (drafts[planId]?.[d] || [])
      }));

      const res = await fetch(`http://localhost:3000/api/weeklyplan/update/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planName: plan.planName, description: plan.description, days: fullDays })
      });
      const data = await res.json();
      if (data.success) {
        fetchPlans();
        setExpandedDay(null);
      }
    } catch (err) { console.error(err); }
    finally { setSavingDay(null); }
  };

  const selectStyle = {
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: '0.85rem',
    flex: 1
  };

  const numStyle = {
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    width: '65px',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: '0.85rem'
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '4rem', color: 'var(--accent-color)' }}>TRAINING</h1>
          <h1 style={{ fontSize: '4rem', marginTop: '-1rem' }}>PLANS</h1>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '1rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={20} /> NEW PLAN
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card-glow" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>CREATE NEW PLAN</h3>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input className="input-field" placeholder="PLAN NAME (E.G. PPL SPLIT)" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} required />
              <input className="input-field" placeholder="DESCRIPTION (OPTIONAL)" value={newPlanDesc} onChange={e => setNewPlanDesc(e.target.value)} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">INITIALIZE PLAN</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}><X size={16} /> CANCEL</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p style={{ color: '#aaa', fontWeight: 700, fontSize: '1.2rem' }}>LOADING PLANS...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {plans.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 700 }}>NO PLANS YET. BUILD YOUR FIRST ROUTINE!</p>
            </div>
          )}

          {plans.map(plan => (
            <div key={plan._id} className="card" style={{ borderLeft: plan.isActive ? '6px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)' }}>
              {/* Plan Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedPlan === plan._id ? '2rem' : 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{plan.planName}</h3>
                    {plan.isActive && (
                      <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={12} /> ACTIVE
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{plan.description || 'No description'}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {plan.isActive ? (
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem 1rem' }} onClick={() => handleDeactivate(plan)}>DEACTIVATE</button>
                  ) : (
                    <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.6rem 1rem' }} onClick={() => handleActivate(plan._id)}><Check size={14} /> ACTIVATE</button>
                  )}
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.6rem 1rem' }}
                    onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}
                  >
                    {expandedPlan === plan._id ? <><ChevronUp size={16} /> CLOSE</> : <><ChevronDown size={16} /> EDIT DAYS</>}
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.5rem' }} onClick={() => handleDeletePlan(plan._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Day Builder (expanded) */}
              <AnimatePresence>
                {expandedPlan === plan._id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {DAYS.map(day => {
                        const dayExercises = drafts[plan._id]?.[day] || [];
                        const isExpanded = expandedDay === `${plan._id}-${day}`;
                        return (
                          <div key={day} style={{ border: isExpanded ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                            <button
                              onClick={() => setExpandedDay(isExpanded ? null : `${plan._id}-${day}`)}
                              style={{
                                width: '100%', padding: '0.8rem 0.5rem', background: isExpanded ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800,
                                fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Inter'
                              }}
                            >
                              {day.slice(0, 3).toUpperCase()}
                              <div style={{ fontSize: '0.7rem', color: isExpanded ? 'rgba(255,255,255,0.8)' : '#888', marginTop: '0.2rem', fontWeight: 600 }}>
                                {dayExercises.length} EX
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
                          <motion.div key={expandedDay} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                              <h4 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>{day.toUpperCase()} — EXERCISES</h4>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => addExerciseToDay(plan._id, day)}>
                                  <Plus size={14} /> ADD
                                </button>
                                <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => saveDayExercises(plan._id, day)} disabled={savingDay === day}>
                                  <Save size={14} /> {savingDay === day ? 'SAVING...' : 'SAVE DAY'}
                                </button>
                              </div>
                            </div>

                            {dayExs.length === 0 ? (
                              <p style={{ color: '#666', fontWeight: 600 }}>No exercises for {day}. Click ADD to assign exercises.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {dayExs.map((ex, idx) => (
                                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)' }}>
                                    <select value={ex.exercise} onChange={e => updateExerciseField(plan._id, day, idx, 'exercise', e.target.value)} style={selectStyle}>
                                      {exercises.map(e => <option key={e._id} value={e._id} style={{background:'#222'}}>{e.name}</option>)}
                                    </select>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <label style={{ margin: 0, fontSize: '0.7rem', color: '#aaa' }}>SETS</label>
                                      <input type="number" min="1" value={ex.sets} onChange={e => updateExerciseField(plan._id, day, idx, 'sets', e.target.value)} style={numStyle} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <label style={{ margin: 0, fontSize: '0.7rem', color: '#aaa' }}>REPS</label>
                                      <input type="number" min="1" value={ex.reps} onChange={e => updateExerciseField(plan._id, day, idx, 'reps', e.target.value)} style={numStyle} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <label style={{ margin: 0, fontSize: '0.7rem', color: '#aaa' }}>MINS</label>
                                      <input type="number" min="0" value={ex.duration} onChange={e => updateExerciseField(plan._id, day, idx, 'duration', e.target.value)} style={numStyle} />
                                    </div>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={() => removeExerciseFromDay(plan._id, day, idx)}>
                                      <X size={16} />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyPlans;
