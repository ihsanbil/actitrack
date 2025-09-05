import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Services from "../sections/Services";
import Blog from "../sections/Blog";
import CTA from "../sections/CTA";
import Footer from "../sections/Footer";

// opsional: kalau buka /#about langsung scroll ke bagian itu
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // tunda sedikit biar section sudah render
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <Hero />        {/* #home */}
        <About />       {/* #about */}
        <Services />    {/* #services */}
        <Blog />        {/* #blog */}
        <CTA />         {/* call-to-action sebelum contact */}
      </main>
      <Footer />       {/* #contact ada di footer */}
    </div>
  );
}
