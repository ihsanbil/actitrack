import { useEffect, useRef } from "react";

export default function useParallax(enabled = true){
  const ref = useRef(null);
  useEffect(()=>{
    if (!enabled) return;
    const el = ref.current; if (!el) return;
    const ok = matchMedia("(hover:hover) and (pointer:fine)").matches && innerWidth >= 1024;
    if (!ok) return;
    const onMove = (e)=>{
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width/2)) / r.width;
      const y = (e.clientY - (r.top + r.height/2)) / r.height;
      el.style.setProperty("--rx", `${y * -6}deg`);
      el.style.setProperty("--ry", `${x * 10}deg`);
      el.style.setProperty("--tx", `${x * 6}px`);
      el.style.setProperty("--ty", `${y * 6}px`);
    };
    addEventListener("mousemove", onMove);
    return ()=> removeEventListener("mousemove", onMove);
  },[enabled]);
  return ref;
}
