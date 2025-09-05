import React, { useEffect, useRef, forwardRef } from "react";

const MagneticButton = forwardRef(function MagneticButton(
  {
    children,
    href,              // kalau ada -> render <a>, kalau tidak -> <button>
    as,                // paksa tag tertentu (mis. "div" atau "button")
    interactive = true,
    className = "",
    onClick,
    ...rest
  },
  ref
) {
  const innerRef = useRef(null);
  // merge ref
  const setRef = (node) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const el = innerRef.current; if (!el) return;
    const canHover = typeof window !== "undefined" &&
      window.matchMedia?.("(hover:hover) and (pointer:fine)")?.matches;
    const reduce = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (!interactive || !canHover || reduce) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${(x - r.width / 2) / 8}px`);
        el.style.setProperty("--my", `${(y - r.height / 2) / 8}px`);
        el.style.setProperty("--gx", `${x}px`);
        el.style.setProperty("--gy", `${y}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);

  const Component = href ? "a" : (as || "button");

  return (
    <Component
      ref={setRef}
      href={href}
      type={!href ? "button" : undefined}
      onClick={onClick}
      className={`magnetic focus:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/60 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default MagneticButton;
