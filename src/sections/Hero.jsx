// src/sections/Hero.jsx
import Reveal from "../components/Reveal";
import { PlayBadge } from "../components/StoreBadges";

const HERO_IMAGE = "/hero.jpg"; // taruh di /public/hero.jpg
const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.baranimultiteknologi.pembayaran";

export default function Hero() {
  return (
    <section id="home" className="relative hero--wrap overflow-hidden">
      {/* Background: foto + scrim + grid lembut + aurora glow */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover hero-img kenburns" /* <- aktifkan animasi */
          decoding="async"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-scrim" />
        <div className="absolute inset-0 bg-grid-soft mix-blend-overlay opacity-40" />
        {/* aurora brand */}
        <div
          aria-hidden
          className="absolute -inset-12 -z-10 blur-2xl opacity-80"
          style={{
            background:
              "radial-gradient(700px 280px at 15% 0%, var(--bmt500), transparent 70%), radial-gradient(580px 220px at 90% 10%, var(--bmt600), transparent 70%)",
          }}
        />
      </div>

      {/* Konten */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        {/* Gunakan stagger agar elemen muncul berurutan */}
        <Reveal className="max-w-[62ch]" stagger={90} distance={10} duration={520}>
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-bmt-500" />
            Android App
          </span>

          {/* Judul & tagline */}
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white [text-wrap:balance]">
            ActiTrack
          </h1>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-white/95 [text-wrap:balance]">
            Pelacakan tim lapangan yang{" "}
            <span className="bg-gradient-to-r from-bmt-500 to-bmt-600 bg-clip-text text-transparent">
              modern & akurat
            </span>
            .
          </p>

          {/* Deskripsi singkat */}
          <p className="mt-3 text-base sm:text-lg text-white/85">
            Presensi GPS, tugas, dan analitik real-time—UI bersih, pengalaman profesional.
          </p>

          {/* CTA tunggal: Download */}
          <div className="mt-6">
            <PlayBadge href={PLAY_URL} ariaLabel="Unduh ActiTrack di Google Play" />
          </div>

          {/* Trust chips */}
          <ul className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-white/90">
            <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-sm">
              ⭐ 4.8 rating
            </li>
            <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-sm">
              10k+ unduhan
            </li>
            <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-sm">
              Bebas iklan
            </li>
          </ul>
        </Reveal>

        {/* Scroll cue kecil (di-reveal terpisah biar muncul belakangan) */}
        <Reveal delay={180} distance={8} duration={480}>
          <div className="mt-10 sm:mt-12 flex items-center gap-2 text-white/80">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            <span className="text-xs">Scroll untuk lihat detail fitur</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
