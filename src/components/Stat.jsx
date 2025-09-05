export default function Stat({
  label,
  value,
  sublabel,                 // opsional: teks kecil setelah label
  prefix = "",              // opsional: "Rp", "$", dst
  suffix = "",              // opsional: "%", "k", dst
  icon,                     // opsional: kirim React node (ikon sendiri)
  showDot = true,           // matikan kalau pakai icon kustom
  trend,                    // opsional: { value: "+12%", direction: "up"|"down"|"flat" }
  size = "md",              // "sm" | "md" | "lg"
  align = "start",          // "start" | "center" | "end"
  onDark = false,           // true jika di atas foto/hero gelap
  className = "",
}) {
  const sizeMap = {
    sm: { value: "text-lg sm:text-xl", label: "text-xs sm:text-sm", gap: "gap-2" },
    md: { value: "text-2xl sm:text-[28px]", label: "text-sm", gap: "gap-3" },
    lg: { value: "text-3xl sm:text-4xl", label: "text-base", gap: "gap-4" },
  };
  const s = sizeMap[size] || sizeMap.md;

  const alignMap = {
    start: "items-center",
    center: "items-center justify-center text-center",
    end: "items-center justify-end text-right",
  };
  const wrapAlign = alignMap[align] || alignMap.start;

  const valueColor = onDark ? "text-white" : "text-slate-900";
  const labelColor = onDark ? "text-white/70" : "text-slate-600";

  const TrendIcon = ({ dir }) => {
    const base = onDark ? "opacity-90" : "opacity-90";
    const up = onDark ? "text-emerald-300" : "text-emerald-600";
    const down = onDark ? "text-rose-300" : "text-rose-600";
    const flat = onDark ? "text-white/70" : "text-slate-500";
    const cls =
      dir === "up" ? up : dir === "down" ? down : flat;

    // inline SVG kecil (tanpa lib eksternal)
    if (dir === "up")
      return <svg className={`h-4 w-4 ${cls} ${base}`} viewBox="0 0 24 24" fill="none"><path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    if (dir === "down")
      return <svg className={`h-4 w-4 ${cls} ${base}`} viewBox="0 0 24 24" fill="none"><path d="M18 10l-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    return <svg className={`h-4 w-4 ${cls} ${base}`} viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  };

  const dot = (
    <span
      className="h-2 w-2 rounded-full"
      style={{ background: "var(--ok)" }}
      aria-hidden
    />
  );

  return (
    <div className={`flex ${s.gap} ${wrapAlign} ${className}`}>
      {icon ? <div className="shrink-0">{icon}</div> : (showDot && <div className="shrink-0">{dot}</div>)}

      <div className={align === "center" ? "text-center" : align === "end" ? "text-right" : "text-left"}>
        <div className={`flex items-center ${align === "center" ? "justify-center" : align === "end" ? "justify-end" : ""} ${s.gap}`}>
          <div className={`${s.value} font-semibold tracking-tight ${valueColor}`}>
            {prefix}{value}{suffix}
          </div>
          {trend?.value && (
            <div className="inline-flex items-center gap-1 text-xs sm:text-sm">
              <TrendIcon dir={trend.direction || "flat"} />
              <span className={onDark ? "text-white/85" : "text-slate-700"}>{trend.value}</span>
            </div>
          )}
        </div>

        <div className={`${s.label} ${labelColor}`}>
          {label}{sublabel ? <span className={onDark ? "text-white/60" : "text-slate-500"}> • {sublabel}</span> : null}
        </div>
      </div>
    </div>
  );
}
