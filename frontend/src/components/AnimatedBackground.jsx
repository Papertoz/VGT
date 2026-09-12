import React from 'react';
import { motion } from 'framer-motion';

const orbs = [
  { size: 400, x: '10%', y: '20%', color: 'rgba(59, 130, 246, 0.12)', delay: 0, duration: 20 },
  { size: 350, x: '70%', y: '60%', color: 'rgba(6, 182, 212, 0.08)', delay: 2, duration: 25 },
  { size: 300, x: '40%', y: '80%', color: 'rgba(59, 130, 246, 0.06)', delay: 4, duration: 22 },
  { size: 250, x: '80%', y: '10%', color: 'rgba(6, 182, 212, 0.1)', delay: 1, duration: 18 },
  { size: 200, x: '20%', y: '50%', color: 'rgba(59, 130, 246, 0.07)', delay: 3, duration: 28 },
];

const AnimatedBackground = ({ intensity = 1, style = {} }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      ...style
    }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size * intensity,
            height: orb.size * intensity,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(80px)',
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 20, -40, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
