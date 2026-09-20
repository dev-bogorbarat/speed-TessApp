import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Cpu,
  Sliders,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { SpeedTestHistoryItem } from '../types';
import { cyberSound } from '../utils/cyberSound';

interface AiOptimizationAdvicePanelProps {
  latestItem: SpeedTestHistoryItem | null;
  history: SpeedTestHistoryItem[];
}

interface QuickWin {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

interface AdvancedTip {
  category: string;
  tip: string;
}

interface OptimizationData {
  summary: string;
  healthScore: number;
  status: string;
  quickWins: QuickWin[];
  advancedTips: AdvancedTip[];
  bottleneckAnalysis: string;
}

export const AiOptimizationAdvicePanel: React.FC<AiOptimizationAdvicePanelProps> = ({
  latestItem,
  history,
}) => {
  const [data, setData] = useState<OptimizationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [lastAnalyzedId, setLastAnalyzedId] = useState<string | null>(null);

  const fetchAdvice = async (force: boolean = false) => {
    if (!latestItem) return;
    if (!force && lastAnalyzedId === latestItem.id && data) return;

    setLoading(true);
    setError(null);

    // Calculate historical average download
    const totalCount = history.length;
    const avgDownload =
      totalCount > 0
        ? history.reduce((sum, item) => sum + item.download, 0) / totalCount
        : latestItem.download;

    try {
      const res = await fetch('/api/ai-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          download: latestItem.download,
          upload: latestItem.upload,
          ping: latestItem.ping,
          jitter: latestItem.jitter,
          ratingText: latestItem.ratingText,
          historyLength: totalCount,
          avgDownload,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      if (json && json.data) {
        setData(json.data);
        setSource(json.source || 'gemini');
        setLastAnalyzedId(latestItem.id);
      } else {
        throw new Error('Format data saran AI tidak sesuai.');
      }
    } catch (err: any) {
      console.error('Failed to load AI advice:', err);
      setError(err?.message || 'Gagal memuat rekomendasi AI.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch advice when latestItem changes
  useEffect(() => {
    if (latestItem && latestItem.id !== lastAnalyzedId) {
      fetchAdvice(false);
    }
  }, [latestItem?.id]);

  if (!latestItem) {
    return null;
  }

  const handleManualRefresh = () => {
    cyberSound.playClick();
    fetchAdvice(true);
  };

  return (
    <div
      id="ai-optimization-advice-panel"
      className="bg-gradient-to-b from-gray-900/95 via-gray-900/80 to-gray-950/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-white relative overflow-hidden"
    >
      {/* Decorative Cyber Background Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/15 animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                AI Network Optimization Advisor
              </h3>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                GEMINI AI
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Saran kualitatif pintar untuk memaksimalkan kecepatan & stabilitas koneksi internet Anda.
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={loading}
          className="bg-gray-800/80 hover:bg-gray-700/80 disabled:opacity-50 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl border border-gray-700 transition flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-sm ml-auto sm:ml-0"
          title="Analisis ulang dengan Gemini AI"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Menganalisis...' : 'Analisis Ulang AI'}</span>
        </button>
      </div>

      {/* Loading state skeleton */}
      {loading && !data && (
        <div className="py-8 space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-cyan-300">
              Gemini AI sedang menganalisis data jaringan Anda...
            </p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Mengevaluasi rasio throughput {latestItem.download.toFixed(1)} Mbps, latensi {latestItem.ping} ms, dan pola transmisi paket.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !data && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="font-bold">Gagal terhubung ke layanan AI.</p>
            <p className="text-red-400/80 text-[11px]">{error}</p>
          </div>
        </div>
      )}

      {/* Content Loaded */}
      {data && (
        <div className="space-y-4 relative z-10">
          {/* Top Score & Summary Banner */}
          <div className="bg-gray-950/80 border border-gray-800/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="space-y-1.5 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold font-mono">
                  Diagnosis Kualitatif
                </span>
                <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {data.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                &quot;{data.summary}&quot;
              </p>
              {data.bottleneckAnalysis && (
                <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 p-2 rounded-xl mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bottleneck Terdeteksi:</strong> {data.bottleneckAnalysis}
                  </span>
                </div>
              )}
            </div>

            {/* Health Score Meter */}
            <div className="shrink-0 flex items-center gap-3 bg-gray-900/90 border border-gray-800 px-4 py-3 rounded-2xl">
              <div className="relative flex items-center justify-center w-14 h-14">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-gray-800"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={138}
                    strokeDashoffset={138 - (138 * Math.min(100, data.healthScore)) / 100}
                    strokeLinecap="round"
                    className={
                      data.healthScore >= 80
                        ? 'text-cyan-400'
                        : data.healthScore >= 60
                        ? 'text-yellow-400'
                        : 'text-amber-500'
                    }
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-mono font-black text-sm text-white">
                  {data.healthScore}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">SKOR EFISIENSI</span>
                <span className="font-bold text-xs text-white">
                  {data.healthScore >= 80 ? 'Optimal' : data.healthScore >= 60 ? 'Cukup Baik' : 'Butuh Tweak'}
                </span>
                <span className="text-[9px] text-gray-400 block font-mono">dari 100 poin</span>
              </div>
            </div>
          </div>

          {/* Quick Wins Action Cards */}
          {data.quickWins && data.quickWins.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Rekomendasi Cepat (Quick Wins)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {data.quickWins.map((win, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-950/70 border border-gray-800/90 hover:border-cyan-500/40 rounded-2xl p-3.5 space-y-1.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {win.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          win.impact === 'High'
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                            : win.impact === 'Medium'
                            ? 'bg-blue-950/90 text-blue-400 border border-blue-800'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        Impact {win.impact}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      {win.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Technical Advice */}
          {data.advancedTips && data.advancedTips.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Tips & Konfigurasi Lanjutan</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {data.advancedTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3 flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <span className="text-[10px] text-amber-300 font-mono font-bold uppercase tracking-wider block">
                        {tip.category}
                      </span>
                      <p className="text-[11px] text-gray-300 leading-snug">
                        {tip.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note with model watermark */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-800/80 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Engine:{' '}
              {source.startsWith('gemini-3.8')
                ? 'Google Gemini 3.8 Flash'
                : source.startsWith('gemini-3.1')
                ? 'Google Gemini 3.1 Flash Lite'
                : source.includes('gemini')
                ? 'Google Gemini AI'
                : 'Speed-T Heuristic Analyzer'}
            </span>
            <span>Dianalisis khusus untuk uji #{latestItem.id.slice(-4)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
