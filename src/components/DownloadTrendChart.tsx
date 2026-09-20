import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { SpeedTestHistoryItem } from '../types';

interface DownloadTrendChartProps {
  history: SpeedTestHistoryItem[];
}

export const DownloadTrendChart: React.FC<DownloadTrendChartProps> = ({ history }) => {
  // Take up to 5 most recent tests and reverse so the timeline flows from past to present (left to right)
  const recentItems = history.slice(0, 5);
  const chronologicalData = [...recentItems].reverse().map((item, idx) => ({
    index: idx + 1,
    id: item.id,
    label: item.timeStr || `Tes #${idx + 1}`,
    fullDate: `${item.dateStr}, ${item.timeStr}`,
    download: Number(item.download.toFixed(1)),
    upload: item.upload !== null ? Number(item.upload.toFixed(1)) : null,
    ping: item.ping,
    rating: item.ratingText,
  }));

  if (chronologicalData.length === 0) return null;

  // Calculate statistics
  const downloadValues = chronologicalData.map((d) => d.download);
  const peakDownload = Math.max(...downloadValues);
  const avgDownload = (
    downloadValues.reduce((acc, curr) => acc + curr, 0) / downloadValues.length
  ).toFixed(1);

  // Trend detection between oldest in window and newest
  const oldest = chronologicalData[0].download;
  const latest = chronologicalData[chronologicalData.length - 1].download;
  const diff = latest - oldest;
  const trendPercent = oldest > 0 ? ((diff / oldest) * 100).toFixed(0) : '0';

  const isPositiveTrend = diff >= 0;

  return (
    <div className="bg-gray-950/70 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 space-y-3">
      {/* Header & Metric Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Tren Kecepatan Download
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                5 Tes Terakhir
              </span>
            </h4>
            <p className="text-[11px] text-gray-400">
              Grafik dinamika bandwidth unduhan berdasarkan riwayat pengujian
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="bg-gray-900/90 border border-gray-800 px-2.5 py-1 rounded-xl">
            <span className="text-[10px] text-gray-400 block">Rata-Rata</span>
            <span className="font-bold font-mono text-cyan-300">
              {avgDownload} <span className="text-[9px] font-normal text-gray-400">Mbps</span>
            </span>
          </div>

          <div className="bg-gray-900/90 border border-gray-800 px-2.5 py-1 rounded-xl">
            <span className="text-[10px] text-gray-400 block">Puncak Tertinggi</span>
            <span className="font-bold font-mono text-emerald-400">
              {peakDownload.toFixed(1)} <span className="text-[9px] font-normal text-gray-400">Mbps</span>
            </span>
          </div>

          {chronologicalData.length > 1 && (
            <div
              className={`border px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                isPositiveTrend
                  ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-600/40 text-amber-300'
              }`}
            >
              <ArrowUpRight
                className={`w-3.5 h-3.5 ${!isPositiveTrend ? 'rotate-90 text-amber-400' : ''}`}
              />
              <span className="font-mono text-xs font-bold">
                {isPositiveTrend ? `+${trendPercent}%` : `${trendPercent}%`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="w-full h-44 sm:h-48 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chronologicalData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="downloadLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity={1} />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.07)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickFormatter={(val) => `${val}`}
              domain={['dataMin - 5', 'dataMax + 10']}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 border border-cyan-500/40 px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md">
                      <div className="text-gray-400 font-mono text-[10px]">
                        {data.fullDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-gray-300 font-medium">Download:</span>
                        <span className="font-extrabold text-cyan-300 font-mono text-sm">
                          {data.download} Mbps
                        </span>
                      </div>
                      {data.upload !== null && (
                        <div className="text-[11px] text-gray-400 font-mono pl-4">
                          Upload: <span className="text-amber-300 font-bold">{data.upload} Mbps</span>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 font-mono pl-4">
                        Ping: {data.ping} ms • {data.rating}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="download"
              stroke="url(#downloadLineGradient)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#00f0ff',
                stroke: '#090d16',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: '#38bdf8',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              name="Download"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
