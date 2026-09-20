import { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { IntroScreen } from './components/IntroScreen';
import { SpeedTestPanel } from './components/SpeedTestPanel';
import { Studio3DPanel } from './components/Studio3DPanel';
import { VipGamingMatrix } from './components/VipGamingMatrix';
import { VipCertificateModal } from './components/VipCertificateModal';
import { VipModal } from './components/VipModal';
import { TestHistoryPanel } from './components/TestHistoryPanel';
import { ShapeType, VisualFxMode, WarpMode, NetworkMetrics, SpeedTestHistoryItem } from './types';
import { Crown, Sparkles, CheckCircle2, Award, Gamepad2, History } from 'lucide-react';
import { cyberSound } from './utils/cyberSound';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    try {
      return localStorage.getItem('speedt_pro_member') === 'true';
    } catch {
      return false;
    }
  });
  const [licenseKey, setLicenseKey] = useState<string>(() => {
    try {
      return localStorage.getItem('speedt_license_key') || '';
    } catch {
      return '';
    }
  });
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // 3D Customization & VIP FX State
  const [shape, setShape] = useState<ShapeType>('torus');
  const [colorHex, setColorHex] = useState<number>(0x00f0ff);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(5);
  const [fxMode, setFxMode] = useState<VisualFxMode>('standard');
  const [warpMode, setWarpMode] = useState<WarpMode>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTestingSpeed, setIsTestingSpeed] = useState<boolean>(false);

  const [latestMetrics, setLatestMetrics] = useState<NetworkMetrics>({
    ping: 22,
    download: 48.5,
    jitter: 3,
    upload: 21.4,
  });

  const [certificateMetrics, setCertificateMetrics] = useState<NetworkMetrics>({
    ping: 22,
    download: 48.5,
    jitter: 3,
    upload: 21.4,
  });

  // Speed test history stored in localStorage
  const [testHistory, setTestHistory] = useState<SpeedTestHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('speedt_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // safe fallback
    }

    // Default pre-seeded test history for instant polish
    return [
      {
        id: 'seed_1',
        timestamp: Date.now() - 1000 * 60 * 18,
        dateStr: '20 Sep 2026',
        timeStr: '16:15',
        ping: 18,
        download: 64.2,
        upload: 28.5,
        jitter: 2,
        ratingText: 'Sangat Cepat',
        ratingColor: 'text-emerald-400',
      },
      {
        id: 'seed_2',
        timestamp: Date.now() - 1000 * 60 * 75,
        dateStr: '20 Sep 2026',
        timeStr: '15:18',
        ping: 22,
        download: 51.8,
        upload: 21.4,
        jitter: 3,
        ratingText: 'Sangat Cepat',
        ratingColor: 'text-emerald-400',
      },
      {
        id: 'seed_3',
        timestamp: Date.now() - 1000 * 60 * 160,
        dateStr: '20 Sep 2026',
        timeStr: '13:52',
        ping: 25,
        download: 38.6,
        upload: 15.2,
        jitter: 4,
        ratingText: 'Stabil & Cepat',
        ratingColor: 'text-cyan-400',
      },
    ];
  });

  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Convert hex number to CSS string for UI accent sync
  const hexColorString = `#${colorHex.toString(16).padStart(6, '0')}`;

  const handleActivatePro = (issuedKey?: string) => {
    setIsProMember(true);
    if (issuedKey) {
      setLicenseKey(issuedKey);
    }
    try {
      localStorage.setItem('speedt_pro_member', 'true');
      if (issuedKey) {
        localStorage.setItem('speedt_license_key', issuedKey);
      }
    } catch {
      // safe fallback
    }
    cyberSound.playVictoryChime();
    setShowNotification(
      issuedKey
        ? `🎉 Lisensi Terverifikasi! Akun Speed-T PRO [${issuedKey}] Berhasil Aktif.`
        : '🎉 Selamat! Akun PRO, Matriks Gaming & Studio 3D VIP Berhasil Terbuka.'
    );
    setTimeout(() => setShowNotification(null), 6000);
  };

  const handleClearHistory = () => {
    setTestHistory([]);
    try {
      localStorage.removeItem('speedt_history');
    } catch {
      // safe fallback
    }
    setShowNotification('🗑️ Riwayat tes kecepatan berhasil dibersihkan.');
    setTimeout(() => setShowNotification(null), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 1. INTRO / LANDING SCREEN */}
      {showIntro && <IntroScreen onEnter={() => setShowIntro(false)} />}

      {/* 2. 3D BACKGROUND CANVAS WITH WARP PARTICLES */}
      <ThreeCanvas
        shape={shape}
        colorHex={colorHex}
        wireframe={wireframe}
        rotationSpeedMultiplier={rotationSpeed / 5}
        fxMode={fxMode}
        warpMode={warpMode}
        isTestingSpeed={isTestingSpeed}
      />

      {/* NOTIFICATION TOAST */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div
        id="main-dashboard"
        className="relative z-10 min-h-screen flex flex-col justify-between p-4 md:p-8 max-w-6xl mx-auto space-y-6"
      >
        {/* HEADER */}
        <header className="bg-gray-900/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-3.5 rounded-full animate-ping"
              style={{ backgroundColor: hexColorString }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  SPEED-T
                </h1>
                {isProMember && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-[9px] px-1.5 py-0.2 rounded font-mono">
                    PRO VIP
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">
                Architected by <strong className="text-cyan-400">Anak bangsa</strong>
              </span>
            </div>
          </div>

          {/* User Plan Status & VIP Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span
              id="user-plan-badge"
              className="bg-gray-800/90 text-gray-300 px-3 py-1.5 rounded-xl border border-gray-700 font-medium flex items-center gap-1.5"
            >
              <span>Status:</span>
              {isProMember ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  VIP PRO 👑
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">GRATIS</span>
              )}
            </span>

            {isProMember && licenseKey && (
              <span
                onClick={() => setIsVipModalOpen(true)}
                title="Klik untuk melihat detail lisensi Anda"
                className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 px-2.5 py-1 rounded-xl cursor-pointer transition shadow-sm"
              >
                <span>🔑</span>
                <span>{licenseKey}</span>
              </span>
            )}

            {isProMember && (
              <button
                onClick={() => {
                  setCertificateMetrics(latestMetrics);
                  setIsCertificateOpen(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer text-[11px]"
              >
                <Award className="w-3.5 h-3.5" />
                SERTIFIKAT PRO
              </button>
            )}

            {!isProMember ? (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold px-3.5 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-black" />
                👑 UPGRADE PRO (GOPAY)
              </button>
            ) : (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                LISENSI VIP
              </button>
            )}
          </div>
        </header>

        {/* MAIN INTERACTIVE GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL KIRI: FITUR UJI KECEPATAN */}
          <div className="lg:col-span-7 space-y-6">
            <SpeedTestPanel
              isProMember={isProMember}
              onOpenVipModal={() => setIsVipModalOpen(true)}
              onOpenGamingMatrix={() => {
                const el = document.getElementById('vip-gaming-matrix');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCertificate={() => {
                setCertificateMetrics(latestMetrics);
                setIsCertificateOpen(true);
              }}
              onTestingChange={setIsTestingSpeed}
              onMetricsChange={(m) => {
                if (m.ping !== null || m.download !== null) {
                  setLatestMetrics(m);
                }
              }}
              onTestCompleteRecord={(record) => {
                setLatestMetrics({
                  ping: record.ping,
                  download: record.download,
                  jitter: record.jitter,
                  upload: record.upload,
                });
                setCertificateMetrics({
                  ping: record.ping,
                  download: record.download,
                  jitter: record.jitter,
                  upload: record.upload,
                });
                setTestHistory((prev) => [record, ...prev.filter((r) => r.id !== record.id)].slice(0, 30));
              }}
              activeColorHex={hexColorString}
            />

            {/* VIP EXCLUSIVE: MATRIKS ANALISIS GAMING & STREAMING */}
            {isProMember && (
              <div id="vip-gaming-matrix">
                <VipGamingMatrix
                  metrics={latestMetrics}
                  onOpenCertificate={() => {
                    setCertificateMetrics(latestMetrics);
                    setIsCertificateOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* PANEL KANAN: KUSTOMISASI ANIMASI 3D VIP */}
          <div className="lg:col-span-5 space-y-6">
            <Studio3DPanel
              isProMember={isProMember}
              shape={shape}
              colorHex={colorHex}
              wireframe={wireframe}
              rotationSpeed={rotationSpeed}
              fxMode={fxMode}
              warpMode={warpMode}
              soundEnabled={soundEnabled}
              onSelectShape={setShape}
              onSelectColor={setColorHex}
              onToggleWireframe={setWireframe}
              onChangeSpeed={setRotationSpeed}
              onSelectFxMode={setFxMode}
              onToggleWarp={setWarpMode}
              onToggleSound={setSoundEnabled}
              onOpenVipModal={() => setIsVipModalOpen(true)}
            />

            {/* If NOT pro member yet, show preview of Gaming Matrix teaser */}
            {!isProMember && (
              <div
                onClick={() => setIsVipModalOpen(true)}
                className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/30 p-4 rounded-3xl cursor-pointer hover:border-amber-400 transition text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Matriks Latensi Game Online (PRO)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-black bg-amber-400 px-1.5 py-0.5 rounded">
                    TERKUNCI 🔒
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Buka akses PRO untuk melihat estimasi ping akurat game Valorant, Mobile Legends, PUBG Mobile, serta sertifikat resmi Speed-T.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* 4. RIWAYAT 5 TES KECEPATAN TERAKHIR (DI BAWAH PANEL UTAMA KHUSUS PRO) */}
        {isProMember ? (
          <TestHistoryPanel
            history={testHistory}
            onClearHistory={handleClearHistory}
            onSelectCertificate={(itemMetrics) => {
              setCertificateMetrics(itemMetrics);
              setIsCertificateOpen(true);
            }}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            isProMember={isProMember}
          />
        ) : (
          <div
            onClick={() => setIsVipModalOpen(true)}
            className="bg-gray-900/60 hover:bg-gray-900/90 border border-gray-800 hover:border-amber-500/30 p-4 rounded-3xl cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    Riwayat 5 Tes Kecepatan Terakhir
                  </span>
                  <span className="text-[10px] bg-amber-400 text-black font-extrabold px-1.5 py-0.2 rounded font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Simpan riwayat pengujian kecepatan otomatis ke browser &amp; terbitkan sertifikat per tes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold whitespace-nowrap">
              <span>Buka Fitur Riwayat</span>
              <span>🔒</span>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center py-4 border-t border-gray-800/80 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2 px-2">
          <div>
            &copy; 2026 Designed & Built by{' '}
            <span className="text-cyan-400 font-semibold">Anak bangsa</span> • Speed-T Network Engine
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setShowIntro(true)}
              className="text-gray-400 hover:text-cyan-300 transition cursor-pointer"
            >
              Lihat Intro Speed-T
            </button>
            {isProMember && (
              <button
                onClick={() => {
                  setIsProMember(false);
                  setLicenseKey('');
                  try {
                    localStorage.removeItem('speedt_pro_member');
                    localStorage.removeItem('speedt_license_key');
                  } catch {
                    // ignore
                  }
                }}
                className="text-gray-500 hover:text-amber-400 transition cursor-pointer"
              >
                Reset ke Mode Free
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* 5. MODAL PEMBELIAN GOPAY / AKTIVASI PRO */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onActivateSuccess={handleActivatePro}
        currentLicenseKey={licenseKey}
        isAlreadyPro={isProMember}
      />

      {/* 6. MODAL SERTIFIKAT SPEED-T RESMI (PRO EXCLUSIVE) */}
      <VipCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        metrics={certificateMetrics}
      />
    </div>
  );
}
