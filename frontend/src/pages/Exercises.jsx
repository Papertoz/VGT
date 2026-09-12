import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Plus, Trash2, ChevronDown, ChevronUp, X, Play, Search } from 'lucide-react';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'];

const ExerciseCard = ({ ex, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout>
      <GlassCard
        style={{
          overflow: 'hidden', cursor: 'pointer',
          border: expanded ? '1px solid var(--accent)' : undefined,
        }}
      >
        {/* Image */}
        {ex.imageUrl ? (
          <div style={{
            height: '160px', overflow: 'hidden',
            margin: '-1.5rem -1.5rem 1rem -1.5rem',
            background: 'var(--bg-secondary)',
          }}>
            <img
              src={ex.imageUrl}
              alt={ex.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: 0.85, transition: 'opacity var(--transition)',
              }}
              onMouseEnter={e => e.target.style.opacity = '1'}
              onMouseLeave={e => e.target.style.opacity = '0.85'}
            />
          </div>
        ) : (
          <div style={{
            height: '100px', margin: '-1.5rem -1.5rem 1rem -1.5rem',
            background: 'var(--gradient-accent)',
            opacity: 0.15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2.5rem', opacity: 1 }}>🏋️</span>
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h4 style={{
              margin: '0 0 0.4rem 0', color: 'var(--text-primary)', fontSize: '1rem',
            }}>{ex.name}</h4>
            <span style={{
              background: 'var(--accent-subtle)', color: 'var(--accent)',
              padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 600,
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)',
            }}>
              {ex.muscleGroup?.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              style={{
                background: 'var(--glass-bg-light)', border: '1px solid var(--border-light)',
                cursor: 'pointer', color: 'var(--text-secondary)',
                padding: '0.3rem', borderRadius: 'var(--radius-sm)',
              }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer', color: '#ef4444',
                padding: '0.3rem', borderRadius: 'var(--radius-sm)',
              }}
              onClick={() => onDelete(ex._id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>CAL/MIN</p>
            <p style={{ fontSize: '1rem', fontFamily: 'Outfit', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {ex.caloriesPerMinute}
            </p>
          </div>
        </div>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                borderTop: '1px solid var(--border)',
                marginTop: '0.75rem', paddingTop: '0.75rem',
              }}>
                {ex.description && (
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    {ex.description}
                  </p>
                )}
                {ex.videoUrl && (
                  <a
                    href={ex.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      color: 'var(--accent)', fontWeight: 600, textDecoration: 'none',
                      fontSize: '0.78rem',
                    }}
                  >
                    <Play size={14} /> Watch Tutorial
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

const Exercises = () => {
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '', description: '', muscleGroup: 'Chest',
    caloriesPerMinute: '', imageUrl: '', videoUrl: ''
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
    if (!window.confirm('Delete this exercise from your library?')) return;
    try {
      await fetch(`http://localhost:3000/api/exercises/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchExercises();
    } catch (err) { console.error(err); }
  };

  const filtered = exercises
    .filter(e => filter === 'All' || e.muscleGroup?.toLowerCase() === filter.toLowerCase())
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="main-content">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Exercise Library
            </h1>
            <p style={{ fontSize: '0.85rem' }}>
              {exercises.length} exercises in your library
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Add Exercise
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{
          display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '0 0 250px' }}>
            <Search size={16} style={{
              position: 'absolute', left: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input
              className="input-field"
              placeholder="Search exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['All', ...MUSCLE_GROUPS].map(mg => (
              <button
                key={mg}
                onClick={() => setFilter(mg)}
                style={{
                  padding: '0.35rem 0.7rem',
                  background: filter === mg ? 'var(--accent-subtle)' : 'transparent',
                  border: `1px solid ${filter === mg ? 'var(--border-accent)' : 'var(--border-light)'}`,
                  color: filter === mg ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontWeight: 500, fontSize: '0.72rem',
                  fontFamily: 'Inter', borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition)',
                }}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <GlassCard variant="glow" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  Add New Exercise
                </h3>
                <form onSubmit={handleCreate} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                }}>
                  <div>
                    <label>Exercise Name *</label>
                    <input className="input-field" placeholder="e.g. Bench Press"
                      value={newExercise.name}
                      onChange={e => setNewExercise({...newExercise, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label>Muscle Group *</label>
                    <select className="input-field" value={newExercise.muscleGroup}
                      onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})} required
                    >
                      {MUSCLE_GROUPS.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Calories per Minute *</label>
                    <input className="input-field" type="number" placeholder="e.g. 8"
                      value={newExercise.caloriesPerMinute}
                      onChange={e => setNewExercise({...newExercise, caloriesPerMinute: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label>Image URL</label>
                    <input className="input-field" placeholder="https://..."
                      value={newExercise.imageUrl}
                      onChange={e => setNewExercise({...newExercise, imageUrl: e.target.value})}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label>Description</label>
                    <input className="input-field" placeholder="How to perform..."
                      value={newExercise.description}
                      onChange={e => setNewExercise({...newExercise, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label>Video URL</label>
                    <input className="input-field" placeholder="https://youtube.com/..."
                      value={newExercise.videoUrl}
                      onChange={e => setNewExercise({...newExercise, videoUrl: e.target.value})}
                    />
                  </div>
                  <div style={{
                    gridColumn: 'span 2', display: 'flex', gap: '0.75rem', marginTop: '0.25rem',
                  }}>
                    <button type="submit" className="btn btn-primary">Save Exercise</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Grid */}
        {loading ? (
          <p style={{ fontWeight: 500, fontSize: '0.85rem' }}>Loading library...</p>
        ) : filtered.length === 0 ? (
          <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              No exercises found. {exercises.length === 0 ? 'Add some to get started!' : 'Try a different filter.'}
            </p>
          </GlassCard>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {filtered.map(ex => (
              <ExerciseCard key={ex._id} ex={ex} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Exercises;
