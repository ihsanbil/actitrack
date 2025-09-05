import Reveal from "../components/Reveal";
import GlassCard from "../components/GlassCard";

export default function Analytics(){
  return (
    <section id="analytics" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 lg:pb-20 pt-12 sm:pt-16 lg:pt-20">
        <Reveal>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold">Analitik Kinerja</h2>
            <p className="text-white/70 mt-2 max-w-prose">Ubah data aktivitas menjadi keputusan.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {["Kehadiran","Efektivitas Waktu","Kepatuhan Tugas"].map((t,idx)=>(
            <Reveal key={idx}>
              <GlassCard className="p-6 transition-transform hover:-translate-y-1">
                <div className="mb-3 text-sm text-white/60">Insight</div>
                <div className="text-lg sm:text-xl font-semibold mb-2">{t}</div>
                <div className="h-24 sm:h-28 rounded-xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-white/60 text-sm">chart • • •</div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-bmt-500"/> Tren 4 minggu terakhir</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-bmt-600"/> Segmentasi per divisi</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{background:"var(--ok)"}}/> Anomali terdeteksi</li>
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
