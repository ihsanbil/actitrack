// src/components/Phone3D.jsx
import { useEffect, useRef } from "react";

/**
 * Phone3D – mockup iPhone-style (tanpa garis putih/bleeding).
 * Taruh screenshot di /public/screens (1.png..6.png) atau override via prop `screenshots`.
 *
 * Props:
 * - feature       : "regular" | "assignment" | "upload" | "adminDash" | "empDash" | "adminApp"
 *                   (alias lama: gps->regular, tasks->assignment, announce->upload,
 *                    analytics->adminDash, people->empDash, security->adminApp)
 * - size          : "xs" | "sm" | "md" | "lg" (default "md")
 * - className     : string tambahan
 * - screenshots   : { [key]: "/path.png" } untuk override
 * - showStatusBar : boolean, tampilkan status bar overlay di atas screenshot
 */
export default function Phone3D({
  feature = "regular",
  size = "md",
  className = "",
  screenshots,
  showStatusBar = false,
}) {
  const ref = useRef(null);

  // alias kompatibel
  const KEY =
    (
      {
        gps: "regular",
        tasks: "assignment",
        announce: "upload",
        analytics: "adminDash",
        people: "empDash",
        security: "adminApp",
      }[feature] || feature
    ) ?? "regular";

  // lebar device (tinggi ikut aspect ratio)
  const WIDTH =
    {
      xs: "w-[clamp(240px,26vw,310px)]",
      sm: "w-[clamp(270px,30vw,350px)]",
      md: "w-[clamp(310px,34vw,390px)]",
      lg: "w-[clamp(350px,38vw,430px)]",
    }[size] || "w-[clamp(310px,34vw,390px)]";

  // min-height konten jika screenshot belum termuat
  const MINH =
    {
      xs: "min-h-[300px] sm:min-h-[340px]",
      sm: "min-h-[320px] sm:min-h-[360px]",
      md: "min-h-[380px] sm:min-h-[420px]",
      lg: "min-h-[420px] sm:min-h-[460px]",
    }[size] || "min-h-[380px] sm:min-h-[420px]";

  // default lokasi screenshot 1..6
  const DEFAULT_SHOTS = {
    regular: "/screens/1.png",
    assignment: "/screens/2.png",
    upload: "/screens/3.png",
    adminDash: "/screens/4.png",
    empDash: "/screens/5.png",
    adminApp: "/screens/6.png",
  };
  const screenSrc = (screenshots && screenshots[KEY]) || DEFAULT_SHOTS[KEY];

  // 3D tilt halus (hormati prefers-reduced-motion)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover:hover) and (pointer:fine)")?.matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!canHover || reduce) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -8;
        const ry = ((x / r.width) - 0.5) * 10;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--tx", `${(x - r.width / 2) / 20}px`);
        el.style.setProperty("--ty", `${(y - r.height / 2) / 20}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // HAPUS overflow-hidden agar shadow & radius tidak terpotong
    <div className={`relative isolate shrink-0 ${WIDTH} aspect-[9/19.5] ${className}`}>
      <div
        ref={ref}
        className="h-full [transform-style:preserve-3d] transition-transform duration-200"
        style={{
          transform:
            "perspective(1200px) rotateX(var(--rx,0)) rotateY(var(--ry,0)) translateX(var(--tx,0)) translateY(var(--ty,0))",
        }}
        aria-label="Pratinjau aplikasi di ponsel"
      >
        {/* body metalik tipis */}
        <div className="relative h-full rounded-[2.8rem] bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[0_24px_70px_rgba(2,6,23,.28)] p-[6px]">
          {/* tombol samping (dekoratif) */}
          <div aria-hidden className="absolute -left-[3px] top-[22%] h-10 w-[3px] rounded-r bg-neutral-700" />
          <div aria-hidden className="absolute -left-[3px] top-[36%] h-8  w-[3px] rounded-r bg-neutral-700" />
          <div aria-hidden className="absolute -right-[3px] top-[30%] h-[74px] w-[3px] rounded-l bg-neutral-700" />

          {/* bezel hitam */}
          <div className="relative h-full rounded-[2.2rem] bg-black p-2">
            {/* layar */}
            <div className="relative h-full rounded-[1.75rem] overflow-hidden bg-black text-white">
              {/* notch */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-7 w-[44%] bg-black rounded-b-2xl"
              >
                <span className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-white/20" />
                <span className="absolute top-1.5 right-3 h-2 w-2 rounded-full bg-white/25" />
              </div>

              {showStatusBar && (
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-3 pb-2 text-[11px] sm:text-xs text-white/70 bg-gradient-to-b from-black/40 to-transparent">
                  <span>6:50 PM</span>
                  <span className="text-white/50">ActiTrack</span>
                  <span>5G ▴</span>
                </div>
              )}

              {/* screenshot – object-contain agar tidak nge-zoom */}
              <div className={`relative h-full ${MINH}`}>
                {screenSrc ? (
                  <img
                    src={screenSrc}
                    alt={`${KEY} screenshot`}
                    className="h-full w-full object-contain bg-black select-none [user-drag:none]"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/70">
                    (screenshot tidak ditemukan)
                  </div>
                )}
              </div>

              {/* home indicator */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-24 rounded-full bg-white/70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
