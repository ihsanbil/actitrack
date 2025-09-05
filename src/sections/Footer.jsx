// src/components/Footer.jsx
import { navItems } from "../config/nav";

const LOGO_SRC = "/logo/logo.png";
const LOGO_ALT = "Barani Multi Teknologi";

const socials = [
  {
    href: "https://wa.me/6281386157156",
    label: "WhatsApp",
    icon: (cls = "h-5 w-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22a9.9 9.9 0 01-4.2-.9L4 22l.9-3.7A9.9 9.9 0 1112 22z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8.7 9.6c0 3 3.7 5.8 5.7 5.8.6 0 1.5-.4 1.8-.9l.3-.6c.1-.3-.1-.6-.4-.8l-1.2-.5c-.3-.1-.6 0-.8.2l-.5.5c-.2.2-.5.2-.8.1-1.1-.5-2.3-1.6-2.8-2.7-.1-.3-.1-.6.1-.8l.4-.5c.2-.3.3-.6.2-.9l-.4-1.2c-.1-.3-.4-.5-.8-.4l-.6.2c-.5.3-.8 1.2-.8 1.5z" fill="currentColor"/>
      </svg>
    )
  },
  {
    href: "mailto:barateknologi@gmail.com",
    label: "Email",
    icon: (cls = "h-5 w-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.6" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: (cls = "h-5 w-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7.5 10.5V16.5M7.5 7.5v.01M12 16.5v-3.6c0-1.3.9-2.4 2.4-2.4 1.5 0 2.1 1.1 2.1 2.4v3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  // hanya anchor internal (#...) biar konsisten
  const footerNav = navItems.filter(n => n.href?.startsWith("#"));

  return (
    <footer id="contact" className="bg-white">
      {/* aksen brand di atas */}
      <div aria-hidden className="h-[2px] bg-gradient-to-r from-bmt-500 to-bmt-600" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <a href="#home" className="group inline-flex items-center gap-3" aria-label="Kembali ke beranda">
              {/* logo jika ada; fallback ke blok gradien */}
              <img
                src={LOGO_SRC}
                alt={LOGO_ALT}
                width={120}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-9 w-auto object-contain select-none [user-drag:none]"
                onError={(e) => {
                  const box = document.createElement("div");
                  box.className = "grid place-items-center h-9 w-9 rounded-xl text-white font-bold";
                  box.style.background = "linear-gradient(135deg, var(--bmt500), var(--bmt600))";
                  box.textContent = "B";
                  e.currentTarget.replaceWith(box);
                }}
              />
              {/* <span className="text-sm uppercase tracking-wider text-slate-600">
                Barani Multi Teknologi
              </span> */}
            </a>
          </div>

          <p className="text-sm text-slate-600 max-w-sm mx-auto md:mx-0">
            Solusi tracking & analitik untuk tim modern. Berbasis di Bekasi.
          </p>

          {/* sosial */}
          <div className="mt-4 flex items-center justify-center md:justify-start gap-3 text-slate-600">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/40"
              >
                {s.icon("h-5 w-5")}
              </a>
            ))}
          </div>
        </div>

        {/* Navigasi (desktop/tablet) */}
        <nav className="hidden md:block" aria-label="Navigasi footer">
          <div className="text-sm font-medium mb-3 text-slate-900">Navigasi</div>
          <ul className="space-y-2 text-sm text-slate-700">
            {footerNav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative inline-block hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded"
                >
                  <span>{n.label}</span>
                  <span className="mt-0.5 block h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform bg-bmt-500" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kontak (desktop/tablet) */}
        <div className="hidden md:block">
          <div className="text-sm font-medium mb-3 text-slate-900">Kontak</div>
          <address className="not-italic">
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Harapan Indah, Bekasi — Jawa Barat</li>
              <li>
                <a href="tel:+6281386157156" className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded">
                  +62 813-8615-7156
                </a>
              </li>
              <li>
                <a href="mailto:barateknologi@gmail.com" className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded">
                  barateknologi@gmail.com
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Mobile accordions (hanya hp) */}
        <div className="md:hidden space-y-4">
          <details className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
            <summary className="list-none cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-900 flex items-center justify-between">
              Navigasi
              <svg className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </summary>
            <ul className="px-4 pb-4 space-y-2 text-sm text-slate-700">
              {footerNav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="group relative inline-block hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded"
                  >
                    <span>{n.label}</span>
                    <span className="mt-0.5 block h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform bg-bmt-500" />
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <details className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
            <summary className="list-none cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-900 flex items-center justify-between">
              Kontak
              <svg className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </summary>
            <address className="not-italic px-4 pb-4">
              <ul className="space-y-2 text-sm text-slate-700 text-left">
                <li>Harapan Indah, Bekasi — Jawa Barat</li>
                <li>
                  <a href="tel:+6281386157156" className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded">
                    +62 813-8615-7156
                  </a>
                </li>
                <li>
                  <a href="mailto:barateknologi@gmail.com" className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/30 rounded">
                    barateknologi@gmail.com
                  </a>
                </li>
              </ul>
            </address>
          </details>
        </div>
      </div>

      {/* bawah */}
      <div className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-500">
        © {year} Barani Multi Teknologi. All rights reserved.
      </div>
    </footer>
  );
}
