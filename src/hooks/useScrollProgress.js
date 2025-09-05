import { useEffect, useState } from "react";

export default function useScrollProgress(){
  const [p, setP] = useState(0);
  useEffect(()=>{
    const onScroll = ()=>{
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setP(Math.min(100, Math.max(0, (scrolled/height)*100)));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive:true });
    return ()=> removeEventListener("scroll", onScroll);
  },[]);
  return p;
}
