// src/sections/Services.jsx
import { useEffect, useRef, useState } from "react";
import Reveal from "../components/Reveal";
import Phone3D from "../components/Phone3D";

/* ================== Konten layanan ================== */
const items = [
  { key: "adminApp",   title: "Aplikasi Admin Dasbor",       desc: "Masuk Admin ActiTrack" },
  { key: "empDash",    title: "Dashboard Karyawan",          desc: "Halaman interaksi karyawan dengan tugas yang ditetapkan oleh admin perusahaan/lembaga." },
  { key: "adminDash",  title: "Admin Dasbor",                desc: "Dashboard Admin Pengelola Aktivitas/Pelacakan Karyawan" },
  { key: "regular",    title: "Presensi Reguler",            desc: "Presensi reguler berbasis geo location (masuk, pulang)" },
  { key: "assignment", title: "Presensi berbasis penugasan", desc: "Presensi di lokasi yang telah ditetapkan, sesuai dengan instruksi kerja" },
  { key: "upload",     title: "Upload Kegiatan",             desc: "Upload Foto Kegiatan sesuai dengan instruksi tugas" },
];

/* warna ikon */
const COLOR = {
  adminApp:   { bg: "bg-orange-500/10",  text: "text-orange-500"  },
  empDash:    { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  adminDash:  { bg: "bg-rose-500/10",    text: "text-rose-500"    },
  regular:    { bg: "bg-cyan-500/10",    text: "text-cyan-500"    },
  assignment: { bg: "bg-yellow-500/10",  text: "text-yellow-500"  },
  upload:     { bg: "bg-indigo-500/10",  text: "text-indigo-500"  },
};

/* ikon */
const Icons = {
  adminApp: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 7V6a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.6" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3.5 11h17" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  empDash: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.6" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 9h4m2 0h4M7 13h3m2 0h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  adminDash: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="11" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="9.5" y="7" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="15.5" y="3" width="3" height="17" rx="1" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  regular: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M4 20a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  assignment: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.2 5.2l1.8 1.8M17 17l1.8 1.8M18.8 5.2 17 7M7 17l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  upload: (cls="h-5 w-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 3.5V7m10-3.5V7M4 9.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/>
    </svg>
  ),
};

/* util */
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const lerp  = (a, b, t) => a + (b - a) * t;

export default function Services(){
  const [feature, setFeature]   = useState(items[0].key);
  const [autoPlay, setAutoPlay] = useState(true);
  const resumeTimer = useRef(null);

  // track breakpoint untuk mematikan animasi di mobile
  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsMdUp(mq.matches);
    handler();
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  // progress scroll section (0..1) – dipakai untuk animasi saat md+
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isMdUp) { setProgress(1); return; } // mobile: tampil statis
    const el = sectionRef.current; if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = r.height + vh;
      const visible = clamp(vh - r.top, 0, total);
      setProgress(visible / total);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMdUp]);

  // Auto-rotate konten
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      const i = items.findIndex(i => i.key === feature);
      const next = items[(i + 1) % items.length].key;
      setFeature(next);
    }, 3500);
    return () => clearInterval(id);
  }, [feature, autoPlay]);

  const pauseAuto  = () => { setAutoPlay(false); if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  const resumeAuto = () => { clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(()=>setAutoPlay(true), 800); };

  // Animasi Phone3D saat scroll (halus, dinonaktifkan di mobile)
  const phoneStyle = isMdUp ? {
    transform: `
      translateY(${lerp(20, -8, progress)}px)
      scale(${(0.92 + 0.08 * progress).toFixed(3)})
      rotateZ(${(1 - progress) * 0.9}deg)
    `,
    opacity: 0.65 + 0.35 * progress,
    transition: "transform 120ms linear, opacity 120ms linear",
  } : undefined;

  const glowOpacity = isMdUp ? (0.22 + 0.45 * progress) : 0.38;

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full" style={{background:"var(--bmt500)"}}/>
            Layanan ActiTrack
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
            Semua yang tim lapanganmu butuhkan
          </h2>
          <p className="mt-2 text-slate-700 max-w-[60ch]">
            Presensi akurat, koordinasi tugas, pengumuman kilat, dan analitik kinerja—terintegrasi dalam satu aplikasi.
          </p>
        </Reveal>

        {/* Layout: 1 kolom (mobile), 2 kolom mulai md (tablet), sticky mulai lg */}
        <div className="
            mt-10 grid gap-8 md:gap-10
            md:grid-cols-[minmax(0,1.05fr)_minmax(220px,.95fr)]
            lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,.9fr)]
            items-start
          ">
          {/* Kiri: semua item */}
          <div className="order-2 md:order-1 grid gap-6 sm:gap-7">
            {items.map((it, idx) => (
              <Reveal key={it.key}>
                <ServiceItem
                  item={it}
                  active={feature === it.key}
                  style={ isMdUp ? {
                    transform: `translateX(${lerp(16 + idx*2, 0, progress)}px)`,
                    opacity: 0.78 + 0.22 * progress,
                    transition: "transform 120ms linear, opacity 120ms linear",
                  } : undefined }
                  onEnter={() => { setFeature(it.key); pauseAuto(); }}
                  onLeave={resumeAuto}
                />
              </Reveal>
            ))}
          </div>

          {/* Kanan: Phone3D (center di mobile, sticky di lg) */}
          <div className="order-1 md:order-2 relative md:justify-self-end lg:sticky lg:top-[88px] lg:self-start">
            {/* Glow aman (tidak bikin horizontal scroll) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                filter: "blur(48px)",
                opacity: glowOpacity,
                background: "radial-gradient(60% 50% at 60% 40%, var(--bmt500), transparent 70%)",
              }}
            />
            <Reveal>
              <div style={phoneStyle} className="mx-auto md:mx-0">
                <Phone3D feature={feature} size="xs" className="ml-auto md:ml-0" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======= Item layanan ======= */
function ServiceItem({ item, active, onEnter, onLeave, style }) {
  const col = COLOR[item.key] || { bg: "bg-bmt-500/10", text: "text-bmt-600" };
  const Icon = Icons[item.key] || Icons.adminApp;

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      aria-pressed={active}
      className="w-full text-left"
      style={style}
    >
      <div className="grid grid-cols-[42px_1fr] items-start gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${col.bg} ${col.text}`}>
          {Icon("h-5 w-5")}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-700">{item.desc}</p>
        </div>
      </div>
      <div className={`mt-3 h-[2px] rounded-full transition-all ${active ? "w-16" : "w-8"} ${col.bg.replace("/10","/40")}`} />
    </button>
  );
}
