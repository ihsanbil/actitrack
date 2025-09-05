// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { navItems } from "../config/nav";
import { PlayBadgeOfficial } from "../components/PlayBadgeOfficial";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.baranimultiteknologi.pembayaran";

const BRAND_GRAD = "linear-gradient(135deg,#5AA6FF,#7C83FF)";
const PROGRESS_GRAD = "linear-gradient(90deg,#5AA6FF,#7C83FF)";

const LOGO_SRC = "/logo/logo.png";
const LOGO_ALT = "ActiTrack";

export default function Navbar({ hideOnScroll = false, solidAtTop = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#home");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const lastY = useRef(0);
  const drawerRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const onScroll = () => {
      const doc = document.documentElement;
      const y = doc.scrollTop || window.scrollY || 0;
      setScrolled(y > 8);
      if (hideOnScroll && !reduce) {
        const dy = y - lastY.current;
        if (y > 120 && dy > 4) setHidden(true);
        else if (dy < -4) setHidden(false);
      } else setHidden(false);
      lastY.current = y;

      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      setProgress(Math.max(0, Math.min(100, pct)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = navItems.filter(n => n.href.startsWith("#")).map(n => n.href.slice(1));
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver((ents) => {
      const vis = ents.filter(e => e.isIntersecting);
      if (vis.length) {
        const top = vis.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) setActive(`#${top.target.id}`);
      }
    }, { rootMargin: "0px 0px -55% 0px", threshold: [0.25, 0.5, 0.75] });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const h = window.location.hash;
      if (navItems.some(n => n.href === h)) setActive(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const openDrawer = () => {
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() =>
      drawerRef.current?.querySelector("a,button,[tabindex]:not([tabindex='-1'])")?.focus()
    );
  };
  const closeDrawer = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
    menuBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeDrawer(); }
      else if (e.key === "Tab") {
        const f = drawerRef.current?.querySelectorAll("a,button,[tabindex]:not([tabindex='-1'])");
        if (!f?.length) return;
        const list = Array.from(f);
        const first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const headerToneSolid = solidAtTop || scrolled;
  const glass = headerToneSolid
    ? "bg-white/90 supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-slate-200 shadow-[0_8px_24px_rgba(2,6,23,.06)]"
    : "bg-transparent";
  const hiddenCls = hidden ? "-translate-y-full" : "translate-y-0";
  const linkTone = headerToneSolid ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white";

  const items = navItems.filter(n => n.href !== "#portfolio");

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2px] w-full z-[60]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        style={{
          background: `var(--progress-grad, ${PROGRESS_GRAD})`,
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left",
        }}
      />

      <header className={`sticky top-0 z-50 transition-transform duration-200 ${glass} ${hiddenCls}`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
          {/* Logo diperkecil */}
          <a href="#home" className="group flex items-center" aria-label="Beranda">
            <img
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={260}
              height={80}
              loading="eager"
              decoding="async"
              className="h-9 sm:h-10 lg:h-11 w-auto object-contain select-none [user-drag:none] transition-transform group-hover:scale-[1.01]"
              onError={(e) => {
                const box = document.createElement("div");
                box.className = "h-9 sm:h-10 lg:h-11 w-9 sm:w-10 lg:w-11 rounded-xl";
                box.style.background = `var(--brand-grad, ${BRAND_GRAD})`;
                e.currentTarget.replaceWith(box);
              }}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {items.map((n) => {
              const isActive = active === n.href;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative px-2.5 py-1.5 text-[13px] rounded-md transition-colors ${linkTone} ${
                    headerToneSolid ? "hover:bg-slate-50/80" : "hover:bg-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50`}
                >
                  <span className="relative z-[1]">{n.label}</span>
                  <span
                    className="pointer-events-none absolute left-1.5 right-1.5 bottom-1 h-[2px] rounded-full origin-left transition-transform duration-200"
                    style={{
                      background: `var(--brand-grad, ${BRAND_GRAD})`,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </a>
              );
            })}
            <PlayBadgeOfficial href={PLAY_URL} width={156} className="ml-1" />
          </nav>

          {/* Mobile toggle – warna SELALU gelap & konsisten */}
          <button
            ref={menuBtnRef}
            className="md:hidden h-10 w-10 grid place-items-center rounded-lg border border-slate-200 bg-white/90 text-slate-800 shadow-sm supports-[backdrop-filter]:backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            aria-label="Buka menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={openDrawer}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
        />
        <aside
          id="mobile-menu"
          ref={drawerRef}
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white ring-1 ring-slate-200 transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="text-sm font-semibold text-slate-900">Menu</span>
            <button
              onClick={closeDrawer}
              className="h-9 w-9 grid place-items-center rounded-lg border border-slate-200"
              aria-label="Tutup menu"
            >
              ✕
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {items.map((n, i) => {
              const isActive = active === n.href;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={closeDrawer}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? "text-indigo-700 bg-indigo-50" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {n.label}
                </a>
              );
            })}
            <div className="mt-2">
              <PlayBadgeOfficial href={PLAY_URL} width={192} />
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
