// src/routes/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <main className="min-h-[60vh] grid place-items-center bg-white">
      <div className="text-center">
        <div className="text-3xl font-semibold text-slate-900">404</div>
        <p className="mt-2 text-slate-600">Halaman tidak ditemukan.</p>
        <Link to="/" className="mt-4 inline-block text-bmt-600 underline">Kembali ke beranda</Link>
      </div>
    </main>
  );
}
