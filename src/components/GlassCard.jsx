// Card bersih + interaktif (punya beberapa variant)
export default function GlassCard({
  as = "div",          // elemen fallback (div, section, li, dsb)
  variant = "surface", // "surface" | "outline" | "soft" | "glass"
  size = "md",         // "sm" | "md" | "lg"
  interactive = true,  // efek hover angkat
  href,                // jika diisi -> render <a>
  className = "",
  children,
  ...rest
}) {
  // selalu dipakai -> tidak kena no-unused-vars
  const Component = href ? "a" : (as || "div");

  const SIZES = { sm: "p-4", md: "p-6", lg: "p-8" };
  const VAR = {
    surface: "card bg-white border",
    outline: "rounded-2xl border border-slate-200 bg-white",
    soft:    "rounded-2xl border border-bmt-500/15 bg-bmt-500/8",
    glass:   "aurora-card", // opsi look lama bila perlu
  };
  const hover = interactive ? "hover:-translate-y-0.5 hover:shadow-sm" : "";
  const cls = `${VAR[variant] || VAR.surface} ${SIZES[size] || SIZES.md} ${hover} transition ${className}`.trim();

  return (
    <Component
      className={cls}
      {...(href ? { href } : {})}
      {...rest}
    >
      {children}
    </Component>
  );
}
