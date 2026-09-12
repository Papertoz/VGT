import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Brain, Activity, HeartPulse, ChevronRight, Zap, Target, BarChart3, ArrowRight, Star } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import ParticleField from '../components/ParticleField';
import AnimatedCounter from '../components/AnimatedCounter';
import GlassCard from '../components/GlassCard';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#060b18', color: '#e8edf5', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: 'rgba(13, 25, 55, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '1rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
          <div style={{
            width: 36, height: 36, borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={18} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem',
            color: '#e8edf5',
          }}>VGT<span style={{ color: '#3b82f6' }}>AI</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it Works', id: 'how-it-works' },
            { label: 'Stats', id: 'stats' }
          ].map(item => (
            <span key={item.id} style={{
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
              color: '#8494b2',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => e.target.style.color = '#3b82f6'}
            onMouseLeave={e => e.target.style.color = '#8494b2'}
            onClick={() => scrollToSection(item.id)}
            >{item.label}</span>
          ))}
          <button className="btn" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(59, 130, 246, 0.25)',
          }} onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 3rem',
        overflow: 'hidden',
      }}>
        <AnimatedBackground intensity={1.2} />

        {/* Hero Image Overlay - reduced opacity so image is clearly visible */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.35,
        }} />
        {/* Subtle gradient to ensure text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(6,11,24,0.4) 0%, rgba(6,11,24,0.95) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '900px', width: '100%',
          textAlign: 'center',
        }}>
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem', borderRadius: '50px',
                background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '0.78rem', fontWeight: 600, color: '#60a5fa',
              }}>
                <Zap size={14} /> AI-Powered Fitness Training
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontSize: '3.8rem', fontFamily: 'Outfit', fontWeight: 900,
              color: '#e8edf5', lineHeight: 1.1,
              marginBottom: '1.5rem', letterSpacing: '-0.03em',
            }}>
              Transform Your Body{' '}
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                With Intelligence
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{
              fontSize: '1.1rem', color: '#8494b2',
              maxWidth: '600px', margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}>
              Your personal AI coach that creates customized workout plans,
              tracks your progress, and adapts to help you reach your fitness goals faster.
            </motion.p>

            <motion.div variants={fadeUp} style={{
              display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
            }}>
              <button
                className="btn"
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.9rem 2rem', fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px rgba(59, 130, 246, 0.25)',
                }}
              >
                Start Training Free <ChevronRight size={18} />
              </button>
              <button
                className="btn"
                onClick={() => scrollToSection('features')}
                style={{
                  padding: '0.9rem 2rem', fontSize: '0.9rem',
                  background: 'rgba(13, 25, 55, 0.65)',
                  color: '#e8edf5', border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                See Features
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" style={{ padding: '5rem 3rem', position: 'relative' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>Features</span>
            <h2 style={{
              fontSize: '2.2rem', color: '#e8edf5',
              marginTop: '0.5rem',
            }}>Everything You Need to Excel</h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {[
              { icon: <Brain size={24} />, title: 'AI Coach', desc: 'Intelligent workout recommendations personalized to your goals and body type.' },
              { icon: <Activity size={24} />, title: 'Live Tracking', desc: 'Real-time exercise tracking with set counters, timers, and rest management.' },
              { icon: <Target size={24} />, title: 'Goal Planning', desc: 'Weekly plan builder with day-by-day exercise scheduling and management.' },
              { icon: <HeartPulse size={24} />, title: 'Recovery Insights', desc: 'AI-generated recovery protocols and nutrition guidance after every session.' },
            ].map((feat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(59, 130, 246, 0.12)',
                  borderRadius: '12px', padding: '1.5rem',
                  height: '100%',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3b82f6', marginBottom: '1rem',
                  }}>
                    {feat.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e8edf5' }}>{feat.title}</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#8494b2' }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" style={{
        padding: '5rem 3rem',
        background: '#0a1128',
        position: 'relative',
      }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>How It Works</span>
            <h2 style={{
              fontSize: '2.2rem', color: '#e8edf5',
              marginTop: '0.5rem',
            }}>Three Steps to a Better You</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { step: '01', title: 'Create Profile', desc: 'Tell us your goals, fitness level, and equipment. Our AI calibrates to your needs.' },
              { step: '02', title: 'Get Your Plan', desc: 'Receive a customized weekly workout plan. Modify it or let AI optimize it for you.' },
              { step: '03', title: 'Train & Grow', desc: 'Follow guided workouts with live tracking. Watch your progress with AI insights.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(59, 130, 246, 0.12)',
                  borderRadius: '12px', padding: '2rem 1.5rem',
                  textAlign: 'center',
                }}>
                  <span style={{
                    fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'block', marginBottom: '1rem',
                  }}>{item.step}</span>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e8edf5' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#8494b2' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" style={{ padding: '5rem 3rem', position: 'relative' }}>
        <AnimatedBackground intensity={0.5} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{
            maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10,
          }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>By The Numbers</span>
            <h2 style={{
              fontSize: '2.2rem', color: '#e8edf5',
              marginTop: '0.5rem',
            }}>Built for Serious Athletes</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[
              { value: 500, suffix: '+', label: 'Exercises' },
              { value: 10000, suffix: '+', label: 'Workouts Logged' },
              { value: 95, suffix: '%', label: 'Goal Success Rate' },
              { value: 24, suffix: '/7', label: 'AI Availability' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(59, 130, 246, 0.12)',
                  borderRadius: '12px', padding: '2rem 1rem',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900,
                    color: '#3b82f6', marginBottom: '0.25rem',
                  }}>
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: '#8494b2' }}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{
        padding: '5rem 3rem',
        background: '#0a1128',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Interactive Particle Field in CTA */}
        <ParticleField particleCount={60} style={{ opacity: 0.6 }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            position: 'relative', zIndex: 10,
          }}
        >
          <motion.div variants={fadeUp}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #3b82f6',
              borderRadius: '12px', padding: '3rem 2rem',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.15), inset 0 0 30px rgba(59, 130, 246, 0.08)',
            }}>
              <h2 style={{
                fontSize: '2rem', color: '#e8edf5',
                marginBottom: '1rem',
              }}>Ready to Start Your Journey?</h2>
              <p style={{
                fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.7, color: '#8494b2'
              }}>
                Join thousands of athletes who trust VGT AI to plan, track, and optimize their training.
              </p>
              <button
                className="btn"
                onClick={() => navigate('/login')}
                style={{
                  padding: '1rem 2.5rem', fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: '#ffffff', border: 'none', borderRadius: '8px',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  cursor: 'pointer', fontWeight: 600,
                  boxShadow: '0 2px 10px rgba(59, 130, 246, 0.25)',
                }}
              >
                Get Started — It's Free <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '2rem 3rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#060b18',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Dumbbell size={16} color="#3b82f6" />
          <span style={{
            fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem',
            color: '#4a5a78',
          }}>VGT AI</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#4a5a78' }}>
          © 2026 VGT AI. Your intelligent fitness companion.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy', 'Terms', 'Support'].map(link => (
            <span key={link} style={{
              fontSize: '0.78rem', color: '#4a5a78',
              cursor: 'pointer', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#3b82f6'}
            onMouseLeave={e => e.target.style.color = '#4a5a78'}
            >{link}</span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
