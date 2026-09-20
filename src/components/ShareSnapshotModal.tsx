import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Twitter,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SpeedTestHistoryItem } from '../types';
import { generateSpeedTestSnapshot, GeneratedSnapshot } from '../utils/generateShareSnapshot';
import { cyberSound } from '../utils/cyberSound';

interface ShareSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SpeedTestHistoryItem | null;
}

export const ShareSnapshotModal: React.FC<ShareSnapshotModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [snapshot, setSnapshot] = useState<GeneratedSnapshot | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setIsGenerating(true);
      setCopiedText(false);
      setCopiedImage(false);
      setShareSuccess(null);

      generateSpeedTestSnapshot(item)
        .then((result) => {
          setSnapshot(result);
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error('Error generating snapshot:', err);
          setIsGenerating(false);
        });
    } else {
      setSnapshot(null);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const shareText = `🚀 Hasil Uji Kecepatan Speed-T PRO:
📥 Download: ${item.download.toFixed(1)} Mbps
📤 Upload: ${item.upload !== null ? item.upload.toFixed(1) : '-'} Mbps
⚡ Ping: ${item.ping} ms (Jitter: ${item.jitter} ms)
📊 Status: ${item.ratingText} (${item.dateStr})
Architected by Anak bangsa • Speed-T Network Engine`;

  const handleDownloadImage = () => {
    cyberSound.playClick();
    if (!snapshot) return;
    const a = document.createElement('a');
    a.href = snapshot.dataUrl;
    a.download = `SpeedT_Snapshot_${item.dateStr.replace(/\s+/g, '_')}_${item.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setShareSuccess('Gambar berhasil diunduh ke perangkat Anda!');
    setTimeout(() => setShareSuccess(null), 3500);
  };

  const handleNativeShare = async () => {
    cyberSound.playClick();
    if (!snapshot) return;

    if (navigator.share) {
      try {
        if (snapshot.blob && navigator.canShare) {
          const file = new File(
            [snapshot.blob],
            `SpeedT_Result_${item.download.toFixed(0)}Mbps.png`,
            { type: 'image/png' }
          );

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Speed-T: ${item.download.toFixed(1)} Mbps`,
              text: shareText,
            });
            setShareSuccess('Berhasil membagikan snapshot!');
            setTimeout(() => setShareSuccess(null), 3000);
            return;
          }
        }

        // Fallback to text sharing if file sharing not supported
        await navigator.share({
          title: 'Speed-T Network Performance',
          text: shareText,
        });
        setShareSuccess('Berhasil membagikan ringkasan!');
        setTimeout(() => setShareSuccess(null), 3000);
      } catch (err) {
        // user cancelled or failed
        if ((err as Error).name !== 'AbortError') {
          handleCopyText();
        }
      }
    } else {
      // Fallback: Copy formatted text
      handleCopyText();
    }
  };

  const handleCopyImage = async () => {
    cyberSound.playClick();
    if (!snapshot || !snapshot.blob) return;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new window.ClipboardItem({
            'image/png': snapshot.blob,
          }),
        ]);
        setCopiedImage(true);
        setShareSuccess('Gambar berhasil disalin ke clipboard! Siap di-paste ke chat / medsos.');
        setTimeout(() => {
          setCopiedImage(false);
          setShareSuccess(null);
        }, 4000);
      } else {
        handleDownloadImage();
      }
    } catch {
      handleDownloadImage();
    }
  };

  const handleCopyText = () => {
    cyberSound.playClick();
    try {
      navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setShareSuccess('Teks ringkasan hasil tes disalin ke clipboard!');
      setTimeout(() => {
        setCopiedText(false);
        setShareSuccess(null);
      }, 3500);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = () => {
    cyberSound.playClick();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    cyberSound.playClick();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-gray-900 border border-amber-500/40 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white my-auto max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Bagikan Snapshot Medsos
                </h3>
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono">
                  PRO
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Snapshot persegi 1080×1080 resolusi tinggi siap unggah ke Story &amp; Chat.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Notification banner */}
          {shareSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{shareSuccess}</span>
            </div>
          )}

          {/* Canvas Snapshot Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-700/80 bg-black/60 shadow-xl group aspect-square max-w-[340px] sm:max-w-[380px] mx-auto flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-cyan-400 py-12">
                <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Merender Snapshot Canvas...</span>
              </div>
            ) : snapshot ? (
              <>
                <img
                  src={snapshot.dataUrl}
                  alt="Speed-T Share Snapshot"
                  className="w-full h-full object-contain rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={handleDownloadImage}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Unduh PNG
                  </button>
                </div>
              </>
            ) : (
              <span className="text-xs text-gray-500">Gagal memuat snapshot</span>
            )}
          </div>

          {/* Quick Metrics Summary Bar */}
          <div className="bg-gray-950/60 border border-gray-800 rounded-2xl p-3 flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">DOWNLOAD</span>
              <span className="text-cyan-400 font-extrabold text-sm sm:text-base font-mono">
                {item.download.toFixed(1)} Mbps
              </span>
            </div>
            <div className="w-px h-6 bg-gray-800" />
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">UPLOAD</span>
              <span className="text-amber-400 font-extrabold text-sm sm:text-base font-mono">
                {item.upload !== null ? item.upload.toFixed(1) : '-'} Mbps
              </span>
            </div>
            <div className="w-px h-6 bg-gray-800" />
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">PING</span>
              <span className="text-emerald-400 font-extrabold text-sm sm:text-base font-mono">
                {item.ping} ms
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Share Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isGenerating || !snapshot}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              >
                <Share2 className="w-4 h-4 fill-current" />
                <span>BAGIKAN KE MEDSOS</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isGenerating || !snapshot}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>UNDUH FOTO PNG</span>
              </button>
            </div>

            {/* Secondary Direct Channels */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 text-sky-300 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>Twitter / X</span>
              </button>

              <button
                type="button"
                onClick={handleCopyImage}
                className="bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-gray-200 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                title="Salin gambar PNG ke Clipboard (bisa dipaste di Discord/Telegram)"
              >
                {copiedImage ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{copiedImage ? 'Tersalin' : 'Salin Foto'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-gray-200 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                title="Salin teks rincian ringkasan"
              >
                {copiedText ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{copiedText ? 'Tersalin' : 'Salin Teks'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-gray-800/80 bg-gray-950/90 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gambar dibuat langsung secara instan di browser Anda menggunakan HTML5 Canvas.</span>
        </div>
      </div>
    </div>
  );
};
