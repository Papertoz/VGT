import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ChevronDown, ChevronUp, X, Play } from 'lucide-react';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'];

const ExerciseCard = ({ ex, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="card"
      style={{ overflow: 'hidden', cursor: 'pointer', border: expanded ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* GIF / Image Preview */}
      {ex.imageUrl ? (
        <div style={{ height: '180px', overflow: 'hidden', margin: '-2rem -2rem 1.5rem -2rem', background: '#000' }}>
          <img
            src={ex.imageUrl}
            alt={ex.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      ) : (
        <div style={{ height: '120px', margin: '-2rem -2rem 1.5rem -2rem', background: 'linear-gradient(135deg, rgba(229,62,62,0.15) 0%, rgba(0,0,0,0.5) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🏋️</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.3rem' }}>{ex.name}</h4>
          <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 800 }}>
            {ex.muscleGroup?.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', color: '#fff', padding: '0.4rem' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', color: '#ef4444', padding: '0.4rem' }}
            onClick={() => onDelete(ex._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>CAL/MIN</p>
          <p style={{ fontSize: '1.2rem', fontFamily: 'Anton', color: 'var(--accent-color)', margin: 0 }}>{ex.caloriesPerMinute}</p>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', paddingTop: '1rem' }}>
              {ex.description && (
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>{ex.description}</p>
              )}
              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}
                >
                  <Play size={16} /> WATCH VIDEO TUTORIAL
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Exercises = () => {
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    muscleGroup: 'Chest',
    caloriesPerMinute: '',
    imageUrl: '',
    videoUrl: ''
  });

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/exercises', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setExercises(data.exercises);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchExercises(); }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/exercises/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newExercise, caloriesPerMinute: Number(newExercise.caloriesPerMinute) })
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setNewExercise({ name: '', description: '', muscleGroup: 'Chest', caloriesPerMinute: '', imageUrl: '', videoUrl: '' });
        fetchExercises();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE this exercise from your library?')) return;
    try {
      await fetch(`http://localhost:3000/api/exercises/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchExercises();
    } catch (err) { console.error(err); }
  };

  const filtered = filter === 'All' ? exercises : exercises.filter(e => e.muscleGroup?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '4rem', color: 'var(--accent-color)' }}>EXERCISE</h1>
          <h1 style={{ fontSize: '4rem', marginTop: '-1rem' }}>LIBRARY</h1>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '1rem' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> ADD EXERCISE
        </button>
      </div>

      {/* Muscle Group Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {['All', ...MUSCLE_GROUPS].map(mg => (
          <button
            key={mg}
            onClick={() => setFilter(mg)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === mg ? 'var(--accent-color)' : 'rgba(255,255,255,0.07)',
              border: filter === mg ? 'none' : '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
              fontFamily: 'Inter',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card-glow" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>ADD NEW EXERCISE</h3>
            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Exercise Name *</label>
                <input className="input-field" placeholder="e.g. Bench Press" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} required />
              </div>
              <div>
                <label>Muscle Group *</label>
                <select className="input-field" value={newExercise.muscleGroup} onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})} required>
                  {MUSCLE_GROUPS.map(mg => <option key={mg} value={mg} style={{background:'#222'}}>{mg}</option>)}
                </select>
              </div>
              <div>
                <label>Calories per Minute *</label>
                <input className="input-field" type="number" placeholder="e.g. 8" value={newExercise.caloriesPerMinute} onChange={e => setNewExercise({...newExercise, caloriesPerMinute: e.target.value})} required />
              </div>
              <div>
                <label>GIF / Image URL (for preview)</label>
                <input className="input-field" placeholder="https://example.com/exercise.gif" value={newExercise.imageUrl} onChange={e => setNewExercise({...newExercise, imageUrl: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <input className="input-field" placeholder="How to perform this exercise..." value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})} />
              </div>
              <div>
                <label>Video Tutorial URL</label>
                <input className="input-field" placeholder="https://youtube.com/..." value={newExercise.videoUrl} onChange={e => setNewExercise({...newExercise, videoUrl: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">SAVE EXERCISE</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}><X size={16} /> CANCEL</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p style={{ color: '#aaa', fontWeight: 700 }}>LOADING LIBRARY...</p>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 700 }}>NO EXERCISES FOUND. ADD SOME TO GET STARTED!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(ex => (
            <ExerciseCard key={ex._id} ex={ex} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Exercises;
