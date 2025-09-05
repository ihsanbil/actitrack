// src/routes/BlogPost.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

export default function BlogPost() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [PortableTextCmp, setPortableTextCmp] = useState(null);
  const [ptComponents, setPtComponents] = useState(basePortableTextComponents);

  // format tanggal
  const fmtDate = useMemo(
    () => (iso) =>
      iso
        ? new Date(iso).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        // 1) dynamic import sanity
        const mod = await import("../lib/sanity").catch(() => null);
        if (!mod?.sanity) {
          throw new Error(
            "Sanity belum dikonfigurasi. Pastikan file src/lib/sanity.js ada dan ENV sudah diisi."
          );
        }

        // helper bikin URL gambar aman
        const makeUrl = (src) =>
          mod?.urlFor?.(src)?.width(1200).fit("max").url() || "";

        // 2) fetch artikel lokal (post biasa)
        const data = await mod.sanity.fetch(
          `*[_type=="post" && slug.current==$slug][0]{
            _id, title, slug, publishedAt, excerpt, mainImage,
            "categories": categories[]->title,
            author->{name},
            body
          }`,
          { slug }
        );

        // 3) kalau tidak ketemu, cek externalPost dan redirect
        if (!data) {
          const ext = await mod.sanity.fetch(
            `*[_type=="externalPost" && slug.current==$slug][0]{ title, url }`,
            { slug }
          );

          if (ext?.url) {
            // redirect ke sumber (same-tab)
            window.location.replace(ext.url);
            return; // hentikan eksekusi setelah redirect
          }

          setErr("Artikel tidak ditemukan.");
          setPost(null);
          return;
        }

        if (cancelled) return;

        // 4) siapkan PortableText (opsional; fallback kalau paket belum ada)
        import("@portabletext/react")
          .then(({ PortableText }) => {
            if (cancelled) return;
            setPortableTextCmp(() => PortableText);
            setPtComponents({
              ...basePortableTextComponents,
              types: {
                ...basePortableTextComponents.types,
                image: ({ value }) => {
                  const src = makeUrl(value);
                  if (!src) return null;
                  return (
                    <img
                      src={src}
                      alt={value?.alt || ""}
                      className="my-4 rounded-xl"
                      loading="lazy"
                      decoding="async"
                    />
                  );
                },
              },
            });
          })
          .catch(() => {
            // biarkan pakai fallback plain
          });

        setPost({ ...data, _imageUrl: makeUrl(data.mainImage) });
      } catch (e) {
        if (!cancelled) {
          setErr(e?.message || "Gagal memuat artikel.");
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <Navbar solidAtTop />
      <main className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Loading */}
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-2/3 bg-slate-100 rounded" />
              <div className="h-4 w-1/3 bg-slate-100 rounded" />
              <div className="aspect-[16/9] bg-slate-100 rounded-2xl" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
            </div>
          )}

          {/* Error */}
          {!loading && err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {err} —{" "}
              <Link className="underline text-rose-700" to="/">
                kembali
              </Link>
            </div>
          )}

          {/* Content */}
          {!loading && post && (
            <article>
              <div className="text-xs text-slate-500">
                <Link to="/" className="text-bmt-600 hover:underline">
                  ← Kembali
                </Link>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
                {post.title}
              </h1>

              <div className="mt-2 text-sm text-slate-600">
                {fmtDate(post.publishedAt)}
                {post.author?.name ? ` • ${post.author.name}` : ""}
                {post.categories?.length ? ` • ${post.categories[0]}` : ""}
              </div>

              {post._imageUrl ? (
                <img
                  src={post._imageUrl}
                  alt={post.title}
                  className="mt-5 w-full rounded-2xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}

              <div className="prose prose-slate max-w-none mt-6">
                {PortableTextCmp ? (
                  <PortableTextCmp value={post.body || []} components={ptComponents} />
                ) : (
                  <PlainPortableFallback value={post.body} />
                )}
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

/** ====== PortableText base components ====== */
const basePortableTextComponents = {
  types: {
    image: () => null, // dioverride saat @portabletext/react berhasil di-load
  },
  block: {
    h2: ({ children }) => <h2 className="text-xl font-semibold mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold mt-6">{children}</h3>,
    normal: ({ children }) => <p className="leading-7">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-bmt-600 underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
};

/** ====== Fallback sederhana kalau @portabletext/react belum ada ====== */
function PlainPortableFallback({ value }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="space-y-4">
      {value
        .filter((blk) => blk?._type === "block")
        .map((blk) => {
          const text = (blk.children || [])
            .map((c) => (c && typeof c === "object" && "text" in c ? c.text : ""))
            .join("");
          return (
            <p key={blk._key || Math.random()} className="leading-7">
              {text}
            </p>
          );
        })}
    </div>
  );
}
