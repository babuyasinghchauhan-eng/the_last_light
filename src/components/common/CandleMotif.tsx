import React from 'react';
import { ambientSoundService } from '../../services/audio/ambientSound';

interface CandleMotifProps {
  isLit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  type?: 'tall' | 'tea' | 'glass';
  interactive?: boolean;
  onToggle?: (newState: boolean) => void;
  className?: string;
  soundEnabled?: boolean;
}

export const CandleMotif: React.FC<CandleMotifProps> = ({
  isLit = true,
  size = 'md',
  type = 'tall',
  interactive = false,
  onToggle,
  className = '',
  soundEnabled = false,
}) => {
  const sizeMap = {
    sm: { width: 36, height: 60, scale: 0.6 },
    md: { width: 50, height: 90, scale: 0.85 },
    lg: { width: 70, height: 130, scale: 1.1 },
    hero: { width: 110, height: 200, scale: 1.7 },
  };

  const currentSize = sizeMap[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;
    const nextState = !isLit;
    if (nextState && soundEnabled) {
      ambientSoundService.playCandleLightSound();
    }
    onToggle?.(nextState);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-end select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      style={{ width: currentSize.width, height: currentSize.height }}
      title={interactive ? (isLit ? 'Click to extinguish flame' : 'Click to light flame') : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {/* Dynamic ambient halo glow */}
      {isLit && (
        <div
          className="absolute -top-6 w-24 h-24 rounded-full pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(244,183,94,0.35) 0%, rgba(232,121,50,0.15) 45%, rgba(0,0,0,0) 70%)',
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Flame */}
      {isLit ? (
        <div className="candle-flame-anim relative mb-1 z-10 transition-transform duration-300">
          <svg
            width={currentSize.width * 0.48}
            height={currentSize.height * 0.42}
            viewBox="0 0 32 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer flame */}
            <path
              d="M16 2 C23 15 28 25 24 35 C20 43 12 43 8 35 C4 25 9 15 16 2 Z"
              fill="url(#outerFlameGrad)"
            />
            {/* Inner flame core */}
            <path
              d="M16 14 C19 23 21 29 19 36 C17 41 15 41 13 36 C11 29 13 23 16 14 Z"
              fill="url(#innerFlameGrad)"
            />
            {/* White-hot center */}
            <ellipse cx="16" cy="36" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.95" />
            <defs>
              <linearGradient id="outerFlameGrad" x1="16" y1="2" x2="16" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF2D6" />
                <stop offset="0.35" stopColor="#F4B75E" />
                <stop offset="0.75" stopColor="#E87932" />
                <stop offset="1" stopColor="#B34415" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="innerFlameGrad" x1="16" y1="14" x2="16" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.5" stopColor="#FDE68A" />
                <stop offset="1" stopColor="#F4B75E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ) : (
        /* Extinguished wick with subtle smoke whisper */
        <div className="relative mb-1 flex flex-col items-center">
          <div className="w-0.5 h-3 bg-neutral-600 rounded-t" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 -mt-1" />
        </div>
      )}

      {/* Candle Body */}
      {type === 'tall' && (
        <div className="relative flex flex-col items-center">
          {/* Wick */}
          {isLit && <div className="w-0.5 h-2 bg-[#2D2118] -mb-0.5 z-0" />}
          {/* Wax rim */}
          <div
            className="rounded-t-sm border-t border-[#F2E8D8]/20"
            style={{
              width: currentSize.width * 0.44,
              height: 4,
              backgroundColor: '#D9C7AF',
            }}
          />
          {/* Wax cylinder */}
          <div
            className="rounded-b-sm border-x border-b border-[#2A231C]/60"
            style={{
              width: currentSize.width * 0.44,
              height: currentSize.height * 0.52,
              background: 'linear-gradient(to right, #B89A61 0%, #E6D8C5 45%, #9E814D 100%)',
              boxShadow: isLit ? 'inset 0 4px 6px rgba(244,183,94,0.3)' : 'none',
            }}
          />
        </div>
      )}

      {type === 'tea' && (
        <div className="relative flex flex-col items-center">
          {isLit && <div className="w-0.5 h-1.5 bg-[#2D2118] -mb-0.5 z-0" />}
          {/* Metal/Glass cup */}
          <div
            className="rounded-sm border border-[#524436]"
            style={{
              width: currentSize.width * 0.65,
              height: currentSize.height * 0.28,
              background: 'linear-gradient(to right, #3A3228 0%, #D8C3A5 50%, #2E261E 100%)',
              boxShadow: isLit ? '0 0 10px rgba(244,183,94,0.2)' : 'none',
            }}
          />
        </div>
      )}

      {type === 'glass' && (
        <div className="relative flex flex-col items-center">
          {isLit && <div className="w-0.5 h-2 bg-[#2D2118] -mb-0.5 z-0" />}
          {/* Glass votive */}
          <div
            className="rounded-t border-t border-x border-[#F2E8D8]/30 backdrop-blur-xs"
            style={{
              width: currentSize.width * 0.52,
              height: currentSize.height * 0.56,
              background: isLit
                ? 'linear-gradient(to bottom, rgba(244,183,94,0.25) 0%, rgba(232,121,50,0.4) 60%, #873814 100%)'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(30,25,20,0.8) 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
