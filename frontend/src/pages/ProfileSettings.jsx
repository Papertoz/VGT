import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import {
  Save, User, Activity, Target, Dumbbell,
  Sun, Moon, Camera, Check, AlertCircle
} from 'lucide-react';

const ProfileSettings = () => {
  const { userProfile, token, fetchProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [form, setForm] = useState({
    fullname: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    level: 'beginner',
    fitnessGoal: 'Muscle Gain',
    injuries: '',
    equipmentAvailable: '',
  });

  useEffect(() => {
    if (userProfile) {
      setPreviewImage(userProfile.profilePicture || null);
      setForm({
        fullname: userProfile.fullname || '',
        age: userProfile.age || '',
        weight: userProfile.weight || '',
        height: userProfile.height || '',
        gender: userProfile.gender || 'male',
        level: userProfile.level || 'beginner',
        fitnessGoal: userProfile.aiPreferences?.fitnessGoal || 'Muscle Gain',
        injuries: userProfile.aiPreferences?.injuries?.join(', ') || '',
        equipmentAvailable: userProfile.aiPreferences?.equipmentAvailable?.join(', ') || '',
      });
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setSaved(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const formData = new FormData();
      if (form.fullname) formData.append('fullname', form.fullname);
      if (form.age) formData.append('age', form.age);
      if (form.weight) formData.append('weight', form.weight);
      if (form.height) formData.append('height', form.height);
      if (form.gender) formData.append('gender', form.gender);
      if (form.level) formData.append('level', form.level);
      
      const aiPrefs = {
          fitnessGoal: form.fitnessGoal,
          injuries: form.injuries ? form.injuries.split(',').map(s => s.trim()) : [],
          equipmentAvailable: form.equipmentAvailable ? form.equipmentAvailable.split(',').map(s => s.trim()) : [],
      };
      formData.append('aiPreferences', JSON.stringify(aiPrefs));

      if (profileImage) {
        formData.append('profilePicture', profileImage);
      }

      const res = await fetch('http://localhost:3000/api/details/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await fetchProfile(token);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  };

  return (
    <div className="main-content">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Profile Settings
          </h1>
          <p style={{ fontSize: '0.85rem' }}>
            Manage your profile, preferences, and appearance.
          </p>
        </div>

        {/* Success / Error */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <Check size={16} /> Profile updated successfully!
          </motion.div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Personal Info Card */}
            <GlassCard style={{ gridColumn: 'span 2' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--glass-bg-light)',
                    border: '2px solid var(--accent)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={32} color="var(--accent)" />
                    )}
                  </div>
                  <label style={{
                    position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)',
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '2px solid var(--bg-primary)'
                  }}>
                    <Camera size={14} color="#fff" />
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Personal Information</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Update your photo and details</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ ...inputGroupStyle, gridColumn: 'span 2' }}>
                  <label>Full Name</label>
                  <input
                    name="fullname"
                    className="input-field"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>Age</label>
                  <input
                    name="age"
                    type="number"
                    className="input-field"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="25"
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>Gender</label>
                  <select name="gender" className="input-field" value={form.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={inputGroupStyle}>
                  <label>Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    className="input-field"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="70"
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>Height (cm)</label>
                  <input
                    name="height"
                    type="number"
                    className="input-field"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="175"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Training Preferences */}
            <GlassCard>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1.25rem',
              }}>
                <Target size={18} color="var(--accent)" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Training Preferences
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={inputGroupStyle}>
                  <label>Experience Level</label>
                  <select name="level" className="input-field" value={form.level} onChange={handleChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div style={inputGroupStyle}>
                  <label>Primary Fitness Goal</label>
                  <select name="fitnessGoal" className="input-field" value={form.fitnessGoal} onChange={handleChange}>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Strength">Strength</option>
                  </select>
                </div>
                <div style={inputGroupStyle}>
                  <label>Injuries (comma separated)</label>
                  <input
                    name="injuries"
                    className="input-field"
                    value={form.injuries}
                    onChange={handleChange}
                    placeholder="e.g., Bad knees, Lower back pain"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Equipment & Appearance */}
            <GlassCard>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1.25rem',
              }}>
                <Dumbbell size={18} color="var(--accent)" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Equipment & Appearance
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={inputGroupStyle}>
                  <label>Equipment Available (comma separated)</label>
                  <input
                    name="equipmentAvailable"
                    className="input-field"
                    value={form.equipmentAvailable}
                    onChange={handleChange}
                    placeholder="e.g., Dumbbells, Barbell, Treadmill"
                  />
                </div>

                {/* Theme Toggle */}
                <div style={inputGroupStyle}>
                  <label>Theme</label>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start', width: '100%',
                      padding: '0.75rem 1rem',
                    }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.5rem' }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
              <Save size={16} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
