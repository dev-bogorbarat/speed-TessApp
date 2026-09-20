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
      {/* Cyber animated rings */}
      <div className="relative flex items-center justify-center mb-8">
        <div
          className="w-28 h-28 rounded-full border-[3px] border-transparent border-t-cyan-400 border-b-blue-600 animate-spin"
          style={{ animationDuration: '1.4s' }}
        />
        <div
          className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin absolute"
          style={{ animationDuration: '4s', animationDirection: 'reverse' }}
        />
        <div className="w-12 h-12 rounded-full border border-indigo-500/50 flex items-center justify-center absolute">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute" />
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
