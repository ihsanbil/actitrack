// Interaktif Google Play badge dengan efek "shine" yang efisien & responsif
import { useEffect, useRef } from "react";

const DEFAULT_PLAY =
  "https://play.google.com/store/apps/details?id=com.baranimultiteknologi.pembayaran";

export function PlayBadge({
  href = DEFAULT_PLAY,
  ariaLabel = "Unduh di Google Play",
  className = "",
  size = "md", // 'sm' | 'md' | 'lg'
}) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const canShineRef = useRef(true);

  // Tentukan apakah efek shine diaktifkan (hover+pointer fine & bukan reduced motion)
  useEffect(() => {
    const canHover = matchMedia?.("(hover:hover) and (pointer:fine)")?.matches;
    const reduce = matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    canShineRef.current = Boolean(canHover && !reduce);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMove = (e) => {
    if (!canShineRef.current) return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - r.left}px`);
      el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    });
  };

  const onLeave = () => {
    if (!canShineRef.current) return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--gx", `50%`);
    el.style.setProperty("--gy", `50%`);
  };

  const SIZE = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base",
  }[size];

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={[
        "group relative inline-flex items-center gap-3 rounded-full font-medium",
        "text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10",
        "active:translate-y-[1px] transition-transform",
        SIZE,
        className,
      ].join(" ")}
      style={{
        background: "var(--brand-grad)", // dari tokens.css
        boxShadow: "0 16px 40px rgba(2,6,23,.18)",
      }}
    >
      {/* Ikon Play */}
      <span className="grid place-items-center h-6 w-6 rounded-md bg-black/15">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3l14 9-14 9V3z" fill="currentColor" className="text-white" />
        </svg>
      </span>

      <span className="font-medium tracking-tight">
        <span className="opacity-90">Download di</span>{" "}
        <strong>Google Play</strong>
      </span>

      {/* Shine (auto-mati di touch / reduced motion) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px 120px at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.22), transparent 60%)",
        }}
      />
    </a>
  );
}
