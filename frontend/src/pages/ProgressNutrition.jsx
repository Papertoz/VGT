import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Apple, Scale, Flame, Droplets } from 'lucide-react';

const ProgressNutrition = () => {
  const [activeTab, setActiveTab] = useState('nutrition');

  return (
    <div className="main-content">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>FUEL & FIRE</h1>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Track your nutrition and body metrics.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          className="btn" 
          style={{ 
            background: activeTab === 'nutrition' ? 'var(--surface-color)' : '#fff', 
            color: activeTab === 'nutrition' ? '#fff' : '#111', 
            border: '1px solid #111' 
          }}
          onClick={() => setActiveTab('nutrition')}
        >
          <Apple size={18} /> MACROS & NUTRITION
        </button>
        <button 
          className="btn" 
          style={{ 
            background: activeTab === 'progress' ? 'var(--surface-color)' : '#fff', 
            color: activeTab === 'progress' ? '#fff' : '#111', 
            border: '1px solid #111' 
          }}
          onClick={() => setActiveTab('progress')}
        >
          <Scale size={18} /> BODY TRACKING
        </button>
      </div>

      {activeTab === 'nutrition' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="card" style={{ marginBottom: '2rem', borderLeft: '8px solid var(--accent-color)' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>TODAY'S TARGETS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>CALORIES</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.5rem', fontFamily: 'Anton', lineHeight: 1 }}>2,450</span>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700, marginBottom: '0.5rem' }}>KCAL</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>PROTEIN</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.5rem', fontFamily: 'Anton', lineHeight: 1 }}>180</span>
                  <span style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>G</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>CARBS</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.5rem', fontFamily: 'Anton', lineHeight: 1 }}>250</span>
                  <span style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>G</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>FATS</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3.5rem', fontFamily: 'Anton', lineHeight: 1 }}>70</span>
                  <span style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>G</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card-light">
              <h3 style={{ color: '#111', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets color="var(--accent-color)" /> HYDRATION
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, background: '#eee', height: '30px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '60%', background: 'var(--accent-color)' }} />
                </div>
                <span style={{ fontFamily: 'Anton', fontSize: '1.5rem' }}>2.4 / 4L</span>
              </div>
            </div>

            <div className="card-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>* FULL NUTRITION DATABASE API COMING IN UPDATE V1.2</p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'progress' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>LOG BODY MEASUREMENTS</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: '#aaa', fontWeight: 700, fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>WEIGHT (KG)</label>
                  <input type="number" className="input-field" style={{ background: '#222', color: '#fff', border: '1px solid #444' }} />
                </div>
                <div>
                  <label style={{ color: '#aaa', fontWeight: 700, fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>CHEST (CM)</label>
                  <input type="number" className="input-field" style={{ background: '#222', color: '#fff', border: '1px solid #444' }} />
                </div>
                <div>
                  <label style={{ color: '#aaa', fontWeight: 700, fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>WAIST (CM)</label>
                  <input type="number" className="input-field" style={{ background: '#222', color: '#fff', border: '1px solid #444' }} />
                </div>
                <div>
                  <label style={{ color: '#aaa', fontWeight: 700, fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>BICEPS (CM)</label>
                  <input type="number" className="input-field" style={{ background: '#222', color: '#fff', border: '1px solid #444' }} />
                </div>
              </div>
              <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Progress saved locally! API sync coming soon.')}>
                SAVE METRICS
              </button>
            </form>
          </div>

          <div className="card-light">
             <h3 style={{ color: '#111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity color="var(--accent-color)" /> RECENT LOGS
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No previous measurements found. Start tracking today.</p>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default ProgressNutrition;
