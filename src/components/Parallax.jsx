// src/components/Parallax.jsx
import { useEffect, useRef } from "react";

/**
 * Parallax – transform berdasarkan progress scroll (0..1) elemen di viewport.
 * Props (array [from,to]): translateY, translateX, scale, rotateZ, opacity
 * Contoh:
 *  <Parallax translateY={[24,-12]} scale={[0.94,1]} rotateZ={[1.2,0]} opacity={[0.6,1]}>
 *    <YourThing/>
 *  </Parallax>
 */
export default function Parallax({
  as = "div",
  className = "",
  translateY = [0, 0],
  translateX = [0, 0],
  scale = [1, 1],
  rotateZ = [0, 0],
  opacity = [1, 1],
  children,
  ...rest
}) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const state = useRef({ p: 0 }); // progress smoothed

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return; // no-op

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const total = r.height + vh;     // dari mulai masuk hingga keluar
        const visible = clamp(vh - r.top, 0, total);
        const target = visible / total;

        // smoothing ringan biar fluid (easing ~ spring sederhana)
        const cur = state.current.p;
        const next = cur + (target - cur) * 0.12; // 0.12 = damping
        state.current.p = next;

        const ty = lerp(translateY[0], translateY[1], next);
        const tx = lerp(translateX[0], translateX[1], next);
        const sc = lerp(scale[0],      scale[1],      next);
        const rz = lerp(rotateZ[0],    rotateZ[1],    next);
        const op = lerp(opacity[0],    opacity[1],    next);

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc}) rotateZ(${rz}deg)`;
        el.style.opacity = `${op}`;
        el.style.willChange = "transform, opacity";
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [translateY, translateX, scale, rotateZ, opacity]);

  const Comp = as || "div";
  return (
    <Comp ref={ref} className={className} {...rest}>
      {children}
    </Comp>
  );
}
