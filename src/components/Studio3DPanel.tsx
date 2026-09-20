import React from 'react';
import { Lock, Box, Sparkles, Orbit, Volume2, VolumeX, Rocket, Layers } from 'lucide-react';
import { ShapeType, ColorTheme, VisualFxMode, WarpMode } from '../types';
import { cyberSound } from '../utils/cyberSound';

interface Studio3DPanelProps {
  isProMember: boolean;
  shape: ShapeType;
  colorHex: number;
  wireframe: boolean;
  rotationSpeed: number;
  fxMode: VisualFxMode;
  warpMode: WarpMode;
  soundEnabled: boolean;
  onSelectShape: (shape: ShapeType) => void;
  onSelectColor: (hex: number) => void;
  onToggleWireframe: (val: boolean) => void;
  onChangeSpeed: (val: number) => void;
  onSelectFxMode: (mode: VisualFxMode) => void;
  onToggleWarp: (mode: WarpMode) => void;
  onToggleSound: (enabled: boolean) => void;
  onOpenVipModal: () => void;
}

const COLOR_PALETTES: ColorTheme[] = [
  { name: 'Cyan Neon', hex: 0x00f0ff, css: 'bg-[#00f0ff]', glow: 'shadow-[#00f0ff]/50' },
  { name: 'Cyber Blue', hex: 0x3b82f6, css: 'bg-[#3b82f6]', glow: 'shadow-[#3b82f6]/50' },
  { name: 'Neon Pink', hex: 0xec4899, css: 'bg-[#ec4899]', glow: 'shadow-[#ec4899]/50' },
  { name: 'Matrix Emerald', hex: 0x10b981, css: 'bg-[#10b981]', glow: 'shadow-[#10b981]/50' },
  { name: 'Solar Amber', hex: 0xf59e0b, css: 'bg-[#f59e0b]', glow: 'shadow-[#f59e0b]/50' },
  { name: 'Synth Violet', hex: 0x8b5cf6, css: 'bg-[#8b5cf6]', glow: 'shadow-[#8b5cf6]/50' },
];

