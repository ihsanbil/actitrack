// src/components/Reveal.jsx
import { useEffect, useRef } from "react";

/**
 * Reveal – animasi masuk halus saat elemen muncul di viewport.
 *
 * Props:
 *  as, className, once, delay, stagger, distance, direction, duration,
 *  easing, threshold, rootMargin
 */
export default function Reveal({
  as = "div",
  className = "",
  once = true,
  delay = 0,
  stagger = 0,
  distance = 8,
  direction = "up",
  duration = 450,
  easing = "cubic-bezier(.2,.7,.2,1)",
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const armed = useRef(false);     // hindari init ganda (StrictMode/dev)
  const cleanup = useRef({ timers: [], rafs: [] });
  const Component = as || "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Hitung arah & offset awal (dibatasi agar tidak memicu scroll horizontal)
    const axis = direction === "left" || direction === "right" ? "X" : "Y";
    const sign = direction === "down" || direction === "right" ? 1 : -1;
    const offset = Math.min(24, Math.abs(distance)) * sign;

    const addTimer = (id) => cleanup.current.timers.push(id);
    const addRaf = (id) => cleanup.current.rafs.push(id);
    const clearAll = () => {
      cleanup.current.timers.forEach((t) => window.clearTimeout(t));
      cleanup.current.rafs.forEach((r) => cancelAnimationFrame(r));
      cleanup.current = { timers: [], rafs: [] };
    };

    const setBaseTransition = (node, extraDelay = 0) => {
      node.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      node.style.transitionDelay = `${extraDelay}ms`;
      node.style.willChange = "opacity, transform";
    };

    const init = () => {
      if (reduce) return;
      setBaseTransition(el, delay);
      el.style.opacity = "0.001";
      el.style.transform = `translate${axis}(${offset}px)`;
      el.classList.add("reveal");

      if (stagger > 0) {
        const kids = Array.from(el.children);
        kids.forEach((child, i) => {
          setBaseTransition(child, delay + i * stagger);
          child.style.opacity = "0.001";
          child.style.transform = `translate${axis}(${offset}px)`;
        });
      }
    };

    const reveal = () => {
      if (reduce) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.classList.add("revealed");
        return;
      }

      // anak dulu (kalau ada stagger)
      if (stagger > 0) {
        const kids = Array.from(el.children);
        const r = requestAnimationFrame(() => {
          kids.forEach((child) => {
            child.style.opacity = "1";
            child.style.transform = "none";
          });
        });
        addRaf(r);
      }

      // container
      const t = window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.classList.add("revealed");

        // lepas will-change setelah animasi selesai agar hemat performa
        const release = window.setTimeout(() => {
          el.style.willChange = "auto";
          Array.from(el.children).forEach((c) => (c.style.willChange = "auto"));
        }, duration + 30);
        addTimer(release);
      }, delay);
      addTimer(t);
    };

    const reset = () => {
      if (reduce) return;
      el.classList.remove("revealed");
      init();
    };

    // Jika reduce: langsung tampil & selesai
    if (reduce) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.classList.add("revealed");
      return;
    }

    // Hindari init ganda pada StrictMode (effect run 2x di dev)
    if (armed.current) return;
    armed.current = true;

    init();

    // Observer (dengan fallback)
    let io;
    const observe = () => {
      if (!("IntersectionObserver" in window)) {
        // Fallback: kalau tidak didukung, langsung reveal
        reveal();
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              if (once) io.unobserve(entry.target);
            } else if (!once) {
              reset();
            }
          });
        },
        { threshold, rootMargin }
      );
      io.observe(el);

      // Trigger cepat kalau elemen sudah terlihat saat mount (beberapa browser nunda callback IO)
      const kick = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const vw = window.innerWidth || document.documentElement.clientWidth;
        const inView =
          r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
        if (inView && !el.classList.contains("revealed")) reveal();
      }, 0);
      addTimer(kick);
    };

    // Pastikan style awal sudah terpasang sebelum mulai observe
    const arm = window.setTimeout(observe, 0);
    addTimer(arm);

    return () => {
      clearAll();
      io?.disconnect?.();
      // biar bisa re-mount bersih:
      armed.current = false;
    };
  }, [
    once,
    delay,
    stagger,
    distance,
    direction,
    duration,
    easing,
    threshold,
    rootMargin,
  ]);

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
}
