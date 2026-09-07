import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Onboarding = () => {
  const { token, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        // The backend `aiPreferences` expects arrays for injuries/equipment, let's split strings
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

  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '1rem'
  };

  const labelStyle = { display: 'block', marginBottom: '0.3rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      position: 'relative' 
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '700px', 
          padding: '3rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '2.5rem' }}>BUILD YOUR <span style={{ color: 'var(--accent-color)' }}>PROFILE</span></h2>
          <p style={{ color: '#aaa', fontWeight: 500 }}>We need your data to calibrate the AI Coach.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>BASIC METRICS</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="fullname" style={inputStyle} required value={formData.fullname} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" style={inputStyle} required value={formData.age} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" style={inputStyle} required value={formData.gender} onChange={handleChange}>
                <option value="male" style={{color:'#000'}}>Male</option>
                <option value="female" style={{color:'#000'}}>Female</option>
                <option value="other" style={{color:'#000'}}>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" name="weight" style={inputStyle} required value={formData.weight} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Height (cm)</label>
              <input type="number" name="height" style={inputStyle} required value={formData.height} onChange={handleChange} />
            </div>
          </div>

          <h4 style={{ color: 'var(--accent-color)', margin: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>TRAINING PREFERENCES</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Experience Level</label>
              <select name="level" style={inputStyle} required value={formData.level} onChange={handleChange}>
                <option value="beginner" style={{color:'#000'}}>Beginner</option>
                <option value="intermediate" style={{color:'#000'}}>Intermediate</option>
                <option value="advanced" style={{color:'#000'}}>Advanced</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Primary Fitness Goal</label>
              <select name="fitnessGoal" style={inputStyle} required value={formData.aiPreferences.fitnessGoal} onChange={handleChange}>
                <option value="Muscle Gain" style={{color:'#000'}}>Muscle Gain</option>
                <option value="Fat Loss" style={{color:'#000'}}>Fat Loss</option>
                <option value="Endurance" style={{color:'#000'}}>Endurance</option>
                <option value="Strength" style={{color:'#000'}}>Strength</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Injuries (Comma separated)</label>
            <input type="text" name="injuries" placeholder="e.g., Bad knees, Lower back pain" style={inputStyle} value={formData.aiPreferences.injuries} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>Equipment Available (Comma separated)</label>
            <input type="text" name="equipmentAvailable" placeholder="e.g., Dumbbells, Barbell, Treadmill" style={inputStyle} value={formData.aiPreferences.equipmentAvailable} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'CALIBRATING...' : 'INITIALIZE PROFILE'} <CheckCircle2 size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
