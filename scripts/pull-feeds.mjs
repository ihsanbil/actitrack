// scripts/pull-feeds.mjs
import 'dotenv/config';
import { createClient } from '@sanity/client';
import rss from 'rss-to-json';            // CJS default import
const { parse: parseRss } = rss;
import slugify from 'slugify';
import crypto from 'node:crypto';

/* ========== SANITY CLIENT ========== */
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset:   process.env.SANITY_DATASET || 'production',
  apiVersion:process.env.SANITY_API_VERSION || '2024-06-01',
  token:     process.env.SANITY_TOKEN,
  useCdn:    false,
  perspective: 'published',
});
if (!sanity.config().projectId) throw new Error('SANITY_PROJECT_ID belum terisi di .env');
if (!process.env.SANITY_TOKEN)  console.warn('⚠️  SANITY_TOKEN kosong. Script butuh token write (Editor).');

/* ========== FEEDS (revisi URL yang 404) ========== */
const FEEDS = [
  { url: 'https://techcrunch.com/feed/',                         sourceName: 'TechCrunch',     cat: 'teknologi' },
  { url: 'https://www.theverge.com/rss/index.xml',               sourceName: 'The Verge',      cat: 'teknologi' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',      sourceName: 'Ars Technica',   cat: 'teknologi' },
  { url: 'https://www.androidpolice.com/feed/',                  sourceName: 'Android Police', cat: 'android'   }, // <- /feed/ (bukan /rss)
  { url: 'https://9to5google.com/feed/',                         sourceName: '9to5Google',     cat: 'android'   },
  { url: 'https://www.engadget.com/rss.xml',                     sourceName: 'Engadget',       cat: 'teknologi' },
  { url: 'https://www.wired.com/feed/rss',                       sourceName: 'WIRED',          cat: 'teknologi' },
  { url: 'https://thenextweb.com/feed',                          sourceName: 'TNW',            cat: 'startup'   },
  { url: 'https://hnrss.org/frontpage',                          sourceName: 'Hacker News',    cat: 'teknologi' },
  { url: 'https://developers.googleblog.com/feeds/posts/default?alt=rss', sourceName: 'Google Developers', cat: 'dev' },
  { url: 'https://android-developers.googleblog.com/atom.xml',   sourceName: 'Android Dev',    cat: 'android'   },
  // Indonesia yang stabil:
  { url: 'https://gizmologi.id/feed/',                           sourceName: 'Gizmologi',      cat: 'gadget'    },
  // detikINET versi RSS:
  { url: 'https://rss.detik.com/index.php/detikinet',            sourceName: 'detikINET',      cat: 'teknologi' },
];

/* ========== Utils ========== */
const hash = (s) => crypto.createHash('sha1').update(String(s)).digest('hex');
const toSlug = (s) => slugify(String(s || ''), { lower: true, strict: true, locale: 'id' });

/** Buang HTML & whitespace berlebih */
const stripHtml = (html) =>
  String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Pilih URL gambar jika ada (enclosure atau <img src=...>) */
const pickImage = (item) => {
  const enc = Array.isArray(item.enclosures) ? item.enclosures[0] : null;
  if (enc?.url) return enc.url;
  const html = String(item.content || item.description || '');
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] || null;
};

/** Estimasi waktu baca */
const estimateRead = (text) => {
  const words = Math.max(1, String(text || '').trim().split(/\s+/).length);
  return `${Math.max(1, Math.round(words / 180))} min`;
};

/** Normalisasi tanggal → Date valid (fallback: now) */
const normalizeDate = (v) => {
  try {
    if (!v) return new Date();
    if (v instanceof Date && !isNaN(+v)) return v;
    // rss-to-json kadang kasih string tanggal; pakai Date.parse
    const ts = Date.parse(String(v));
    if (!Number.isNaN(ts)) return new Date(ts);
    // kadang ada format “Mon, 02 Sep 2025 08:00:00 +0000” → parse juga
    // Jika tetap gagal, pakai sekarang
    return new Date();
  } catch {
    return new Date();
  }
};

/* ========== Main ========== */
(async () => {
  let total = 0, created = 0, replaced = 0, failed = 0;

  for (const feed of FEEDS) {
    try {
      console.log(`\n📰  Fetching: ${feed.sourceName} — ${feed.url}`);
      const rssDoc = await parseRss(feed.url, {
        headers: { 'user-agent': 'Mozilla/5.0 (ActiTrack Feed Bot)' },
      });

      const items = rssDoc?.items || [];
      console.log(`   → ${items.length} items`);

      for (const item of items) {
        total += 1;
        try {
          const title = item?.title?.trim() || '(No title)';
          const link  = item?.link || item?.url || item?.id;
          if (!link) { continue; }

          const h     = hash(link);
          const slug  = `${toSlug(title)}-${h.slice(0, 8)}`;
          const imageUrl    = pickImage(item);
          const rawDate     = item.published || item.created || item.date || item.pubDate;
          const publishedAt = normalizeDate(rawDate).toISOString();   // ✅ aman dari “Invalid time value”
          const excerpt     = stripHtml(item.description || item.content || '').slice(0, 260);
          const read        = estimateRead(excerpt || title);

          const doc = {
            _id: `externalPost-${h}`,
            _type: 'externalPost',
            title,
            slug: { _type: 'slug', current: slug },
            url: link,
            sourceName: feed.sourceName,
            imageUrl,
            excerpt,
            publishedAt,
            categories: [feed.cat || 'teknologi'],
            _mst_read: read,
          };

          const existed = await sanity.getDocument(doc._id);
          await sanity.createOrReplace(doc);
          if (existed) replaced += 1; else created += 1;
        } catch (e) {
          failed += 1;
          console.error('   ✖ item gagal:', e?.message || e);
        }
      }
    } catch (e) {
      failed += 1;
      console.error('❌ Gagal fetch feed:', feed.url, e?.message || e);
    }
  }

  console.log('\n──────── SUMMARY ────────');
  console.log('Total items  :', total);
  console.log('Created      :', created);
  console.log('Updated      :', replaced);
  console.log('Failed       :', failed);
  console.log('🎉 Selesai tarik & sinkron feed.');
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
