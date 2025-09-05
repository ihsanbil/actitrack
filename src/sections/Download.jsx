// src/sections/Download.jsx
import Reveal from "../components/Reveal";
import { PlayBadge, PLAY_URL } from "../components/StoreBadges";

export default function Download() {
  return (
    <section id="download" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full" style={{background:"var(--bmt500)"}}/>
            Tersedia di Google Play
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
            Unduh ActiTrack & mulai presensi GPS yang akurat
          </h2>
          <p className="mt-2 text-slate-700 max-w-[65ch]">
            Multi presensi berbasis kegiatan, penugasan, dan set lokasi jarak jauh—semuanya dalam satu aplikasi.
          </p>
        </Reveal>

        {/* Kartu CTA dengan QR + badge. Full responsif dan ringan */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <ul className="grid gap-2 text-sm text-slate-700">
              <li>• Presensi/Absensi berbasis lokasi (GPS)</li>
              <li>• Multi Presensi per kegiatan / proyek</li>
              <li>• Presensi Penugasan & set lokasi jarak jauh</li>
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayBadge />
              <a
                href={PLAY_URL}
                target="_blank" rel="noreferrer"
                className="text-sm text-bmt-600 hover:underline"
              >
                Lihat di Play Store →
              </a>
            </div>

            {/* meta kecil (pakai small supaya tidak bising di mobile) */}
            <div className="mt-3 text-xs text-slate-500">
              50+ unduhan • Diperbarui 27 Aug 2025 • Kategori Business
            </div>
          </div>

          {/* QR compact (auto wrap di mobile) */}
          <div className="justify-self-start lg:justify-self-end">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <img
                className="h-28 w-28 sm:h-32 sm:w-32"
                alt="QR ke ActiTrack di Google Play"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(PLAY_URL)}`}
                width={128}
                height={128}
                loading="lazy"
              />
            </div>
            <div className="mt-2 text-center text-xs text-slate-600">Scan untuk unduh</div>
          </div>
        </div>
      </div>
    </section>
  );
}