export const Studio3DPanel: React.FC<Studio3DPanelProps> = ({
  isProMember,
  shape,
  colorHex,
  wireframe,
  rotationSpeed,
  fxMode,
  warpMode,
  soundEnabled,
  onSelectShape,
  onSelectColor,
  onToggleWireframe,
  onChangeSpeed,
  onSelectFxMode,
  onToggleWarp,
  onToggleSound,
  onOpenVipModal,
}) => {
  return (
    <div className="bg-gray-900/85 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden text-white">
      {/* PRO LOCK OVERLAY (If not PRO member) */}
      {!isProMember && (
        <div
          id="3d-pro-lock"
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center z-20 p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-base font-black text-amber-300 uppercase tracking-wide">
              Studio Animasi 3D Terkunci
            </h3>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              Upgrade ke versi <strong className="text-amber-400">Speed-T PRO</strong> untuk bebas membuka 6 bentuk geometri sci-fi, mode Hyperspace Warp, efek Chrome & Point Cloud, serta audio synthesizer!
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center w-full">
            <button
              onClick={onOpenVipModal}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              👑 BUKA FITUR PRO (RP 15.000)
            </button>
            <button
              onClick={onOpenVipModal}
              className="text-[11px] text-amber-300/90 hover:text-amber-200 underline underline-offset-2 transition cursor-pointer pt-1"
            >
              🔑 Punya kode lisensi? Klik untuk masukkan
            </button>
          </div>
        </div>
      )}

      {/* Header with VIP Controls */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Fitur Berbayar (PRO)
          </span>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              title={soundEnabled ? 'Matikan Audio Cyber' : 'Aktifkan Audio Cyber'}
              disabled={!isProMember}
              onClick={() => {
                const next = !soundEnabled;
                cyberSound.setMasterEnabled(next);
                onToggleSound(next);
                if (next) cyberSound.playClick();
              }}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {isProMember && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                VIP STUDIO
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
          <Box className="w-5 h-5 text-cyan-400" />
          Kustomisasi Animasi 3D & FX
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Ubah geometri visual, mode shading, kecepatan putar, dan efek Hyperspace Warp.
        </p>
      </div>

      {/* 6 Geometries (VIP Collection) */}
      <div className="space-y-2">
        <label className="text-xs text-gray-300 font-medium flex items-center justify-between">
          <span>Bentuk Geometri 3D (6 Model):</span>
          <span className="text-[10px] text-amber-400 font-mono">Sci-Fi Library</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'torus', label: 'Hyper Torus' },
            { id: 'sphere', label: 'Icosahedron' },
            { id: 'cube', label: 'Cyber Cube' },
            { id: 'dodecahedron', label: 'Crystal Dodeca' },
            { id: 'helix', label: 'Cyber DNA' },
            { id: 'octahedron', label: 'Diamond Octa' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (isProMember) {
                  cyberSound.playClick();
                  onSelectShape(item.id as ShapeType);
                }
              }}
              className={`py-2 px-1 text-[11px] rounded-xl border font-medium transition cursor-pointer truncate ${
                shape === item.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-gray-900/80 hover:bg-gray-800 text-gray-300 border-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Shading & FX Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Mode Shading & Partikel:
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            { id: 'standard', label: 'Metallic' },
            { id: 'wireframe', label: 'Wireframe' },
            { id: 'points', label: 'Particles' },
            { id: 'chrome', label: 'Chrome' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (isProMember) {
                  cyberSound.playClick();
                  onSelectFxMode(m.id as VisualFxMode);
                }
              }}
              className={`py-1.5 text-[10px] rounded-lg border font-semibold transition cursor-pointer ${
                fxMode === m.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-2">
        <label className="text-xs text-gray-300 font-medium">Tema Warna & Neon Light:</label>
        <div className="flex flex-wrap gap-2.5 items-center">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              title={palette.name}
              onClick={() => {
                if (isProMember) {
                  cyberSound.playClick();
                  onSelectColor(palette.hex);
                }
              }}
              className={`w-8 h-8 rounded-full ${palette.css} border-2 transition-all cursor-pointer shadow-lg ${
                colorHex === palette.hex
                  ? `border-white scale-125 ring-2 ring-white/60 ${palette.glow}`
                  : 'border-white/20 hover:scale-110 opacity-80 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Warp Speed & Extra Controls */}
      <div className="space-y-3.5 pt-2 border-t border-gray-800/80">
        {/* Hyperspace Warp Mode Toggle */}
        <div className="flex justify-between items-center bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-800/40">
          <div className="space-y-0.5">
            <span className="text-xs text-cyan-300 font-bold flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              Hyperspace Warp Mode
            </span>
            <span className="text-[10px] text-cyan-400/70 block">
              Akselerasi partikel bintang kecepatan tinggi
            </span>
          </div>
          <button
            onClick={() => {
              if (isProMember) {
                const next = warpMode === 'hyperspace' ? 'normal' : 'hyperspace';
                if (next === 'hyperspace') cyberSound.playWarpWhoosh();
                onToggleWarp(next);
              }
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
              warpMode === 'hyperspace'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30'
                : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-400'
            }`}
          >
            {warpMode === 'hyperspace' ? 'AKTIF ⚡' : 'MATI'}
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs text-gray-300">Kecepatan Rotasi Animasi</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={rotationSpeed}
              disabled={!isProMember}
              onChange={(e) => {
                if (isProMember) onChangeSpeed(Number(e.target.value));
              }}
              className="w-24 sm:w-28 accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-cyan-400 w-5 text-right font-bold">
              {rotationSpeed}x
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Guidance */}
      <div className="p-3 bg-gray-950/50 rounded-xl border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
        <Orbit className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Sentuh dan seret kursor pada area kosong untuk memutar kamera 3D ke berbagai sudut pandang.
        </span>
      </div>
    </div>
  );
};
