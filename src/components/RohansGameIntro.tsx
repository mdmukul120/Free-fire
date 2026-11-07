import React, { useEffect, useState } from 'react';
import { soundManager } from '../audio/soundManager';
import { Zap, Flame, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';

interface RohansGameIntroProps {
  onComplete: () => void;
}

export const RohansGameIntro: React.FC<RohansGameIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'blackout' | 'surge' | 'reveal' | 'climax' | 'fadeout'>('blackout');
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Stage 1: Surge starts
    const t1 = setTimeout(() => {
      setPhase('surge');
    }, 400);

    // Stage 2: Reveal logo & play audio
    const t2 = setTimeout(() => {
      setPhase('reveal');
      soundManager.play('company_logo');
    }, 1200);

    // Stage 3: Climax burst
    const t3 = setTimeout(() => {
      setPhase('climax');
    }, 2800);

    // Stage 4: Fade out to game loader
    const t4 = setTimeout(() => {
      setPhase('fadeout');
    }, 4200);

    // Final finish
    const t5 = setTimeout(() => {
      onComplete();
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const handleUserInteract = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      soundManager.play('company_logo');
    }
  };

  return (
    <div 
      onClick={handleUserInteract}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none transition-opacity duration-700 ${
        phase === 'fadeout' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid with Radial Glow */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,70,85,0.25)_0%,_rgba(255,140,0,0.1)_40%,_transparent_75%)] pointer-events-none" />

      {/* Lightning energy sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-3xl transition-transform duration-1000 ${
          phase === 'climax' ? 'scale-150 opacity-80' : 'scale-100 opacity-40'
        }`} />
        <div className={`absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl transition-transform duration-1000 ${
          phase === 'climax' ? 'scale-150 opacity-80' : 'scale-100 opacity-40'
        }`} />
      </div>

      {/* Central Studio Crest & Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Cyber Shield & Flame Icon */}
        <div 
          className={`relative mb-6 transition-all duration-1000 transform ${
            phase === 'blackout' 
              ? 'scale-50 opacity-0' 
              : phase === 'surge' 
              ? 'scale-90 opacity-70 blur-sm' 
              : phase === 'reveal' 
              ? 'scale-105 opacity-100 blur-0' 
              : 'scale-110 opacity-100'
          }`}
        >
          {/* Outer rotating pulse ring */}
          <div className="absolute -inset-6 rounded-full border-2 border-red-500/40 animate-ping opacity-25" />
          <div className="absolute -inset-10 rounded-full border border-amber-500/30 animate-pulse" />

          {/* Central Logo Crest */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-[3px] shadow-[0_0_50px_rgba(255,70,85,0.8)] cyber-border-angled animate-rohan-pulse flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/90 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-transparent to-transparent" />
              <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 drop-shadow-[0_0_15px_rgba(255,70,85,0.9)]" />
              <div className="absolute bottom-2 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-[10px] tracking-widest font-black text-amber-400 font-orbitron">RG</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Bengali Main Title "রোহান্স গেম" */}
        <div 
          className={`transition-all duration-700 delay-100 transform ${
            phase === 'blackout' || phase === 'surge'
              ? 'translate-y-8 opacity-0 blur-sm'
              : 'translate-y-0 opacity-100 blur-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>অরিজিনাল গেম প্রেজেন্টেশন</span>
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,140,0,0.8)] font-sans">
            রোহান্স গেম
          </h1>

          <div className="text-sm sm:text-xl md:text-2xl font-black tracking-[0.25em] text-slate-200 mt-2 font-orbitron">
            ROHAN'S GAME STUDIOS
          </div>

          <p className="text-xs sm:text-sm text-red-400/90 font-medium tracking-wider mt-1">
            FREAK 22 VS RAAD VAI YT • CYBER CITADEL 3D
          </p>
        </div>

        {/* Audio Visualizer Bars */}
        <div 
          className={`flex items-end justify-center gap-1.5 h-8 mt-6 transition-opacity duration-500 ${
            phase === 'reveal' || phase === 'climax' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[40, 75, 100, 60, 90, 45, 80, 50, 95, 70, 85, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-red-600 to-amber-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        {/* Sound prompt & skip button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundManager.play('ui_click_tap');
              onComplete();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-red-500/80 text-slate-300 hover:text-white text-xs sm:text-sm tracking-wider font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <span>স্কিপ করুন (SKIP)</span>
            <span className="text-amber-400">➔</span>
          </button>
        </div>
      </div>

      {/* Bottom Legal / Studio Watermark */}
      <div className="absolute bottom-4 text-center text-[11px] text-slate-500 tracking-wider">
        © 2026 ROHAN'S GAME • BENGALI VOICE ARENA • VERCEL & GITHUB COMPLIANT
      </div>
    </div>
  );
};
