// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home     = lazy(() => import("../pages/Home.jsx"));
const BlogPost = lazy(() => import("./BlogPost.jsx"));   // <- pakai ekstensi eksplisit
const NotFound = lazy(() => import("./NotFound.jsx"));

export default function RoutesApp() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
