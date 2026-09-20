export type ShapeType = 'torus' | 'sphere' | 'cube' | 'dodecahedron' | 'helix' | 'octahedron';

export type VisualFxMode = 'standard' | 'wireframe' | 'points' | 'chrome';

export type WarpMode = 'normal' | 'hyperspace' | 'audioReactive';

export interface NetworkMetrics {
  ping: number | null;
  download: number | null;
  jitter: number | null;
  upload: number | null;
  bufferbloatScore?: string;
  packetLoss?: number;
  edgeNode?: string;
  ipAddress?: string;
  httpProtocol?: string;
}

export interface GamePingRating {
  name: string;
  game: string;
  category: 'FPS' | 'MOBA' | 'Battle Royale' | 'Streaming';
  estimatedMs: number;
  grade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  iconColor: string;
}

export type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'completed';

export interface PingDataPoint {
  sample: number;
  timeMs: number;
}

export interface NetworkDetails {
  ip?: string;
  isp?: string;
  city?: string;
  country?: string;
  protocol?: string;
  edgeDatacenter?: string;
}

export interface ColorTheme {
  name: string;
  hex: number;
  css: string;
  glow: string;
}

export interface SpeedTestHistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  ping: number;
  download: number;
  upload: number | null;
  jitter: number;
  ratingText: string;
  ratingColor: string;
}

