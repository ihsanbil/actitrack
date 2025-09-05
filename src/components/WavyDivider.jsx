import { useId } from "react";

/**
 * WavyDivider
 * Props:
 * - variant: "wave" | "soft" | "slope" (default: "wave")
 * - mode: "fill" | "cutout" (default: "fill")
 * - flip: boolean (default: false)
 * - height: number (px, default: 48)
 * - fill: "brand" | "muted" | string (CSS color)  (default: "brand")
 * - background: string (CSS color) untuk mode "cutout" (default: "#fff")
 * - className: string
 */
export default function WavyDivider({
  variant = "wave",
  mode = "fill",
  flip = false,
  height = 48,
  fill = "brand",
  background = "#fff",
  className = "",
}) {
  const id = useId(); // unique gradient id

  const d = variant === "soft"
    ? "M0,72 C240,32 480,32 720,72 C960,112 1200,112 1440,72 L1440,96 L0,96 Z"
    : variant === "slope"
    ? "M0,96 L0,64 C360,24 1080,104 1440,64 L1440,96 Z"
    : /* wave (default) */ "M0,64 C240,16 480,16 720,64 C960,112 1200,112 1440,64 L1440,96 L0,96 Z";

  const gradientId = `wavy-${id.replace(/[:]/g, "")}`;

  // tentukan warna fill
  const fillProps =
    fill === "brand"
      ? { fill: `url(#${gradientId})` }
      : fill === "muted"
      ? { fill: "currentColor" } // warna ikut className .text-*
      : { fill: fill };          // custom CSS color

  // untuk mode cutout, path-nya diisi background next section (motong gelombang)
  const cutoutProps = mode === "cutout" ? { fill: background } : fillProps;

  // transform flip
  const transformCls = flip ? "rotate-180" : "";

  return (
    <div
      aria-hidden
      className={`relative -mt-px ${transformCls} ${className}`}
      style={{ height }}
    >
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-full"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
      >
        {/* Gradient brand */}
        {fill === "brand" && mode === "fill" && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"  stopColor="var(--bmt500)" />
              <stop offset="100%" stopColor="var(--bmt600)" />
            </linearGradient>
          </defs>
        )}

        <path d={d} {...cutoutProps} />
      </svg>
    </div>
  );
}
