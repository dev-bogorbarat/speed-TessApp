import React from 'react';

interface LatencyChartProps {
  data: number[];
  themeColorHex?: string;
}

export const LatencyChart: React.FC<LatencyChartProps> = ({
  data,
  themeColorHex = '#00f0ff',
}) => {
  const points = data.length > 0 ? data : [0, 0, 0, 0, 0];
  const maxVal = Math.max(...points, 60);
  const minVal = 0;

  const width = 400;
  const height = 120;
  const paddingX = 25;
  const paddingY = 16;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getCoordinates = (val: number, index: number) => {
    const x =
      paddingX +
      (points.length > 1
        ? (index / (points.length - 1)) * chartWidth
        : chartWidth / 2);
    const normalizedY = (val - minVal) / (maxVal - minVal || 1);
    const y = height - paddingY - normalizedY * chartHeight;
    return { x, y };
  };

  const coords = points.map((val, idx) => getCoordinates(val, idx));

  // Generate smooth SVG curve path
  const linePath = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = coords[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x},${height - paddingY} L ${coords[0].x},${height - paddingY} Z`
      : '';

  return (
    <div className="w-full h-36 flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={themeColorHex} stopOpacity="0.3" />
            <stop offset="100%" stopColor={themeColorHex} stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor={themeColorHex}
              floodOpacity="0.6"
            />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = height - paddingY - ratio * chartHeight;
          const valLabel = Math.round(minVal + ratio * (maxVal - minVal));
          return (
            <g key={ratio}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="3 3"
              />
              <text
                x={paddingX - 4}
                y={y + 3}
                fill="#6b7280"
                fontSize="9"
                textAnchor="end"
              >
                {valLabel}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#latencyAreaGrad)" />
        )}

        {/* Line stroke */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={themeColorHex}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}

        {/* Data points */}
        {coords.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#0b0f19"
              stroke={themeColorHex}
              strokeWidth="2"
            />
            {points[idx] > 0 && (
              <text
                x={pt.x}
                y={pt.y - 8}
                fill="#e5e7eb"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {Math.round(points[idx])}ms
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
