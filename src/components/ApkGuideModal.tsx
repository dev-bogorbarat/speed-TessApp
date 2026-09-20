import React, { useState } from 'react';
import { X, Smartphone, Download, CheckCircle2, Copy, Check, ExternalLink, Zap } from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gray-950 border border-blue-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 border-b border-gray-800 pb-4">
          <img
            src="/icon.png"
            alt="Speed-TessApp Icon"
            className="w-14 h-14 rounded-2xl border-2 border-blue-400/60 shadow-lg shadow-blue-500/30 object-contain bg-blue-600"
          />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
              PWA &amp; APK Android Converter
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-1.5">
              Speed-TessApp Mobile APK
            </h3>
            <span className="text-xs text-gray-400">
              Oleh <strong className="text-cyan-400">Anak bangsa</strong>
            </span>
          </div>
        </div>

        {/* Metoda 1: Install Langsung ke Layar Utama (PWA / WebAPK) */}
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Cara 1: Pasang Langsung di HP (WebAPK)</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Aplikasi ini sudah dilengkapi <strong>Manifest &amp; Service Worker</strong> dengan ikon resmi Speed-TessApp.
          </p>
          <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5 pl-1">
            <li>Buka situs ini di browser Google Chrome / Samsung Internet di HP Anda.</li>
            <li>Tekan tombol menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.</li>
            <li>Pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> atau <strong>&quot;Install App&quot;</strong>.</li>
            <li>Ikon <strong>Speed-TessApp</strong> akan otomatis terpasang seperti aplikasi Android biasa!</li>
          </ol>
        </div>

        {/* Metoda 2: Jadikan File .APK Mandiri (Web2Apk / PWABuilder) */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Cara 2: Generate File .APK Asli (Untuk Dibagikan)</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Jika Anda ingin mengunduh file <strong>.APK</strong> siap instal di Android:
          </p>
          
          <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800 flex items-center justify-between gap-2 text-xs">
            <div className="truncate font-mono text-cyan-300 text-[11px]">
              {currentUrl}
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
            </button>
          </div>

          <div className="space-y-1 text-xs text-gray-300">
            <p>1. Salin link situs di atas.</p>
            <p>2. Buka layanan pembuat APK instan terpercaya:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-cyan-300 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold"
              >
                <span>PWABuilder (Official Microsoft)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://appsgeyser.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-cyan-300 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold"
              >
                <span>AppsGeyser / Web2Apk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-gray-400 pt-1">
              Masukkan URL situs Anda &rarr; Klik <strong>Generate APK</strong>. File .APK langsung siap diinstal di semua smartphone Android!
            </p>
          </div>
        </div>

        {/* Download Icon Assets */}
        <div className="flex items-center justify-between bg-black/40 border border-gray-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2 text-xs">
            <Download className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Aset Ikon Resmi Speed-TessApp</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/icon.png"
              download="Speed-TessApp-512x512.png"
              className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg text-[11px] font-bold"
            >
              Unduh Ikon HD
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
};
