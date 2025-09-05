// src/sections/About.jsx
import Reveal from "../components/Reveal";

export default function About() {
  const benefits = [
    { t: "Implementasi cepat", d: "Go-live hitungan jam, bukan minggu." },
    { t: "Akurat & andal", d: "Validasi lokasi & jejak audit yang jelas." },
    { t: "Ramah tim lapangan", d: "UI sederhana, hemat baterai & kuota." },
    { t: "Insight yang berguna", d: "Analitik untuk keputusan harian." },
  ];

  const steps = [
    { t: "Check-in sekali sentuh", d: "Karyawan hadir via GPS + geofence, anti-spoofing." },
    { t: "Validasi otomatis", d: "Koordinat & waktu tervalidasi, log siap audit." },
    { t: "Analitik real-time", d: "Tren kehadiran, produktivitas, dan SLA harian." },
  ];

  const stats = [
    ["10+", "Proyek Implementasi"],
    ["95%+", "Akurasi Lokasi"],
    ["< 1 hari", "Waktu Setup"],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal stagger={90} distance={10} duration={520} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--bmt500)" }} />
            Tentang ActiTrack
          </div>
          <h2 id="about-title" className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
            Sederhana dipakai, kuat di balik layar
          </h2>
          <p className="mt-2 max-w-[65ch] text-slate-700">
            ActiTrack membantu perusahaan memonitor presensi & aktivitas tim secara modern:
            pengalaman bersih, performa cepat, dan data yang bisa diandalkan.
          </p>
        </Reveal>

        {/* Body */}
        <div className="mt-8 lg:mt-10 grid gap-8 lg:grid-cols-2 items-start">
          {/* Kiri: Benefit (pakai Reveal as="ul" agar LI di-stagger) */}
          <Reveal
            as="ul"
            role="list"
            className="space-y-4"
            stagger={90}
            distance={12}
            duration={520}
          >
            {benefits.map((b) => (
              <li key={b.t}>
                <article
                  className="group relative flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition
                             hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bmt-500/10 text-bmt-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <div>
                    <h3 className="font-medium text-slate-900">{b.t}</h3>
                    <p className="text-sm text-slate-700">{b.d}</p>
                  </div>

                  {/* subtle accent on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition group-hover:opacity-100"
                    style={{ background: "linear-gradient(90deg, var(--bmt500), var(--bmt600))" }}
                  />
                </article>
              </li>
            ))}
          </Reveal>

          {/* Kanan: Cara kerja + Stats */}
          <div className="space-y-6">
            {/* Stepper (stagger tiap langkah) */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-bmt-500 to-bmt-600"
              />
              <div className="relative p-5 sm:p-7">
                <div className="text-sm font-medium text-slate-900">Bagaimana ActiTrack bekerja</div>

                <Reveal
                  as="ol"
                  className="mt-5 space-y-5"
                  stagger={100}
                  distance={12}
                  duration={520}
                >
                  {steps.map((s, i) => (
                    <li key={s.t} className="relative pl-8">
                      {/* Dot + connector */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-5 w-5 rounded-full ring-2 ring-white"
                        style={{
                          background: "linear-gradient(135deg, var(--bmt500), var(--bmt600))",
                          boxShadow: "0 4px 12px rgba(2,6,23,.12)",
                        }}
                      />
                      {i < steps.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-2.5 top-5 h-[calc(100%-20px)] w-px bg-slate-200"
                        />
                      )}
                      <div className="font-medium text-slate-900">{s.t}</div>
                      <p className="text-sm text-slate-700">{s.d}</p>
                    </li>
                  ))}
                </Reveal>
              </div>
            </div>

            {/* Stats (stagger kartu) */}
            <Reveal
              as="div"
              className="grid gap-3 sm:gap-4 sm:grid-cols-3"
              stagger={80}
              distance={10}
              duration={500}
            >
              {stats.map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition hover:shadow-sm"
                >
                  <div className="text-2xl font-semibold tracking-tight text-slate-900">{v}</div>
                  <div className="text-sm text-slate-700">{l}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
