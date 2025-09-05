// src/sections/Blog.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

/* ========== Fallback data lokal (kalau Sanity belum ada) ========== */
const LOCAL_POSTS = [
  { id: 1, cat: "produk",    title: "Rilis ActiTrack 1.4",                  excerpt: "Mode offline makin stabil, plus peningkatan akurasi geofence.", date: "2025-08-02T00:00:00.000Z", read: "3 min", slug: "rilis-actitrack-1-4", isExternal: false },
  { id: 2, cat: "tips",      title: "5 Langkah Tingkatkan Kehadiran",       excerpt: "Checklist cepat untuk supervisor lapangan.",                    date: "2025-08-01T00:00:00.000Z", read: "5 min", slug: "5-langkah-tingkatkan-kehadiran", isExternal: false },
  { id: 3, cat: "analitik",  title: "Metrik yang Benar untuk Tim Lapangan", excerpt: "Jangan terjebak vanity metric—fokus ke outcome.",               date: "2025-07-20T00:00:00.000Z", read: "4 min", slug: "metrik-yang-benar-untuk-tim-lapangan", isExternal: false },
];

const LABEL = {
  produk: "Produk",
  tips: "Tips",
  analitik: "Analitik",
  security: "Keamanan",
  ops: "Operasional",
  integrasi: "Integrasi",
  teknologi: "Teknologi",
  berita: "Berita",
};

/* ========= util ========= */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const slugToHref = (slug) => (slug ? `/blog/${slug}` : null);

// fallback slug dari judul
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** hitung estimasi waktu baca sederhana */
const estimateRead = (text) => {
  const words = Math.max(1, String(text || "").trim().split(/\s+/).length);
  const mins  = Math.max(1, Math.round(words / 180));
  return `${mins} min`;
};

