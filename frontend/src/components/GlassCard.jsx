import React, { useRef, useState } from 'react';

const GlassCard = ({
  children,
  variant = 'default', // 'default' | 'glow' | 'light'
  hover = true,
  tilt = false,
  style = {},
  className = '',
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    if (tilt) setTransform('');
  };

  const baseStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    transition: 'all var(--transition)',
    transform: transform,
    cursor: onClick ? 'pointer' : 'default',
  };

  const variants = {
    default: {
      background: 'var(--glass-bg-card)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-sm)',
    },
    glow: {
      background: 'var(--glass-bg-card)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--accent)',
      boxShadow: 'var(--shadow-glow), inset 0 0 30px var(--accent-subtle)',
    },
    light: {
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur-light)',
      WebkitBackdropFilter: 'var(--glass-blur-light)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...baseStyle,
        ...variants[variant] || variants.default,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
