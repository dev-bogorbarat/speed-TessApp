import React, { useState } from 'react';
import {
  History,
  ArrowDown,
  ArrowUp,
  Clock,
  Zap,
  Trash2,
  Award,
  Download,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { SpeedTestHistoryItem, NetworkMetrics } from '../types';
import { ShareSnapshotModal } from './ShareSnapshotModal';
import { DownloadTrendChart } from './DownloadTrendChart';
import { HistoricalComparisonCard } from './HistoricalComparisonCard';
import { AiOptimizationAdvicePanel } from './AiOptimizationAdvicePanel';
import { cyberSound } from '../utils/cyberSound';

interface TestHistoryPanelProps {
  history: SpeedTestHistoryItem[];
  onClearHistory: () => void;
  onSelectCertificate: (metrics: NetworkMetrics) => void;
  onOpenVipModal: () => void;
  isProMember: boolean;
}

export const TestHistoryPanel: React.FC<TestHistoryPanelProps> = ({
  history,
  onClearHistory,
  onSelectCertificate,
  onOpenVipModal,
  isProMember,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [shareItem, setShareItem] = useState<SpeedTestHistoryItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Strictly display the 5 most recent tests
  const recentHistory = history.slice(0, 5);

  const handleClear = () => {
    cyberSound.playClick();
    onClearHistory();
    setConfirmClear(false);
  };

  const handleOpenShare = (item: SpeedTestHistoryItem) => {
    cyberSound.playClick();
    setShareItem(item);
    setIsShareModalOpen(true);
  };

  const handleViewCertificate = (item: SpeedTestHistoryItem) => {
    cyberSound.playClick();
    onSelectCertificate({
      ping: item.ping,
      download: item.download,
      upload: item.upload,
      jitter: item.jitter,
    });
  };

  const handleExportJson = () => {
    cyberSound.playClick();
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(recentHistory, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `speedt_history_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="speed-test-history-panel"
      className="bg-gray-900/85 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 text-white"
    >
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                Riwayat 5 Tes Kecepatan Terakhir
              </h3>
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full font-mono">
                PRO EXCLUSIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Tersimpan aman di penyimpanan lokal (localStorage) browser Anda.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {recentHistory.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => handleOpenShare(recentHistory[0])}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-[11px] font-bold shadow-sm"
                title="Bagikan snapshot tes terbaru ke media sosial"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Share Terbaru</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-xl border border-gray-700 transition flex items-center gap-1.5 cursor-pointer text-[11px]"
                title="Ekspor data riwayat ke file JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Ekspor</span> JSON
              </button>

              {confirmClear ? (
                <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-800/60 px-2 py-1 rounded-xl">
                  <span className="text-[10px] text-red-300">Yakin hapus?</span>
                  <button
                    onClick={handleClear}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="bg-gray-800/90 hover:bg-red-950/50 hover:text-red-400 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-700/80 transition flex items-center gap-1.5 cursor-pointer text-[11px]"
                  title="Hapus semua riwayat tes"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visual Line Chart Trend, Historical Comparison & AI Optimization Panel */}
      {recentHistory.length > 0 && (
        <>
          <AiOptimizationAdvicePanel
            latestItem={recentHistory[0] || null}
            history={history}
          />
          <DownloadTrendChart history={recentHistory} />
          <HistoricalComparisonCard history={history} />
        </>
      )}

      {/* History Items List */}
      {recentHistory.length === 0 ? (
        <div className="py-8 px-4 text-center bg-gray-950/40 border border-dashed border-gray-800 rounded-2xl space-y-2">
          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 mx-auto flex items-center justify-center text-gray-500">
            <History className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-300">
            Belum ada riwayat tes kecepatan tersimpan.
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Jalankan pengujian pada tombol &quot;MULAI TES SEKARANG&quot; di atas. Setiap hasil tes Anda akan otomatis dicatat dan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentHistory.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-950/70 hover:bg-gray-900/90 border border-gray-800/90 hover:border-cyan-500/30 p-3.5 sm:p-4 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column: Number badge, Date & Status */}
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-gray-800 text-gray-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gray-700">
                  #{index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {item.dateStr}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {item.timeStr}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 ${
                        item.ratingColor || 'text-cyan-400'
                      }`}
                    >
                      {item.ratingText || 'Stabil'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Jitter: {item.jitter} ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-black/40 px-3 py-2 rounded-xl border border-gray-800/60 sm:bg-transparent sm:p-0 sm:border-none">
                {/* Download */}
                <div className="text-left sm:text-center">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 sm:justify-center">
                    <ArrowDown className="w-3 h-3 text-cyan-400" />
                    <span>Download</span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-cyan-300 font-mono">
                    {item.download.toFixed(1)}{' '}
                    <span className="text-[10px] font-normal text-gray-400">Mbps</span>
                  </span>
                </div>

                {/* Upload */}
                <div className="text-left sm:text-center">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 sm:justify-center">
                    <ArrowUp className="w-3 h-3 text-amber-400" />
                    <span>Upload</span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
                    {item.upload !== null ? item.upload.toFixed(1) : '-'}{' '}
                    <span className="text-[10px] font-normal text-gray-400">Mbps</span>
                  </span>
                </div>

                {/* Ping */}
                <div className="text-left sm:text-center">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 sm:justify-center">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Ping</span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-emerald-300 font-mono">
                    {item.ping}{' '}
                    <span className="text-[10px] font-normal text-gray-400">ms</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Action Buttons (Share & Certificate) */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenShare(item)}
                  className="flex-1 sm:flex-initial bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 hover:text-cyan-200 text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="Buat snapshot canvas & bagikan ke media sosial"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleViewCertificate(item)}
                  className="flex-1 sm:flex-initial bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-200 text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="Lihat & unduh sertifikat resmi"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Sertifikat</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-gray-400 border-t border-gray-800/80">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Data tersimpan lokal, privasi 100% terlindungi tanpa upload ke server eksternal.</span>
        </div>
        <span className="font-mono text-[10px] text-gray-400">
          Menampilkan {recentHistory.length} dari {history.length} tes
        </span>
      </div>

      {/* Modal Share Snapshot Canvas */}
      <ShareSnapshotModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        item={shareItem}
      />
    </section>
  );
};
