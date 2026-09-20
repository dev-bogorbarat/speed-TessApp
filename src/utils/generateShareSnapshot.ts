import { SpeedTestHistoryItem } from '../types';

export interface GeneratedSnapshot {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob | null;
}

export async function generateSpeedTestSnapshot(
  item: SpeedTestHistoryItem
): Promise<GeneratedSnapshot> {
  const width = 1080;
  const height = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Base Dark Cyber Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#060911');
  bgGrad.addColorStop(0.45, '#0d1527');
  bgGrad.addColorStop(1, '#080d1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Neon Ambient Glows
  const cyanGlow = ctx.createRadialGradient(200, 180, 20, 200, 180, 450);
  cyanGlow.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
  cyanGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, width, height);

  const goldGlow = ctx.createRadialGradient(880, 850, 20, 880, 850, 450);
  goldGlow.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
  goldGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = goldGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Cyber Grid lines subtle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 4. Outer Glowing Frame
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Corner Accents
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * 35);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * 35, cy);
    ctx.stroke();
  };
  drawCorner(40, 40, 1, 1);
  drawCorner(width - 40, 40, -1, 1);
  drawCorner(40, height - 40, 1, -1);
  drawCorner(width - 40, height - 40, -1, -1);

  // 5. Header: App Logo & VIP PRO Badge
  ctx.textAlign = 'center';

  // VIP Pill Tag
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillText('★ SPEED-T PRO • OFFICIAL SNAPSHOT ★', width / 2, 115);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px system-ui, -apple-system, sans-serif';
  ctx.fillText('SPEED-T NETWORK PERFORMANCE', width / 2, 185);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText(
    `Pengujian: ${item.dateStr}  •  Pukul: ${item.timeStr} WIB`,
    width / 2,
    228
  );

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(120, 260);
  ctx.lineTo(width - 120, 260);
  ctx.stroke();

  // 6. Big Hero Metric Box: Download Speed
  const heroBoxY = 295;
  const heroBoxH = 260;
  const heroGrad = ctx.createLinearGradient(0, heroBoxY, 0, heroBoxY + heroBoxH);
  heroGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
  heroGrad.addColorStop(1, 'rgba(11, 15, 25, 0.95)');
  ctx.fillStyle = heroGrad;
  ctx.fillRect(100, heroBoxY, width - 200, heroBoxH);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, heroBoxY, width - 200, heroBoxH);

  // Download label
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillText('▼ KECEPATAN DOWNLOAD', width / 2, heroBoxY + 52);

  // Big number
  ctx.fillStyle = '#00f0ff';
  ctx.font = '900 110px system-ui, -apple-system, sans-serif';
  ctx.fillText(item.download.toFixed(1), width / 2, heroBoxY + 165);

  // Unit
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 28px system-ui, sans-serif';
  ctx.fillText('Mbps (Megabits per second)', width / 2, heroBoxY + 215);

  // 7. Secondary Metrics Grid (Upload, Ping, Jitter)
  const secY = 585;
  const secH = 190;
  const cardW = 265;
  const gap = 35;
  const startX = (width - (cardW * 3 + gap * 2)) / 2;

  const drawSecCard = (
    label: string,
    val: string,
    unit: string,
    x: number,
    color: string,
    sub: string
  ) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(x, secY, cardW, secH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, secY, cardW, secH);

    // Color top bar
    ctx.fillStyle = color;
    ctx.fillRect(x, secY, cardW, 5);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(label, x + cardW / 2, secY + 40);

    ctx.fillStyle = color;
    ctx.font = '900 52px system-ui, sans-serif';
    ctx.fillText(val, x + cardW / 2, secY + 105);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText(unit, x + cardW / 2, secY + 140);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(sub, x + cardW / 2, secY + 165);
  };

  drawSecCard(
    '▲ UPLOAD',
    item.upload !== null ? item.upload.toFixed(1) : '-',
    'Mbps',
    startX,
    '#f59e0b',
    'Transmisi Data'
  );

  drawSecCard(
    '⚡ LATENSI PING',
    `${item.ping}`,
    'ms',
    startX + cardW + gap,
    '#10b981',
    'Respon Jaringan'
  );

  drawSecCard(
    '≈ JITTER',
    `${item.jitter}`,
    'ms',
    startX + (cardW + gap) * 2,
    '#a855f7',
    'Variasi Koneksi'
  );

  // 8. Quality Rating Pill Banner
  const bannerY = 805;
  const bannerH = 75;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.fillRect(100, bannerY, width - 200, bannerH);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(100, bannerY, width - 200, bannerH);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(
    `✓ STATUS: ${item.ratingText.toUpperCase()} • IDEAL UNTUK GAMING, STREAMING 4K & VIDEO CALL`,
    width / 2,
    bannerY + 46
  );

  // 9. Footer: Watermark & Verification Stamp
  ctx.fillStyle = '#64748b';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(
    'Terverifikasi oleh Speed-T Network Engine • Architected by Anak bangsa',
    width / 2,
    930
  );

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText('SPEED-T • WEB APPLICATION', width / 2, 960);

  // Produce dataUrl & blob
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  );

  return {
    canvas,
    dataUrl,
    blob,
  };
}