export default function Blog() {
  /* ---------- state ---------- */
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const [posts, setPosts]     = useState([]);

  const [active, setActive] = useState("all");
  const [query, setQuery]   = useState("");
  const [sort, setSort]     = useState("new"); // new|old|az
  const [page, setPage]     = useState(1);
  const PAGE_SIZE = 6;

  const tabsRef = useRef(null);

  /* ---------- fetch (Sanity: union post + externalPost) ---------- */
  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      try {
        setLoading(true);
        setErr("");

        const mod = await import("../lib/sanity").catch(() => null);
        if (mod?.sanity) {
          const QUERY = `
          {
            "internal": *[_type=="post"] | order(publishedAt desc)[0...80]{
              _id, "kind":"internal", title, slug, publishedAt, excerpt, mainImage,
              "categories": categories[]->title,
              author->{name},
              // body tidak di-list agar ringan; detail diambil di halaman /blog/:slug
            },
            "external": *[_type=="externalPost"] | order(publishedAt desc)[0...200]{
              _id, "kind":"external", title, slug, publishedAt, excerpt, imageUrl, url,
              sourceName, categories
            }
          }`;

          const data = await mod.sanity.fetch(QUERY);

          // gabungkan & sort desc by date
          const all = [...(data?.internal || []), ...(data?.external || [])]
            .filter(Boolean)
            .sort((a, b) => +new Date(b.publishedAt || 0) - +new Date(a.publishedAt || 0));

          const mapped = all.map((p) => {
            const isExternal = p.kind === "external";
            // kategori: ambil string pertama (internal: array of titles, external: array of strings)
            const catTitle = Array.isArray(p.categories) && p.categories.length > 0
              ? String(p.categories[0]).toLowerCase()
              : "lainnya";
            const catSlug = catTitle
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

            // gambar
            const img = isExternal
              ? (p.imageUrl || null)
              : mod.urlFor?.(p.mainImage)?.width(720).height(405).fit("crop").url();

            // read time approx
            const read = estimateRead(p.excerpt || p.title);

            return {
              id: p._id || slugify(p.title),
              cat: catSlug,
              title: p.title || "(Tanpa judul)",
              excerpt: p.excerpt || "",
              date: p.publishedAt || new Date().toISOString(),
              read,
              img,
              slug: p.slug?.current || slugify(p.title),
              isExternal,
              sourceName: isExternal ? (p.sourceName || "External") : null,
              // untuk external, detail page /blog/:slug akan redirect ke p.url (sudah kamu handle di BlogPost.jsx)
            };
          });

          if (!cancelled) setPosts(mapped);
        } else {
          // fallback lokal + slug
          if (!cancelled) setPosts(LOCAL_POSTS);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.message || "Gagal memuat data");
          setPosts(LOCAL_POSTS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    go();
    return () => { cancelled = true; };
  }, []);

  /* ---------- kategori dinamis ---------- */
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p?.cat).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [posts]);

  /* ---------- filter + cari + sort ---------- */
  const filtered = useMemo(() => {
    let arr = posts.filter(Boolean);

    if (active !== "all") {
      arr = arr.filter((p) => p.cat === active);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          (p.sourceName && p.sourceName.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "old":
        arr = [...arr].sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "az":
        arr = [...arr].sort((a, b) => a.title.localeCompare(b.title, "id"));
        break;
      default: // "new"
        arr = [...arr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }

    return arr;
  }, [posts, active, query, sort]);

  /* ---------- pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe   = Math.min(page, totalPages);
  const visible    = filtered.slice(0, pageSafe * PAGE_SIZE);

  /* ---------- a11y: keyboard nav untuk tabs ---------- */
  const onTabsKeyDown = (e) => {
    if (!tabsRef.current) return;
    const items = Array.from(tabsRef.current.querySelectorAll("[role='tab']"));
    if (!items.length) return;

    const idx = items.findIndex((el) => el === document.activeElement);
    if (idx < 0) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    }
  };

  /* ---------- efek shine (desktop) ---------- */
  const onCardMove = (e) => {
    const el = e.currentTarget;
    const r  = el.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
  };

  return (
    <section id="blog" className="py-14 sm:py-20 bg-white overflow-x-clip">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal stagger={60}>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--bmt500)" }} />
            Blog
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
            Insight & update seputar produktivitas tim
          </h2>
          <p className="mt-2 text-slate-700 max-w-[65ch]">
            Rangkuman rilis produk, praktik terbaik, dan kurasi berita teknologi pihak ketiga.
          </p>
        </Reveal>

        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] items-center">
          {/* Tabs */}
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Filter kategori blog"
            onKeyDown={onTabsKeyDown}
            className="
              w-full flex gap-2 overflow-x-auto no-scrollbar
              [-ms-overflow-style:none] [scrollbar-width:none]
              [touch-action:pan-x_pinch-zoom] [scrollbar-gutter:stable]
              -mx-3 px-3 sm:mx-0 sm:px-0
            "
          >
            {categories.map((c) => {
              const selected = active === c;
              const label = c === "all" ? "Semua" : (LABEL[c] || c);
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`shrink-0 min-w-[max-content] whitespace-nowrap inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition
                    ${selected ? "border-bmt-500/40 bg-bmt-500/10 text-bmt-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}
                  `}
                  onClick={() => { setActive(c); setPage(1); }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* search + sort */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
            <label className="col-span-2 md:col-span-1 relative">
              <span className="sr-only">Cari artikel</span>
              <input
                type="search"
                placeholder="Cari artikel…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bmt-500/40"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hidden sm:inline">⌘K</span>
            </label>

            <label className="justify-self-start md:justify-self-end">
              <span className="sr-only">Urutkan</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bmt-500/40"
              >
                <option value="new">Terbaru</option>
                <option value="old">Terlama</option>
                <option value="az">Judul A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="mt-4 rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 border border-rose-100">
            {err}
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid items-stretch gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 6 }) : visible).map((p, i) => (
            <Reveal key={loading ? `sk-${i}` : (p?.id || i)} delay={i * 60} distance={14}>
              {loading ? (
                <SkeletonCard />
              ) : (
                (() => {
                  if (!p) return null;
                  const to = slugToHref(p.slug || slugify(p.title));
                  const CardInner = (
                    <>
                      {/* Preview */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {p.img ? (
                          <img
                            src={p.img}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] select-none [user-drag:none]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]"
                            style={{
                              background:
                                "radial-gradient(900px 520px at 10% -10%, color-mix(in oklab, var(--bmt500) 18%, white), transparent), radial-gradient(900px 520px at 90% -20%, color-mix(in oklab, var(--bmt600) 18%, white), transparent), linear-gradient(180deg, rgba(2,6,23,.06), rgba(2,6,23,.08))",
                            }}
                          />
                        )}

                        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[12px] text-slate-700 ring-1 ring-slate-200 backdrop-blur">
                          {LABEL[p.cat] || p.cat}
                        </span>

                        {p.isExternal && (
                          <span className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] text-slate-700 ring-1 ring-slate-200 backdrop-blur">
                            {p.sourceName || "External"}
                          </span>
                        )}

                        {/* shine */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background:
                              "radial-gradient(320px 160px at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.18), transparent 60%)",
                          }}
                        />
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{p.title}</h3>
                        {p.excerpt && (
                          <p className="mt-1 text-sm text-slate-700 min-h-[56px] line-clamp-3">
                            {p.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-600">
                          <span>{fmtDate(p.date)} • {p.read}</span>
                          <span className="inline-flex items-center gap-1 text-bmt-600">
                            {p.isExternal ? "Baca (sumber)" : "Baca"}{" "}
                            <span className="translate-x-0 transition group-hover:translate-x-0.5">→</span>
                          </span>
                        </div>
                      </div>
                    </>
                  );

                  return to ? (
                    <Link
                      to={to}
                      onMouseMove={(e) => {
                        // efek shine hanya di pointer device
                        if (window.matchMedia?.("(pointer: fine)")?.matches) onCardMove(e);
                      }}
                      className="group relative flex h-full flex-col rounded-2xl sm:rounded-3xl ring-1 ring-slate-200/70 bg-white overflow-hidden transition
                                 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-bmt-500/50"
                      aria-label={`Buka artikel: ${p.title}`}
                    >
                      {CardInner}
                    </Link>
                  ) : (
                    <div
                      onMouseMove={(e) => {
                        if (window.matchMedia?.("(pointer: fine)")?.matches) onCardMove(e);
                      }}
                      className="group relative flex h-full flex-col rounded-2xl sm:rounded-3xl ring-1 ring-slate-200/70 bg-white overflow-hidden"
                      role="article"
                      aria-label={p.title}
                      title="Slug tidak tersedia"
                    >
                      {CardInner}
                    </div>
                  );
                })()
              )}
            </Reveal>
          ))}
        </div>

        {/* Pagination */}
        {!loading && visible.length < filtered.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2.5 text-sm rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            >
              Muat lebih banyak
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            Tidak ada artikel yang cocok dengan filter/pencarian kamu.
          </div>
        )}
      </div>
    </section>
  );
}

/* ========= Skeleton ========= */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl sm:rounded-3xl ring-1 ring-slate-200/70 bg-white overflow-hidden">
      <div className="aspect-[16/9] bg-slate-100" />
      <div className="p-4 sm:p-5 space-y-2">
        <div className="h-3 w-24 bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-5/6 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
