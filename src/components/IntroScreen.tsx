import React from 'react';
import { Zap, Activity } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  return (
    <div
      id="intro-screen"
      className="fixed inset-0 z-50 bg-[#0b0f19] flex flex-col items-center justify-center p-4 text-center select-none"
    >
      {/* Cyber animated rings & Official App Logo */}
      <div className="relative flex items-center justify-center mb-6">
        <div
          className="w-28 h-28 rounded-3xl border-[3px] border-cyan-400/40 shadow-2xl shadow-cyan-500/30 overflow-hidden relative group"
        >
          <img
            src="/icon.png"
            alt="Speed-TessApp Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-cyan-400/50 animate-pulse absolute pointer-events-none -inset-2" />
      </div>

      {/* Speed-T Title */}
      <h1
        id="intro-title"
        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent mb-2"
        style={{
          textShadow: '0 0 24px rgba(0, 240, 255, 0.7), 0 0 45px rgba(59, 130, 246, 0.5)',
        }}
      >
        SPEED-T
      </h1>

      <p className="text-xs sm:text-sm text-cyan-300 font-mono mb-2 tracking-widest">
        CREATED BY:{' '}
        <span className="bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-400/30 font-bold text-white shadow-sm shadow-cyan-500/20">
          Anak bangsa
        </span>
      </p>

      <p className="text-xs text-gray-400 max-w-sm mb-8 leading-relaxed">
        Suite Uji Kecepatan Jaringan Real-Time & Visualisasi Objek 3D Interaktif
      </p>

      {/* Enter button */}
      <button
        id="start-btn-intro"
        onClick={onEnter}
        className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs tracking-widest uppercase cursor-pointer flex items-center gap-2"
      >
        <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
        ⚡ MULAI JELAJAHI
      </button>
    </div>
  );
};
