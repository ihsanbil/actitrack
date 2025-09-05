// src/lib/sanity.js
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset   = import.meta.env.VITE_SANITY_DATASET;
const apiVersion= import.meta.env.VITE_SANITY_API_VERSION || "2024-06-01";

// Jika env belum diisi, export null supaya app tetap jalan (fallback ke LOCAL_POSTS)
export const sanity = (projectId && dataset)
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

const builder = sanity ? imageUrlBuilder(sanity) : null;

// builder.image(...) adalah sinkron; tidak perlu async/await
export const urlFor = (src) => (builder && src ? builder.image(src) : null);
