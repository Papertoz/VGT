import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { Apple, Scale, Droplets, Activity } from 'lucide-react';

const ProgressNutrition = () => {
  const [activeTab, setActiveTab] = useState('nutrition');

  return (
    <div className="main-content">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Fuel & Fire
          </h1>
          <p style={{ fontSize: '0.85rem' }}>Track your nutrition and body metrics.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            className="btn"
            style={{
              background: activeTab === 'nutrition' ? 'var(--accent-subtle)' : 'var(--glass-bg-light)',
              color: activeTab === 'nutrition' ? 'var(--accent)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'nutrition' ? 'var(--border-accent)' : 'var(--border-light)'}`,
            }}
            onClick={() => setActiveTab('nutrition')}
          >
            <Apple size={16} /> Macros & Nutrition
          </button>
          <button
            className="btn"
            style={{
              background: activeTab === 'progress' ? 'var(--accent-subtle)' : 'var(--glass-bg-light)',
              color: activeTab === 'progress' ? 'var(--accent)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'progress' ? 'var(--border-accent)' : 'var(--border-light)'}`,
            }}
            onClick={() => setActiveTab('progress')}
          >
            <Scale size={16} /> Body Tracking
          </button>
        </div>

        {activeTab === 'nutrition' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard variant="glow" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
              <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.1rem' }}>Today's Targets</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                {[
                  { label: 'Calories', value: '2,450', unit: 'KCAL' },
                  { label: 'Protein', value: '180', unit: 'G' },
                  { label: 'Carbs', value: '250', unit: 'G' },
                  { label: 'Fats', value: '70', unit: 'G' },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{item.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                      <span style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>{item.value}</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem' }}>{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <GlassCard variant="light">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <Droplets size={18} color="var(--accent)" /> Hydration
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    flex: 1, background: 'var(--border)', height: '24px',
                    borderRadius: 'var(--radius-sm)', position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '60%',
                      background: 'var(--gradient-accent)', borderRadius: 'var(--radius-sm)',
                    }} />
                  </div>
                  <span style={{ fontFamily: 'Outfit', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>2.4 / 4L</span>
                </div>
              </GlassCard>

              <GlassCard variant="light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontWeight: 500, fontSize: '0.82rem' }}>* Full nutrition database API coming in v1.2</p>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Log Body Measurements</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {['Weight (kg)', 'Chest (cm)', 'Waist (cm)', 'Biceps (cm)'].map(field => (
                    <div key={field}>
                      <label>{field}</label>
                      <input type="number" className="input-field" />
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}
                  onClick={() => alert('Progress saved locally! API sync coming soon.')}
                >
                  Save Metrics
                </button>
              </form>
            </GlassCard>

            <GlassCard variant="light">
              <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <Activity size={18} color="var(--accent)" /> Recent Logs
              </h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>No previous measurements found. Start tracking today.</p>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressNutrition;
