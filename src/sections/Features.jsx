import Reveal from "../components/Reveal";
import GlassCard from "../components/GlassCard";

const list = [
  ["Presensi GPS Real-time","Check-in/out geofence valid."],
  ["Presensi Berbasis Tugas","Validasi per-lokasi/proyek."],
  ["Pengumuman & Komunikasi","Broadcast ke app karyawan."],
  ["Manajemen Data Karyawan","Profil, jadwal, role, presensi."],
  ["Laporan & Analitik","Insight siap aksi."],
  ["Skala & Keamanan","RBAC, audit trail."],
];

export default function Features(){
  return (
    <section id="features" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <Reveal>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold">Fitur Utama</h2>
            <p className="text-white/70 mt-2 max-w-prose">Monitoring modern dari presensi hingga laporan.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(([t,d],i)=>(
            <Reveal key={i}>
              <GlassCard className="p-6 group hover:shadow-[0_30px_80px_rgba(2,6,23,.55)] transition-all">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">★</div>
                <h3 className="text-lg font-medium mb-1">{t}</h3>
                <p className="text-sm text-white/70">{d}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
