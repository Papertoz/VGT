import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, User, Target, Dumbbell } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const STEPS = [
  { id: 'basics', label: 'Basics', icon: <User size={16} /> },
  { id: 'metrics', label: 'Metrics', icon: <Target size={16} /> },
  { id: 'preferences', label: 'Preferences', icon: <Dumbbell size={16} /> },
];

const Onboarding = () => {
  const { token, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    level: 'beginner',
    aiPreferences: {
      fitnessGoal: 'Muscle Gain',
      injuries: '',
      equipmentAvailable: 'Full Gym'
    }
  });

  const handleChange = (e) => {
    if (['fitnessGoal', 'injuries', 'equipmentAvailable'].includes(e.target.name)) {
      setFormData({
        ...formData,
        aiPreferences: { ...formData.aiPreferences, [e.target.name]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        aiPreferences: {
          fitnessGoal: formData.aiPreferences.fitnessGoal,
          injuries: formData.aiPreferences.injuries ? formData.aiPreferences.injuries.split(',').map(s=>s.trim()) : [],
          equipmentAvailable: formData.aiPreferences.equipmentAvailable ? formData.aiPreferences.equipmentAvailable.split(',').map(s=>s.trim()) : []
        }
      };

      const res = await fetch('http://localhost:3000/api/details/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        await fetchProfile(token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return formData.fullname && formData.age;
    if (step === 1) return formData.weight && formData.height && formData.gender;
    return true;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      background: 'var(--bg-primary)',
    }}>
      <AnimatedBackground intensity={0.7} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '600px',
          padding: '2.5rem',
          background: 'var(--glass-bg-card)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.6rem' }}>
            Build Your{' '}
            <span style={{
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Profile</span>
          </h2>
          <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
            We need your data to calibrate the AI Coach.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center',
        }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.8rem', borderRadius: '50px',
              background: i === step ? 'var(--accent-subtle)' : 'transparent',
              border: `1px solid ${i === step ? 'var(--border-accent)' : 'var(--border)'}`,
              color: i === step ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '0.72rem', fontWeight: 600,
              transition: 'all var(--transition)',
            }}>
              {i < step ? <CheckCircle2 size={14} /> : s.icon}
              {s.label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1 — Basics */}
            {step === 0 && (
              <motion.div
                key="basics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label>Full Name</label>
                    <input type="text" name="fullname" className="input-field" required
                      value={formData.fullname} onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label>Age</label>
                    <input type="number" name="age" className="input-field" required
                      value={formData.age} onChange={handleChange}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label>Experience Level</label>
                    <select name="level" className="input-field" required
                      value={formData.level} onChange={handleChange}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Metrics */}
            {step === 1 && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label>Gender</label>
                    <select name="gender" className="input-field" required
                      value={formData.gender} onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label>Weight (kg)</label>
                    <input type="number" name="weight" className="input-field" required
                      value={formData.weight} onChange={handleChange} placeholder="70"
                    />
                  </div>
                  <div>
                    <label>Height (cm)</label>
                    <input type="number" name="height" className="input-field" required
                      value={formData.height} onChange={handleChange} placeholder="175"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Preferences */}
            {step === 2 && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label>Primary Fitness Goal</label>
                    <select name="fitnessGoal" className="input-field" required
                      value={formData.aiPreferences.fitnessGoal} onChange={handleChange}
                    >
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Endurance">Endurance</option>
                      <option value="Strength">Strength</option>
                    </select>
                  </div>
                  <div>
                    <label>Injuries (comma separated)</label>
                    <input type="text" name="injuries" className="input-field"
                      placeholder="e.g., Bad knees, Lower back pain"
                      value={formData.aiPreferences.injuries} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Equipment Available (comma separated)</label>
                    <input type="text" name="equipmentAvailable" className="input-field"
                      placeholder="e.g., Dumbbells, Barbell, Treadmill"
                      value={formData.aiPreferences.equipmentAvailable} onChange={handleChange}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{
            display: 'flex', gap: '1rem', marginTop: '2rem',
            justifyContent: step === 0 ? 'flex-end' : 'space-between',
          }}>
            {step > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(s => s - 1)}
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
                disabled={loading}
              >
                {loading ? 'Calibrating...' : 'Initialize Profile'}
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
