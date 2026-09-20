import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy initialize Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback rule-based optimization analysis if Gemini API key is missing or offline
function generateRuleBasedAdvice(metrics: {
  download: number;
  upload?: number | null;
  ping: number;
  jitter: number;
}) {
  const dl = metrics.download;
  const ul = metrics.upload ?? 0;
  const ping = metrics.ping;
  const jitter = metrics.jitter;

  let healthScore = 85;
  let status = 'Kondisi Baik';
  const quickWins: Array<{ title: string; description: string; impact: 'High' | 'Medium' | 'Low' }> = [];
  const advancedTips: Array<{ category: string; tip: string }> = [];

  // Download evaluation
  if (dl < 20) {
    healthScore -= 20;
    status = 'Perlu Optimasi Bandwidth';
    quickWins.push({
      title: 'Beralih ke Frekuensi Wi-Fi 5 GHz',
      description: 'Pita frekuensi 2.4 GHz sering mengalami interferensi microwave & tetangga. Gunakan 5 GHz atau kabel LAN Cat6 untuk peningkatan download instan.',
      impact: 'High',
    });
  } else if (dl >= 50) {
    quickWins.push({
      title: 'Aktifkan DNS Berkecepatan Tinggi',
      description: 'Gunakan Cloudflare DNS (1.1.1.1) atau Google Public DNS (8.8.8.8) di pengaturan router untuk resolusi domain web super kilat.',
      impact: 'Medium',
    });
  }

  // Ping & Jitter evaluation
  if (ping > 35 || jitter > 5) {
    healthScore -= 25;
    status = 'Terdeteksi Latensi & Bufferbloat';
    quickWins.push({
      title: 'Aktifkan Fitur SQM / QoS di Router',
      description: 'Bufferbloat terjadi saat antrean buffer router penuh akibat upload latar belakang. Aktifkan Smart Queue Management (SQM) untuk menstabilkan ping di bawah 20ms.',
      impact: 'High',
    });
    advancedTips.push({
      category: 'Gaming & Latensi',
      tip: 'Gunakan koneksi kabel Ethernet langsung ke PC / Konsol. Wi-Fi selalu menimbulkan jitter akibat benturan paket gelombang radio udara.',
    });
  } else {
    advancedTips.push({
      category: 'Stabilitas',
      tip: 'Ping dan jitter Anda sudah sangat ideal untuk game kompetitif (Valorant/MLBB) dan video call konferensi tanpa frame drop.',
    });
  }

  // Upload evaluation
  if (ul > 0 && ul < 10) {
    advancedTips.push({
      category: 'Unggahan',
      tip: 'Kecepatan upload di bawah 10 Mbps dapat memperlambat pengiriman data saat live streaming atau backup cloud otomatis (Google Drive/iCloud).',
    });
  }

  advancedTips.push({
    category: 'Hardware',
    tip: 'Lakukan restart rutin modem/ONT ISP Anda minimal 1x per 2 minggu untuk membersihkan memory cache dan memperbarui routing session lease.',
  });

  return {
    summary: `Koneksi Anda mencatat kecepatan download ${dl.toFixed(1)} Mbps dengan latensi ${ping} ms (jitter ${jitter} ms). ${
      healthScore >= 80
        ? 'Jaringan tergolong prima untuk streaming resolusi 4K dan aktivitas komputasi modern.'
        : 'Terdapat ruang optimasi terutama pada rute latensi dan stabilitas transmisi paket data.'
    }`,
    healthScore: Math.max(40, Math.min(99, healthScore)),
    status,
    quickWins,
    advancedTips,
    bottleneckAnalysis:
      ping > 40
        ? 'Bottleneck terdeteksi pada jalur hop perutean latensi atau interferensi sinyal nirkabel lokal.'
        : dl < 30
        ? 'Bottleneck berada pada alokasi paket ISP atau limitasi bandwidth kartu jaringan perangkat.'
        : 'Tidak ada bottleneck kritis terdeteksi; koneksi bekerja efisien.',
  };
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Gemini AI Optimization Advice Endpoint
  app.post('/api/ai-optimize', async (req, res) => {
    const { download, upload, ping, jitter, ratingText, historyLength, avgDownload } = req.body || {};

    const dl = Number(download) || 0;
    const ul = upload !== null && upload !== undefined ? Number(upload) : null;
    const p = Number(ping) || 0;
    const j = Number(jitter) || 0;

    const metricsPayload = { download: dl, upload: ul, ping: p, jitter: j };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback to intelligent local diagnostics if no Gemini API key set
        const fallback = generateRuleBasedAdvice(metricsPayload);
        return res.json({
          source: 'local_engine',
          data: fallback,
        });
      }

      const prompt = `Anda adalah Speed-T AI Network Engineer & Optimization Specialist handal.
Berdasarkan data uji performa internet pengguna terkini berikut:
- Kecepatan Download: ${dl.toFixed(1)} Mbps
- Kecepatan Upload: ${ul !== null ? ul.toFixed(1) + ' Mbps' : 'Tidak diuji'}
- Ping (Latensi): ${p} ms
- Jitter: ${j} ms
- Rating Sinyal: ${ratingText || 'Normal'}
- Jumlah Riwayat Tes Pengguna: ${historyLength || 1}
- Rata-rata Download Historis: ${avgDownload ? avgDownload.toFixed(1) + ' Mbps' : dl.toFixed(1) + ' Mbps'}

Berikan diagnosis dan saran kualitatif profesional dalam format JSON valid dengan struktur persis berikut (dalam Bahasa Indonesia yang ramah, ringkas, dan sangat aplikatif):
{
  "summary": "1-2 kalimat ringkasan tajam mengenai performa koneksi ini",
  "healthScore": 85, // Angka integer 1-100 merepresentasikan skor kesehatan koneksi
  "status": "Sangat Prima" | "Stabil & Siap Pakai" | "Perlu Optimasi",
  "quickWins": [
    {
      "title": "Judul langkah praktis (singkat)",
      "description": "Penjelasan solusi yang bisa langsung diterapkan pengguna",
      "impact": "High" | "Medium" | "Low"
    }
  ],
  "advancedTips": [
    {
      "category": "Router & Wi-Fi" | "DNS & Network Stack" | "Gaming & Bufferbloat",
      "tip": "Saran teknis yang mendalam namun mudah dipahami"
    }
  ],
  "bottleneckAnalysis": "Analisis potensi hambatan (bottleneck) seperti frekuensi 2.4GHz, antrean buffer, DNS lambat, atau alokasi paket ISP"
}

PENTING: Hanya keluarkan JSON murni tanpa markdown triple backticks.`;

      // Prioritize high-availability, low-latency models with fallback
      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.8-flash',
      ];

      for (const modelName of candidateModels) {
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
          attempts++;
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                temperature: 0.3,
                responseMimeType: 'application/json',
              },
            });

            const responseText = response.text || '';
            if (responseText) {
              const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
              const parsed = JSON.parse(cleanText);
              return res.json({
                source: modelName,
                data: parsed,
              });
            }
          } catch (modelErr: any) {
            const status = modelErr?.status || modelErr?.code;
            // Transient 503 high demand or 429 rate limit: back off briefly on first attempt or rotate
            if ((status === 503 || status === 429) && attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 800));
              continue;
            }
            break;
          }
        }
      }

      // If remote models encounter temporary high demand (503/429), smoothly provide instant rule-based network diagnosis
      const fallback = generateRuleBasedAdvice(metricsPayload);
      return res.json({
        source: 'local_engine',
        data: fallback,
      });
    } catch (apiErr: any) {
      console.warn('[Gemini AI] Transient optimization error:', apiErr?.message || apiErr);
      const fallback = generateRuleBasedAdvice(metricsPayload);
      return res.json({
        source: 'local_engine',
        data: fallback,
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Speed-T Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
