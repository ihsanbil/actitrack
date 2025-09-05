// Background halus brand-aware.
// variant: "subtle" (default), "aurora", "plain"
// showGrid: grid tipis agar nggak flat
export default function AuroraBg({
  variant = "subtle",
  showGrid = true,
  className = "",
}) {
  const base = `pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`;

  // style gradient per variant (brand diambil dari --bmt500/600)
  const style =
    variant === "aurora"
      ? {
          background: `
            radial-gradient(1200px 600px at 10% -10%, color-mix(in oklch, var(--bmt600) 22%, transparent), transparent 65%),
            radial-gradient(1000px 500px at 90% -20%, color-mix(in oklch, var(--bmt500) 20%, transparent), transparent 60%)
          `,
        }
      : variant === "subtle"
      ? {
          background: `
            radial-gradient(900px 400px at 10% -10%, color-mix(in oklch, var(--bmt500) 18%, transparent), transparent 70%),
            radial-gradient(900px 360px at 110% -10%, color-mix(in oklch, var(--bmt600) 16%, transparent), transparent 65%)
          `,
        }
      : {}; // "plain"

  return (
    <div aria-hidden className={base}>
      <div className="absolute inset-0" style={style} />

      {/* Orbs hanya untuk variant "aurora", disembunyikan di mobile & motion-reduce */}
      {variant === "aurora" && (
        <>
          <div className="orb top-24 left-[-8rem] hidden md:block motion-reduce:hidden" />
          <div className="orb bottom-[-10rem] right-[-6rem] delay-1000 hidden md:block motion-reduce:hidden" />
          <div className="orb top-1/2 left-1/3 delay-700 hidden md:block motion-reduce:hidden" />
        </>
      )}

      {/* Grid tipis untuk tekstur halus */}
      {showGrid && (
        <div className="absolute inset-0 bg-grid-soft mix-blend-overlay opacity-30" />
      )}
    </div>
  );
}
