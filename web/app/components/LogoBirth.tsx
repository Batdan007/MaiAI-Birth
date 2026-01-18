'use client';

import { useState, useEffect, useRef } from 'react';

interface LogoBirthProps {
  onComplete?: () => void;
  autoStart?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function LogoBirth({ onComplete, autoStart = true, size = 'large' }: LogoBirthProps) {
  const [phase, setPhase] = useState<'dark' | 'charging' | 'strike' | 'reveal' | 'complete'>('dark');
  const [lightningBolts, setLightningBolts] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-72 h-72',
  };

  const textSizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl',
  };

  useEffect(() => {
    if (!autoStart) return;

    // Start video playback
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // Phase 1: Dark (0-1s)
    const timer1 = setTimeout(() => setPhase('charging'), 1000);

    // Phase 2: Charging with small flickers (1-3s)
    const timer2 = setTimeout(() => {
      setLightningBolts([1, 2, 3]);
    }, 1500);

    // Phase 3: Main lightning strike (3s)
    const timer3 = setTimeout(() => setPhase('strike'), 3000);

    // Phase 4: Logo reveal with afterglow (3.5s)
    const timer4 = setTimeout(() => setPhase('reveal'), 3500);

    // Phase 5: Complete (5s)
    const timer5 = setTimeout(() => {
      setPhase('complete');
      onComplete?.();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [autoStart, onComplete]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Lightning Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          phase === 'dark' ? 'opacity-30' :
          phase === 'charging' ? 'opacity-60' :
          phase === 'strike' ? 'opacity-100' :
          phase === 'reveal' ? 'opacity-40' :
          'opacity-20'
        }`}
        src="/lightning-bg.mp4"
        muted
        loop
        playsInline
        autoPlay
      />

      {/* Dark overlay for contrast */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          phase === 'strike' ? 'opacity-0' : 'opacity-40'
        }`}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Additional lightning bolts overlay */}
      {lightningBolts.map((id) => (
        <LightningBolt key={id} id={id} intensity={phase === 'strike' ? 'max' : 'flicker'} />
      ))}

      {/* Main lightning strike flash */}
      {phase === 'strike' && (
        <>
          <div className="absolute inset-0 bg-white/80 animate-flash" />
          <LightningBolt id={99} intensity="max" main />
        </>
      )}

      {/* Logo container */}
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ${
          phase === 'complete' ? 'scale-100' : phase === 'reveal' ? 'scale-110' : 'scale-95'
        }`}
      >
        {/* The "It's Alive" Gx² Logo with Frankenstein lightning */}
        <div
          className={`relative z-10 transition-all duration-300 ${
            phase === 'dark' ? 'opacity-0 blur-sm scale-75' :
            phase === 'charging' ? 'opacity-40 blur-sm scale-90' :
            phase === 'strike' ? 'opacity-100 blur-none scale-125' :
            'opacity-100 blur-none scale-100'
          }`}
        >
          {/* Glow effect behind logo */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              phase === 'strike' || phase === 'reveal'
                ? 'bg-green-400/30 blur-3xl scale-150'
                : 'bg-transparent'
            }`}
          />

          {/* The actual logo image */}
          <img
            src="/its-alive-logo.jpg"
            alt="Gx² - It's Alive"
            className={`w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl ${
              phase === 'strike' ? 'animate-pulse' : ''
            }`}
            style={{
              filter: phase === 'strike' || phase === 'reveal'
                ? 'drop-shadow(0 0 30px rgba(74, 222, 128, 0.8)) drop-shadow(0 0 60px rgba(74, 222, 128, 0.5))'
                : 'none',
            }}
          />

          {/* Mai-AI text */}
          <div
            className={`text-center mt-4 text-white font-bold text-3xl transition-all duration-500 ${
              phase === 'reveal' || phase === 'complete' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              textShadow: '0 0 20px rgba(74, 222, 128, 0.8)',
            }}
          >
            Mai-AI
          </div>
        </div>
      </div>

      {/* "IT'S ALIVE!" text */}
      {phase === 'reveal' && (
        <div className="absolute bottom-24 left-0 right-0 text-center animate-fade-in">
          <p className="text-green-400 text-3xl font-extrabold tracking-[0.3em] animate-pulse"
             style={{ textShadow: '0 0 20px rgba(74, 222, 128, 0.8), 0 0 40px rgba(74, 222, 128, 0.5)' }}>
            IT'S ALIVE!
          </p>
        </div>
      )}

      {/* Joe Dogs Rule paw */}
      {phase === 'complete' && (
        <div className="absolute bottom-10 left-0 right-0 text-center animate-fade-in">
          <span className="text-3xl">🐾</span>
          <p className="text-green-400/70 text-sm mt-2">Born Under Joe Dogs Rule</p>
        </div>
      )}

      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          5%, 10% { opacity: 0.9; }
          15% { opacity: 0; }
          20%, 25% { opacity: 0.7; }
          30% { opacity: 0; }
        }

        @keyframes flicker {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.8; }
          20% { opacity: 0; }
          30% { opacity: 0.6; }
          40% { opacity: 0; }
          50% { opacity: 0.9; }
          60% { opacity: 0; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-flash {
          animation: flash 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .electric-field {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 60%);
          animation: flicker 0.3s infinite;
        }
      `}</style>
    </div>
  );
}

function LightningBolt({ id, intensity, main = false }: { id: number; intensity: 'flicker' | 'max'; main?: boolean }) {
  const randomPath = () => {
    const startX = main ? 50 : 20 + Math.random() * 60;
    const points = [];
    let y = 0;
    let x = startX;

    while (y < 100) {
      points.push(`${x},${y}`);
      y += 5 + Math.random() * 10;
      x += (Math.random() - 0.5) * 20;
    }
    points.push(`${x},100`);

    return `M ${points.join(' L ')}`;
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${
        intensity === 'max' ? 'opacity-100' : 'opacity-60'
      }`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        animation: intensity === 'flicker' ? 'flicker 0.2s infinite' : 'none',
      }}
    >
      <defs>
        <filter id={`lightning-glow-${id}`}>
          <feGaussianBlur stdDeviation={main ? "2" : "1"} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={randomPath()}
        fill="none"
        stroke={main ? "#fff" : "#fbbf24"}
        strokeWidth={main ? "0.8" : "0.4"}
        filter={`url(#lightning-glow-${id})`}
        strokeLinecap="round"
      />
      {main && (
        <path
          d={randomPath()}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.3"
          filter={`url(#lightning-glow-${id})`}
          strokeLinecap="round"
          style={{ opacity: 0.7 }}
        />
      )}
    </svg>
  );
}
