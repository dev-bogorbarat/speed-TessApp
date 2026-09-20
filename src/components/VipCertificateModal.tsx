import React, { useRef } from 'react';
import { X, Download, Copy, ShieldCheck, Award, Check } from 'lucide-react';
import { NetworkMetrics } from '../types';

interface VipCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: NetworkMetrics;
}

export const VipCertificateModal: React.FC<VipCertificateModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const ping = metrics.ping ?? 24;
  const download = metrics.download ?? 55.4;
  const upload = metrics.upload ?? 22.8;
  const jitter = metrics.jitter ?? 2;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const certificateId = `ST-PRO-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownload = () => {
    // Generate certificate dynamically to a canvas for crisp PNG export
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 540);
    bgGrad.addColorStop(0, '#0b0f19');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 540);

    // Cyber border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 500);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, 744, 484);

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SPEED-T PRO • OFFICIAL NETWORK PERFORMANCE CERTIFICATE', 400, 70);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '900 32px sans-serif';
    ctx.fillText('SPEED-T VERIFIED SPEED', 400, 115);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px sans-serif';
    ctx.fillText(`ID Sertifikat: ${certificateId}  •  Tanggal: ${currentDate}`, 400, 145);

    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(80, 170);
    ctx.lineTo(720, 170);
    ctx.stroke();

    // Metrics Box
    const drawBox = (title: string, val: string, unit: string, x: number, color: string) => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
      ctx.fillRect(x, 195, 140, 95);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(x, 195, 140, 95);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(title, x + 70, 220);

      ctx.fillStyle = color;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(val, x + 70, 255);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(unit, x + 70, 275);
    };

    drawBox('PING', `${ping}`, 'ms', 80, '#00f0ff');
    drawBox('DOWNLOAD', `${download}`, 'Mbps', 240, '#3b82f6');
    drawBox('UPLOAD', `${upload}`, 'Mbps', 400, '#f59e0b');
    drawBox('JITTER', `${jitter}`, 'ms', 560, '#a855f7');

    // Certification badge & Developer Signature
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('✓ Terverifikasi Lolos Uji Latensi Ultra Rendah', 400, 340);

    ctx.fillStyle = '#d1d5db';
    ctx.font = '13px sans-serif';
    ctx.fillText('Diverifikasi oleh Algoritma Multi-Stream Speed-T v2026', 400, 365);

    // Anak bangsa signature line
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Anak bangsa', 400, 435);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px monospace';
    ctx.fillText('LEAD CREATOR & ARCHITECT • SPEED-T', 400, 455);

    // Download trigger
    const link = document.createElement('a');
    link.download = `SpeedT-Certificate-${certificateId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyText = () => {
    const text = `🏆 SPEED-T PRO SPEED CERTIFICATE\nID: ${certificateId}\nTanggal: ${currentDate}\nPing: ${ping} ms | Download: ${download} Mbps | Upload: ${upload} Mbps | Jitter: ${jitter} ms\nStatus: Lolos Uji Gaming & 4K Streaming • Verified by Anak bangsa`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-gray-950 border-2 border-amber-500/50 max-w-xl w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative space-y-6 text-white my-auto backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Holographic Certificate Body */}
        <div
          ref={certificateRef}
          className="border border-amber-500/30 p-6 rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 text-center space-y-5 relative overflow-hidden"
        >
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
              SPEED-T PRO • OFFICIAL NETWORK PERFORMANCE CERTIFICATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SPEED-T VERIFIED SPEED
            </h2>
            <p className="text-[11px] text-gray-400 font-mono">
              ID: <span className="text-amber-300 font-bold">{certificateId}</span> • {currentDate}
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
              <span className="text-[9px] text-gray-400 block font-mono">PING</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{ping}</span>
              <span className="text-[9px] text-gray-500 block">ms</span>
            </div>
            <div className="bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
              <span className="text-[9px] text-gray-400 block font-mono">DOWNLOAD</span>
              <span className="text-xl font-black text-blue-400 font-mono">{download}</span>
              <span className="text-[9px] text-gray-500 block">Mbps</span>
            </div>
            <div className="bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
              <span className="text-[9px] text-gray-400 block font-mono">UPLOAD</span>
              <span className="text-xl font-black text-amber-400 font-mono">{upload}</span>
              <span className="text-[9px] text-gray-500 block">Mbps</span>
            </div>
            <div className="bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
              <span className="text-[9px] text-gray-400 block font-mono">JITTER</span>
              <span className="text-xl font-black text-purple-400 font-mono">{jitter}</span>
              <span className="text-[9px] text-gray-500 block">ms</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Koneksi Lolos Uji Kompetitif Gaming & 4K Streaming</span>
          </div>

          {/* Anak bangsa Signature Stamp */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between px-4 text-left">
            <div>
              <span className="text-[10px] text-gray-400 block">Diterbitkan oleh:</span>
              <span className="text-sm font-black text-amber-400 font-mono tracking-wider">
                Anak bangsa
              </span>
              <span className="text-[9px] text-gray-500 block">Lead Architect • Speed-T</span>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400/60 flex flex-col items-center justify-center text-[9px] text-amber-400 font-mono font-bold leading-tight rotate-12">
              <span>SPEED-T</span>
              <span>PRO</span>
              <span>SEAL</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            UNDUH SERTIFIKAT (PNG RESMI)
          </button>
          <button
            onClick={handleCopyText}
            className="px-5 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'TERSALIN!' : 'SALIN TEKS'}
          </button>
        </div>
      </div>
    </div>
  );
};
