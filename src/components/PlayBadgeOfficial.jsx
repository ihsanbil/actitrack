// src/components/PlayBadgeOfficial.jsx
export function PlayBadgeOfficial({
  href = "https://play.google.com/store/apps/details?id=com.baranimultiteknologi.pembayaran",
  lang = "id",                 // "id" | "en" | dst (lihat folder badge kamu)
  width = 180,                 // lebar badge (px)
  className = "",
}) {
  // Simpan badge resmi di /public/badges/google-play/
  // Unduhan: https://play.google.com/intl/<lang>/badges/
  const localSrc = `/badges/google-play/${lang}_badge_web_generic.png`;

  // Fallback jika file lokal belum ada
  const remoteSrcMap = {
    id: "https://play.google.com/intl/id/badges/static/images/badges/id_badge_web_generic.png",
    en: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
  };
  const remoteSrc = remoteSrcMap[lang] ?? remoteSrcMap.en;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={lang === "id" ? "Dapatkan di Google Play" : "Get it on Google Play"}
      className={`inline-block select-none [user-drag:none] ${className}`}
      style={{ lineHeight: 0 }}
    >
      <img
        src={localSrc}
        onError={(e) => { e.currentTarget.src = remoteSrc; }}
        alt={lang === "id" ? "Dapatkan di Google Play" : "Get it on Google Play"}
        width={width}
        height={Math.round((width / 646) * 250)} // rasio resmi 646×250
        loading="lazy"
        decoding="async"
        className="block pointer-events-none transition-transform duration-150 hover:-translate-y-0.5"
        style={{ filter: "none" }} // penting: jangan modifikasi warna badge
      />
    </a>
  );
}
