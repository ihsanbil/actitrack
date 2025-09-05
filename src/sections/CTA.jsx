// src/sections/CTA.jsx
import Reveal from "../components/Reveal";
import GlassCard from "../components/GlassCard";
import { PlayBadge } from "../components/StoreBadges";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.baranimultiteknologi.pembayaran";

export default function CTA() {
  const headingId = "cta-heading";

  return (
    <section
      id="cta"
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-10 sm:pb-16 sm:pt-12"
    >
      {/* 1) Reveal kartu (masuk halus dari bawah) */}
      <Reveal distance={16} duration={520} easing="cubic-bezier(.2,.8,.2,1)">
        <GlassCard
          variant="surface"
          size="lg"
          interactive
          className="relative overflow-hidden text-center px-4 py-8 sm:px-8 sm:py-10"
        >
          {/* dekor: grid super tipis + mesh brand */}
          <div className="pointer-events-none absolute -inset-1 opacity-[.045] bg-grid-soft" aria-hidden />
          <div
            className="pointer-events-none absolute -inset-24 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(600px 280px at 10% 0%, var(--bmt500), transparent), radial-gradient(600px 280px at 90% 0%, var(--bmt600), transparent)",
            }}
            aria-hidden
          />

          {/* 2) Reveal kecil untuk eyebrow/pill */}
          <Reveal delay={60} distance={10} duration={420}>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--bmt500)" }}
              />
              Mulai sekarang
            </div>
          </Reveal>

          {/* 3) Reveal ber-stagger untuk konten utama (judul, deskripsi, tombol, badges) */}
          <Reveal delay={120} stagger={90} distance={14} duration={520}>
            <h2
              id={headingId}
              className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 [text-wrap:balance] relative z-10"
            >
              Siap tingkatkan{" "}
              <span className="inline-block bg-gradient-to-r from-[var(--bmt500)] to-[var(--bmt600)] bg-clip-text text-transparent">
                produktivitas tim
              </span>
              ?
            </h2>

            <p className="mt-2 text-slate-600 max-w-[60ch] mx-auto">
              Unduh ActiTrack dan rasakan pelacakan GPS, tugas, serta analitik real-time
              dalam satu aplikasi.
            </p>

            {/* CTA: hanya Google Play */}
            <div className="mt-5 flex items-center justify-center">
              <PlayBadge
                href={PLAY_URL}
                ariaLabel="Unduh ActiTrack di Google Play"
              />
            </div>

            {/* trust badges */}
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px] text-slate-600">
              <li
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1"
                style={{ borderColor: "rgba(2,6,23,.12)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Konsultasi gratis
              </li>
              <li
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1"
                style={{ borderColor: "rgba(2,6,23,.12)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Go-live &lt; 1 hari
              </li>
              <li
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1"
                style={{ borderColor: "rgba(2,6,23,.12)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" /> Tanpa kartu kredit
              </li>
            </ul>
          </Reveal>
        </GlassCard>
      </Reveal>
    </section>
  );
}
