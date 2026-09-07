import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bike, Flame, Activity, HeartPulse } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      
      {/* Navbar (Vital Style) */}
      <nav style={{ 
        background: '#ffffff', 
        padding: '1rem 4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111' }}>VGT<span style={{ color: 'var(--accent-color)' }}>AI</span></h2>
        </div>
        
        <div style={{ display: 'none', '@media (minWidth: 768px)': { display: 'flex' }, gap: '2rem' }}>
          {['HOME', 'SERVICES', 'ABOUT', 'BLOG', 'CONTACT'].map(item => (
            <span key={item} style={{ fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>{item}</span>
          ))}
        </div>

        <button className="btn" style={{ background: '#111', color: '#fff', padding: '0.8rem 1.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/login')}>
          BECOME A MEMBER
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '80vh',
        backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '4rem'
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }} />
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 style={{ color: '#fff', fontSize: '6rem', letterSpacing: '2px' }}>
              REACH YOUR<br/>
              <span style={{ color: 'var(--accent-color)' }}>FITNESS</span> GOALS
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ maxWidth: '350px', textAlign: 'right' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>
              THE FASTEST WAY TO BECOME A BETTER ATHLETE
            </h3>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
              PERSONAL TRAINING
            </button>
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--bg-color)' }}>
        {[
          { icon: <Bike color="var(--accent-color)" size={32} />, title: "THE RIDE", desc: "Track endurance and stamina in real-time." },
          { icon: <Flame color="var(--accent-color)" size={32} />, title: "MIND BODY BURN", desc: "AI-driven recovery protocols post-workout." },
          { icon: <Activity color="var(--accent-color)" size={32} />, title: "CARDIO & DANCE", desc: "Analyze movement patterns and heart rate." },
          { icon: <HeartPulse color="var(--accent-color)" size={32} />, title: "ACTION SPORTS", desc: "Explosive power metrics and live tracking." }
        ].map((feat, i) => (
          <div key={i} style={{ padding: '3rem', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ marginBottom: '1.5rem' }}>{feat.icon}</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{feat.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Action / Philosophy Section */}
      <section style={{ position: 'relative', padding: '8rem 4rem', background: 'var(--bg-color)', overflow: 'hidden' }}>
        
        {/* Massive Faded Background Text */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center', zIndex: 0, pointerEvents: 'none' }}>
          <h1 style={{ fontSize: '15rem', color: '#e5e5e0', lineHeight: 0.8, whiteSpace: 'nowrap' }}>
            FITNESS<br/>CARDIO<br/>SPORT
          </h1>
        </div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ maxWidth: '400px' }}>
            <h5 style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>WELCOME</h5>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              DEDICATED TO IGNITING YOUR PASSION FOR HEALTH
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              VGT AI is not just a tracker. It is a fully manual, highly customizable workout planner backed by an intelligent AI coach that evaluates your goals and corrects your path.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              ABOUT US
            </button>
          </div>
        {/* Right side Image block */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
          <img 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
            alt="Athlete" 
            style={{
              maxHeight: '600px',
              objectFit: 'contain',
              boxShadow: '-20px 20px 0px 0px var(--accent-color)',
              border: '4px solid #111'
            }} 
          />
        </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
