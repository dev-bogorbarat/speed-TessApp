import React from 'react';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowDown,
  ArrowUp,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SpeedTestHistoryItem } from '../types';

interface HistoricalComparisonCardProps {
  history: SpeedTestHistoryItem[];
}

export const HistoricalComparisonCard: React.FC<HistoricalComparisonCardProps> = ({
  history,
}) => {
  if (!history || history.length === 0) return null;

  const latest = history[0];

  // If there's only 1 test, calculate average based on that 1 test
  const totalCount = history.length;
  const avgDownload =
    history.reduce((sum, item) => sum + item.download, 0) / totalCount;

  const validUploads = history.filter((item) => item.upload !== null);
  const avgUpload =
    validUploads.length > 0
      ? validUploads.reduce((sum, item) => sum + (item.upload ?? 0), 0) /
        validUploads.length
      : null;

  const avgPing =
    history.reduce((sum, item) => sum + item.ping, 0) / totalCount;

  // Download comparison
  const dlDiff = latest.download - avgDownload;
  const dlPercent = avgDownload > 0 ? (dlDiff / avgDownload) * 100 : 0;
  const dlStatus: 'better' | 'worse' | 'neutral' =
    Math.abs(dlPercent) < 2
      ? 'neutral'
      : dlDiff > 0
      ? 'better'
      : 'worse';

  // Upload comparison
  const ulDiff =
    latest.upload !== null && avgUpload !== null ? latest.upload - avgUpload : null;
  const ulPercent =
    ulDiff !== null && avgUpload !== null && avgUpload > 0
      ? (ulDiff / avgUpload) * 100
      : null;
  const ulStatus: 'better' | 'worse' | 'neutral' =
    ulPercent === null
      ? 'neutral'
      : Math.abs(ulPercent) < 2
      ? 'neutral'
      : (ulDiff ?? 0) > 0
      ? 'better'
      : 'worse';

  // Ping comparison (Lower ping is better!)
  const pingDiff = latest.ping - avgPing;
  const pingPercent = avgPing > 0 ? (pingDiff / avgPing) * 100 : 0;
  const pingStatus: 'better' | 'worse' | 'neutral' =
    Math.abs(pingDiff) < 1
      ? 'neutral'
      : pingDiff < 0
      ? 'better'
      : 'worse';

  // Overall verdict
  const score =
    (dlStatus === 'better' ? 1 : dlStatus === 'worse' ? -1 : 0) +
    (ulStatus === 'better' ? 1 : ulStatus === 'worse' ? -1 : 0) +
    (pingStatus === 'better' ? 1 : pingStatus === 'worse' ? -1 : 0);

  const overallVerdict =
    score > 0
      ? {
          title: 'Performa Meningkat (Improvement)',
          badge: 'LEBIH BAIK DARI RATA-RATA',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-950/40 border-emerald-500/40',
          icon: TrendingUp,
        }
      : score < 0
      ? {
          title: 'Ada Penurunan Kecepatan (Regression)',
          badge: 'DI BAWAH RATA-RATA',
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/40 border-amber-500/40',
          icon: TrendingDown,
        }
      : {
          title: 'Performa Konsisten & Stabil',
          badge: 'SESUAI RATA-RATA',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-950/40 border-cyan-500/40',
          icon: Minus,
        };

  const VerdictIcon = overallVerdict.icon;

  return (
    <div
      id="historical-comparison-card"
      className="bg-gray-950/75 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Komparasi Tes Terakhir vs Rata-Rata Riwayat
              </h4>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border font-mono ${overallVerdict.bgColor} ${overallVerdict.color}`}
              >
                {overallVerdict.badge}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Evaluasi peningkatan / penurunan performa dari total {totalCount} tes yang tersimpan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-xl">
          <VerdictIcon className={`w-4 h-4 ${overallVerdict.color}`} />
          <span className="font-semibold text-[11px]">{overallVerdict.title}</span>
        </div>
      </div>

      {/* Grid of 3 Comparisons: Download, Upload, Ping */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Download Comparison */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3 text-cyan-400" />
              Download
            </span>
            <span
              className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                dlStatus === 'better'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : dlStatus === 'worse'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {dlStatus === 'better'
                ? `+${dlPercent.toFixed(1)}%`
                : dlStatus === 'worse'
                ? `${dlPercent.toFixed(1)}%`
                : '±0%'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-mono text-base font-black text-cyan-300">
              {latest.download.toFixed(1)}{' '}
              <span className="text-[10px] text-gray-400 font-normal">Mbps</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Avg: {avgDownload.toFixed(1)} Mbps
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            {dlStatus === 'better' ? (
              <span className="text-emerald-400 font-medium">
                ↗ Naik {Math.abs(dlDiff).toFixed(1)} Mbps dibanding rata-rata.
              </span>
            ) : dlStatus === 'worse' ? (
              <span className="text-amber-400 font-medium">
                ↘ Turun {Math.abs(dlDiff).toFixed(1)} Mbps dibanding rata-rata.
              </span>
            ) : (
              <span className="text-gray-400">Sama dengan rata-rata historis.</span>
            )}
          </p>
        </div>

        {/* 2. Upload Comparison */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-amber-400" />
              Upload
            </span>
            {ulPercent !== null && (
              <span
                className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                  ulStatus === 'better'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : ulStatus === 'worse'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {ulStatus === 'better'
                  ? `+${ulPercent.toFixed(1)}%`
                  : ulStatus === 'worse'
                  ? `${ulPercent.toFixed(1)}%`
                  : '±0%'}
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-mono text-base font-black text-amber-300">
              {latest.upload !== null ? latest.upload.toFixed(1) : '-'}{' '}
              <span className="text-[10px] text-gray-400 font-normal">Mbps</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Avg: {avgUpload !== null ? avgUpload.toFixed(1) : '-'} Mbps
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            {ulDiff !== null ? (
              ulStatus === 'better' ? (
                <span className="text-emerald-400 font-medium">
                  ↗ Naik {Math.abs(ulDiff).toFixed(1)} Mbps dibanding rata-rata.
                </span>
              ) : ulStatus === 'worse' ? (
                <span className="text-amber-400 font-medium">
                  ↘ Turun {Math.abs(ulDiff).toFixed(1)} Mbps dibanding rata-rata.
                </span>
              ) : (
                <span className="text-gray-400">Sama dengan rata-rata historis.</span>
              )
            ) : (
              <span className="text-gray-500">Data upload belum tersedia.</span>
            )}
          </p>
        </div>

        {/* 3. Ping Comparison (Lower is better) */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Ping (Latensi)
            </span>
            <span
              className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                pingStatus === 'better'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : pingStatus === 'worse'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {pingDiff < 0
                ? `${pingDiff.toFixed(1)} ms`
                : pingDiff > 0
                ? `+${pingDiff.toFixed(1)} ms`
                : '0 ms'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-mono text-base font-black text-emerald-300">
              {latest.ping}{' '}
              <span className="text-[10px] text-gray-400 font-normal">ms</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Avg: {avgPing.toFixed(1)} ms
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            {pingStatus === 'better' ? (
              <span className="text-emerald-400 font-medium">
                ↗ Lebih responsif ({Math.abs(pingDiff).toFixed(1)} ms lebih rendah).
              </span>
            ) : pingStatus === 'worse' ? (
              <span className="text-amber-400 font-medium">
                ↘ Sedikit lebih lambat ({Math.abs(pingDiff).toFixed(1)} ms lebih tinggi).
              </span>
            ) : (
              <span className="text-gray-400">Latensi stabil sesuai rata-rata.</span>
            )}
          </p>
        </div>
      </div>

      {totalCount === 1 && (
        <p className="text-[10px] text-gray-500 italic pt-0.5">
          * Perbandingan akan semakin presisi seiring bertambahnya jumlah pengujian kecepatan yang Anda lakukan.
        </p>
      )}
    </div>
  );
};
