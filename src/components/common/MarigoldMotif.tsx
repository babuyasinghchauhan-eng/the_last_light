import React from 'react';

interface MarigoldMotifProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const MarigoldMotif: React.FC<MarigoldMotifProps> = ({
  size = 40,
  className = '',
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title="Cempasúchil (Marigold) — The flower of remembrance"
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,121,50,0.3) 0%, rgba(244,183,94,0.1) 60%, transparent 80%)',
            filter: 'blur(4px)',
          }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:rotate-12 duration-500"
      >
        <defs>
          <radialGradient id="marigoldCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8A3614" />
            <stop offset="60%" stopColor="#B34415" />
            <stop offset="100%" stopColor="#E87932" />
          </radialGradient>
          <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F4B75E" />
            <stop offset="100%" stopColor="#E87932" />
          </linearGradient>
          <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* Outer Petal Ring (12 petals) */}
        <g fill="url(#petalGrad1)" opacity="0.95">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <ellipse
              key={`outer-${i}`}
              cx="50"
              cy="20"
              rx="9"
              ry="18"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        {/* Middle Petal Ring (offset 15 deg) */}
        <g fill="url(#petalGrad2)" opacity="0.98">
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
            <ellipse
              key={`mid-${i}`}
              cx="50"
              cy="27"
              rx="7.5"
              ry="15"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        {/* Inner Petal Cluster */}
        <g fill="url(#petalGrad1)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={`inner-${i}`}
              cx="50"
              cy="34"
              rx="6"
              ry="11"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        {/* Center disk */}
        <circle cx="50" cy="50" r="14" fill="url(#marigoldCenter)" />
        <circle cx="50" cy="50" r="10" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
      </svg>
    </div>
  );
};
