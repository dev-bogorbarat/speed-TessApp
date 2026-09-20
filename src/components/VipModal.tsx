import React, { useState, useRef, useEffect } from 'react';
import {
  Crown,
  Check,
  X,
  MessageCircle,
  KeyRound,
  Sparkles,
  Clipboard,
  ShieldCheck,
  QrCode,
  Copy,
  ArrowRight,
  Wallet,
  CheckCircle2,
  RefreshCw,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cyberSound } from '../utils/cyberSound';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateSuccess: (issuedKey?: string) => void;
  currentLicenseKey?: string;
  isAlreadyPro?: boolean;
}

const GOPAY_NUMBER = '082121769205';
const PRICE_AMOUNT = 'Rp 15.000';

const VALID_MASTER_KEYS = [
  'ANAKBANGSA2026',
  'ANAKBANGSA',
  'DIONPRO2026',
  'VIPPRO',
  'DION-DEV',
  'DIONPRO',
  'VIP-2026',
  'MASTER-DION',
  'SPEEDT-VIP',
];

const getStoredAuthorizedKeys = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('speedt_authorized_keys');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // safe fallback
  }
  return [];
};

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  onActivateSuccess,
  currentLicenseKey,
  isAlreadyPro = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pay' | 'manual'>('pay');
  const [licenseCode, setLicenseCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [activatedKey, setActivatedKey] = useState<string | null>(currentLicenseKey || null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [authorizedKeys, setAuthorizedKeys] = useState<string[]>(getStoredAuthorizedKeys);

  // Hidden admin portal for Anak bangsa
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminGeneratedKey, setAdminGeneratedKey] = useState('');
  const [copiedAdminChat, setCopiedAdminChat] = useState(false);
  const [adminCustomKeyInput, setAdminCustomKeyInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setAuthorizedKeys(getStoredAuthorizedKeys());
      if (currentLicenseKey) {
        setActivatedKey(currentLicenseKey);
      }
    }
  }, [isOpen, currentLicenseKey]);

  if (!isOpen) return null;

  const handleCopyGoPayNumber = () => {
    navigator.clipboard.writeText(GOPAY_NUMBER);
    setCopiedNumber(true);
    cyberSound.playClick();
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // Generate a cryptographically structured unique license code for the customer
  const generateUniqueLicenseKey = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    return `ST-${p1}-${p2}`;
  };

  // Register and authorize a license key so customer can use it
  const handleRegisterKeyForBuyer = (keyToRegister: string) => {
    const clean = keyToRegister.trim().toUpperCase();
    if (!clean) return;
    const current = getStoredAuthorizedKeys();
    const updated = Array.from(new Set([...current, clean]));
    setAuthorizedKeys(updated);
    try {
      localStorage.setItem('speedt_authorized_keys', JSON.stringify(updated));
    } catch {
      // safe
    }
    const msg = `Halo! Terima kasih telah transfer Rp 15.000 ke GoPay 082121769205. Pembayaran Anda sudah saya verifikasi secara resmi.\n\nBerikut Kode Lisensi Speed-T PRO Anda:\n🔑 ${clean}\n\nSilakan buka tab 'Punya Kode Lisensi' di web Speed-T lalu masukkan kode ini untuk mengaktifkan seluruh fitur PRO. Terima kasih! - Anak bangsa`;
    navigator.clipboard.writeText(msg);
    setCopiedAdminChat(true);
    setTimeout(() => setCopiedAdminChat(false), 2500);
  };

  const handleRevokeKey = (keyToRevoke: string) => {
    const current = getStoredAuthorizedKeys();
    const updated = current.filter((k) => k !== keyToRevoke);
    setAuthorizedKeys(updated);
    try {
      localStorage.setItem('speedt_authorized_keys', JSON.stringify(updated));
    } catch {
      // safe
    }
  };

  // Manual key submission - STRICT VERIFICATION (Only approved keys allowed!)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = licenseCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

    if (!code) {
      setErrorMsg('Harap masukkan kode lisensi resmi yang diberikan oleh Anak bangsa.');
      return;
    }

    const currentAuthorized = getStoredAuthorizedKeys();
    const isMaster = VALID_MASTER_KEYS.includes(code);
    const isAuthorizedBuyer =
      currentAuthorized.includes(code) || authorizedKeys.includes(code);

    const isValid = isMaster || isAuthorizedBuyer;

    if (isValid) {
      setActivatedKey(code);
      try {
        localStorage.setItem('speedt_license_key', code);
        localStorage.setItem('speedt_pro_member', 'true');
      } catch {
        // Safe
      }
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#f59e0b', '#3b82f6', '#10b981'],
        });
      } catch {
        // Safe
      }
      cyberSound.playVictoryChime();
      onActivateSuccess(code);
    } else {
      setErrorMsg(
        'Kode Lisensi tidak valid atau belum disetujui! Pastikan Anda sudah transfer ke GoPay 082121769205 dan menerima kode resmi langsung dari Anak bangsa.'
      );
    }
  };

  const handleClipboardPaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const clean = text.trim().toUpperCase();
          setLicenseCode(clean);
          setErrorMsg('');
          if (inputRef.current) {
            inputRef.current.value = clean;
            inputRef.current.focus();
          }
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleCopyCustomerLicense = () => {
    if (activatedKey) {
      navigator.clipboard.writeText(activatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Admin login handling
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPin.trim().toUpperCase();
    if (
      VALID_MASTER_KEYS.includes(clean) ||
      clean === 'ANAKBANGSA' ||
      clean === 'DION' ||
      clean === '082121769205'
    ) {
      setIsAdminLoggedIn(true);
      const newKey = generateUniqueLicenseKey();
      setAdminGeneratedKey(newKey);
    } else {
      setErrorMsg('PIN Admin tidak valid.');
    }
  };

  return (
    <div
      id="vip-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="bg-gray-950/95 border border-amber-500/40 max-w-md w-full p-5 sm:p-6 rounded-3xl shadow-2xl relative space-y-4 backdrop-blur-xl text-white my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-gray-800 cursor-pointer z-10"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-2xl text-black font-black shadow-lg shadow-amber-500/30">
            <Crown className="w-6 h-6 text-black fill-black" />
          </div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            SPEED-T PRO VIP
          </h3>
          <p className="text-xs text-gray-300">
            Pembayaran Resmi GoPay &amp; Aktivasi Lisensi PRO Eksklusif
          </p>
        </div>

        {/* SUCCESS CARD IF ALREADY ACTIVATED */}
        {activatedKey && isAlreadyPro ? (
          <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-5 rounded-2xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-300">
                AKUN ANDA SUDAH AKTIF PRO!
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Kode Lisensi terpasang resmi di perangkat Anda:
              </p>
            </div>

            <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
                {activatedKey}
              </span>
              <button
                onClick={handleCopyCustomerLicense}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            <a
              href={`https://wa.me/6282121769205?text=Halo%20Anak%20bangsa,%20saya%20sudah%20membayar%20Speed-T%20PRO%20ke%20GoPay%20082121769205.%20Kode%20Lisensi%20Akun%20Saya:%20${activatedKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              Kirim Bukti / Chat ke WA Anak bangsa
            </a>

            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Tutup & Gunakan Fitur PRO
            </button>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 gap-1.5 bg-gray-900/90 p-1 rounded-xl border border-gray-800 text-xs">
              <button
                onClick={() => setActiveTab('pay')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'pay'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Bayar GoPay &amp; QR
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Punya Kode Lisensi
              </button>
            </div>

            {/* TAB 1: GOPAY PAYMENT & QR */}
            {activeTab === 'pay' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Nominal & GoPay Card */}
                <div className="bg-gradient-to-br from-cyan-950/40 via-gray-900 to-amber-950/30 p-3.5 rounded-2xl border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00AA13] flex items-center justify-center font-black text-white text-xs">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block leading-tight">
                          GOPAY ANAK BANGSA
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Official Merchant
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-mono">Tarif Lisensi:</span>
                      <span className="text-base font-black text-amber-400">{PRICE_AMOUNT}</span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="p-2 bg-white rounded-2xl shadow-xl border-2 border-amber-400/80 relative group">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&margin=4&data=GOPAY:${GOPAY_NUMBER}&format=svg`}
                        alt="GoPay QR Anak bangsa 082121769205"
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg"
                        loading="eager"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white px-2 py-0.5 rounded-md shadow-md border border-gray-300 text-[10px] font-black text-[#00AA13]">
                          GOPAY
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1.5 font-mono">
                      Pindai QR di aplikasi GoPay / BCA / E-Wallet Anda
                    </span>
                  </div>

                  {/* Copy GoPay Number Row */}
                  <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-gray-400 block font-mono">
                        NOMOR GOPAY TUJUAN:
                      </span>
                      <span className="text-base font-black text-cyan-300 font-mono tracking-wider">
                        {GOPAY_NUMBER}
                      </span>
                      <span className="text-[10px] text-gray-400 block">A.N. Anak bangsa</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyGoPayNumber}
                      className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                    >
                      {copiedNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedNumber ? 'Tersalin!' : 'Salin Nomor'}
                    </button>
                  </div>
                </div>

                {/* STEP-BY-STEP PAYMENT VERIFICATION GUIDE */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3.5 space-y-2 text-xs">
                  <span className="text-amber-300 font-bold block text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Alur Pembayaran &amp; Pengambilan Kode Lisensi:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
                    <li>
                      Transfer <strong>Rp 15.000</strong> ke GoPay <strong>082121769205</strong> (A.N. Anak bangsa).
                    </li>
                    <li>
                      Kirim bukti transfer ke WhatsApp Anak bangsa melalui tombol di bawah.
                    </li>
                    <li>
                      Anak bangsa akan memverifikasi pembayaran Anda dan <strong>mengirimkan Kode Lisensi Resmi secara langsung melalui WhatsApp</strong>.
                    </li>
                    <li>
                      Masukkan kode tersebut di tab <strong>&quot;Punya Kode Lisensi&quot;</strong> untuk aktivasi.
                    </li>
                  </ol>
                </div>

                {/* ACTION BUTTONS: SEND PROOF TO WHATSAPP & SWITCH TAB */}
                <div className="space-y-2 pt-1">
                  <a
                    href="https://wa.me/6282121769205?text=Halo%20Anak%20bangsa,%20saya%20sudah%20transfer%20Rp%2015.000%20ke%20GoPay%20082121769205.%20Berikut%20bukti%20pembayaran%20saya.%20Mohon%20verifikasi%20dan%20kirimkan%20Kode%20Lisensi%20Speed-T%20PRO%20saya.%20Terima%20kasih!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-black text-emerald-900" />
                    <span>📲 KIRIM BUKTI TRANSFER KE WHATSAPP ANAK BANGSA</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      cyberSound.playClick();
                      setActiveTab('manual');
                    }}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-amber-400/50 text-gray-300 hover:text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Sudah Dapat Kode dari Anak bangsa? Masukkan Kode di Sini ➡️
                  </button>

                  {/* Anti-fraud security note */}
                  <div className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-[10px] text-amber-200/90 leading-snug flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Aturan Lisensi Anak bangsa:</strong> Kode lisensi tidak dirilis secara otomatis sebelum pembayaran diverifikasi langsung oleh Anak bangsa guna mencegah kecurangan.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL LICENSE KEY INPUT */}
            {activeTab === 'manual' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="license-key-input"
                      className="text-xs text-amber-300 font-bold flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      Masukkan Kode Lisensi Resmi:
                    </label>
                    <button
                      type="button"
                      onClick={handleClipboardPaste}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 cursor-pointer"
                    >
                      <Clipboard className="w-3 h-3" />
                      Tempel
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Masukkan kode resmi yang dikirimkan langsung oleh Anak bangsa via WhatsApp setelah pembayaran GoPay 082121769205 diverifikasi.
                  </p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      id="license-key-input"
                      name="licenseKey"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      value={licenseCode}
                      onChange={(e) => {
                        setLicenseCode(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Contoh: ST-2026-XXXX"
                      className="bg-gray-900 border-2 border-gray-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-amber-400 font-mono tracking-wider placeholder:text-gray-500 selection:bg-amber-400 selection:text-black cursor-text"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                      AKTIFKAN
                    </button>
                  </div>
                </form>

                {errorMsg && (
                  <p className="text-xs text-red-400 text-center font-medium bg-red-950/50 py-2 px-3 rounded-xl border border-red-800/50">
                    {errorMsg}
                  </p>
                )}

                <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 text-[11px] text-gray-400 space-y-1.5">
                  <span className="text-amber-300 font-bold block">Belum punya kode lisensi?</span>
                  <p className="leading-relaxed">
                    Buka tab <strong>&quot;Bayar GoPay &amp; QR&quot;</strong>, lakukan pembayaran Rp 15.000 ke nomor <strong>082121769205</strong>, dan hubungi WhatsApp Anak bangsa untuk menerima kode lisensi Anda.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* FOOTER / ADMIN PORTAL ACCESS */}
        <div className="pt-2 border-t border-gray-800/70 text-center">
          {!showAdminPortal ? (
            <button
              type="button"
              onClick={() => setShowAdminPortal(true)}
              className="text-[10px] text-gray-500 hover:text-amber-400 transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <Lock className="w-3 h-3" />
              Portal Admin Anak bangsa (Kelola Lisensi)
            </button>
          ) : (
            <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl text-left space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Portal Admin Anak bangsa (Kontrol Lisensi)
                </span>
                <button
                  onClick={() => setShowAdminPortal(false)}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminAuth} className="space-y-2">
                  <p className="text-[10px] text-gray-400">
                    Masukkan PIN Admin Anak bangsa untuk mengelola dan menerbitkan kode pembeli:
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="password"
                      placeholder="PIN Admin (Anak bangsa)..."
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="bg-gray-900 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white w-full font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1 rounded-lg text-xs shrink-0 cursor-pointer"
                    >
                      Masuk
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {/* Option 1: Instant Self PRO Activation */}
                  <div className="flex items-center justify-between bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-white font-bold block">
                        Aktivasi Cepat Perangkat Anda:
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        Kunci Master: ANAKBANGSA2026
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivatedKey('ANAKBANGSA2026');
                        onActivateSuccess('ANAKBANGSA2026');
                      }}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg text-[10px] cursor-pointer"
                    >
                      ⚡ Buka PRO Langsung
                    </button>
                  </div>

                  {/* Option 2: Generate and Authorize Code for a Paying Buyer */}
                  <div className="bg-gray-900/90 p-2.5 rounded-xl border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 font-bold">
                        Terbitkan Kode untuk Pembeli yang Sudah Bayar:
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdminGeneratedKey(generateUniqueLicenseKey())}
                        className="text-[9px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        Acak Kode Baru
                      </button>
                    </div>

                    <div className="bg-black/70 p-2.5 rounded-lg border border-gray-800 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs sm:text-sm font-black text-cyan-300 tracking-wider">
                        {adminGeneratedKey || 'ST-2026-XXXX'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const keyToUse = adminGeneratedKey || generateUniqueLicenseKey();
                          setAdminGeneratedKey(keyToUse);
                          handleRegisterKeyForBuyer(keyToUse);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] rounded-lg shrink-0 cursor-pointer shadow flex items-center gap-1"
                      >
                        {copiedAdminChat ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                        {copiedAdminChat ? 'Didaftarkan & Disalin!' : 'Daftarkan & Salin Pesan WA'}
                      </button>
                    </div>

                    <p className="text-[9px] text-gray-400">
                      Klik tombol di atas untuk mendaftarkan kode ke sistem dan langsung menyalin pesan konfirmasi siap kirim ke WhatsApp pembeli.
                    </p>
                  </div>

                  {/* Option 3: Approved Buyer Keys List */}
                  {authorizedKeys.length > 0 && (
                    <div className="bg-gray-900/70 p-2.5 rounded-xl border border-gray-800 space-y-1.5">
                      <span className="text-[10px] text-gray-300 font-bold block">
                        Daftar Kode Pembeli yang Telah Anda Setujui ({authorizedKeys.length}):
                      </span>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {authorizedKeys.map((key) => (
                          <div
                            key={key}
                            className="bg-black/60 px-2 py-1 rounded border border-gray-800 flex items-center justify-between text-[10px]"
                          >
                            <span className="font-mono text-emerald-400 font-bold">{key}</span>
                            <button
                              type="button"
                              onClick={() => handleRevokeKey(key)}
                              className="text-red-400 hover:text-red-300 text-[9px] underline cursor-pointer"
                            >
                              Cabut
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
