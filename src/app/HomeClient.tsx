"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shopify";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for scroll animations
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.12,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-section-id");
          if (id) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const refs = [section1Ref, section2Ref, section3Ref, section4Ref];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 20; // 20px max shift
    const y = (clientY / height - 0.5) * 20;
    heroRef.current.style.setProperty("--mx", `${-x}px`);
    heroRef.current.style.setProperty("--my", `${-y}px`);
  };

  const handleHeroMouseLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty("--mx", `0px`);
    heroRef.current.style.setProperty("--my", `0px`);
  };

  const featuredProduct = useMemo(() => {
    if (products && products.length > 0) {
      const p = products[0];
      return {
        id: p.id,
        title: p.title.toUpperCase(),
        imageUrl: p.imageUrl || "/hero/ComfyUI-main_reference_00012_.png",
        price: p.variants[0]?.price?.amount 
          ? `$${parseFloat(p.variants[0].price.amount).toLocaleString(undefined, { minimumFractionDigits: 0 })}` 
          : "PRICE UPON REQUEST",
        handle: p.handle,
        acqNo: "INV-2026-001",
        collection: p.tags.includes("strange") ? "STRANGE ARCHIVE" : "PERMANENT ARCHIVE",
        dimensions: "140 X 175 CM",
        edition: p.variants[0]?.title.toUpperCase() === "DEFAULT TITLE" ? "UNIQUE PIECE" : `EDITION OF ${p.variants.length}`,
        status: p.variants[0]?.availableForSale ? "AVAILABLE" : "ACQUIRED"
      };
    }
    return {
      id: "fallback-masterpiece",
      title: "REBELLION V",
      imageUrl: "/hero/ComfyUI-main_reference_00012_.png",
      price: "$18,500",
      handle: "rebellion-v",
      acqNo: "INV-2026-001",
      collection: "AUTUMN ARCHIVE",
      dimensions: "150 X 180 CM",
      edition: "UNIQUE PIECE",
      status: "AVAILABLE"
    };
  }, [products]);

  return (
    <>
      <div className="tonet-flagship">
        
        {/* SECTION 1 — HERO */}
        <section 
          ref={section1Ref}
          data-section-id="hero"
          className={`flagship-hero ${visibleSections["hero"] || mounted ? "active" : ""}`}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <div ref={heroRef} className="flagship-hero-bg" />
          <div className="flagship-hero-overlay" />
          <div className="flagship-hero-content">
            <h1 className="hero-logo tonet-cool">TONET GALLERY</h1>
            <h2 className="hero-sublogo tonet-cool">EVERYONE'S ART</h2>
            <p className="hero-statement tonet-serif">Collected differently.</p>
          </div>
          <div className="hero-scroll-indicator">
            <span className="scroll-text">SCROLL</span>
            <span className="scroll-line" />
          </div>
        </section>

        {/* SECTION 2 — MANIFESTO */}
        <section 
          ref={section2Ref}
          data-section-id="manifesto"
          className={`flagship-manifesto ${visibleSections["manifesto"] ? "active" : ""}`}
        >
          <div className="manifesto-inner">
            <p className="manifesto-text tonet-serif">
              <span>Most people decorate.</span>
              <span>Some people collect.</span>
              <span className="accent">TONET GALLERY exists for the latter.</span>
            </p>
            <div className="manifesto-note">
              Curator Reference #001 &bull; London Mayfair
            </div>
          </div>
        </section>

        {/* SECTION 3 — FEATURED WORK */}
        <section 
          ref={section3Ref}
          data-section-id="featured"
          className={`flagship-featured ${visibleSections["featured"] ? "active" : ""}`}
        >
          <div className="featured-wrapper">
            <div className="featured-image-frame">
              <img src={featuredProduct.imageUrl} alt={featuredProduct.title} loading="lazy" />
              <div className="featured-image-reveal-overlay" />
            </div>
            
            <div className="featured-info">
              <div className="featured-meta-left">
                <span className="feat-title tonet-cool">{featuredProduct.title}</span>
                <span className="feat-price">{featuredProduct.price}</span>
              </div>
              <div className="featured-meta-right">
                <span className="feat-acq-code">{featuredProduct.acqNo} &bull; {featuredProduct.collection}</span>
                <Link href={`/product/${featuredProduct.handle}`} className="feat-collect-btn">
                  COLLECT
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — THE ARCHIVE */}
        <section 
          ref={section4Ref}
          data-section-id="archive"
          className={`flagship-archive ${visibleSections["archive"] ? "active" : ""}`}
        >
          <div className="archive-bg" />
          <div className="archive-overlay" />
          <div className="archive-content">
            <h2 className="archive-title tonet-cool">
              <span>Some works disappear.</span>
              <span>Others wait.</span>
            </h2>
            <Link href="/collection" className="archive-btn">
              ENTER THE ARCHIVE
            </Link>
          </div>
        </section>

        {/* MINIMAL FOOTER */}
        <footer className="flagship-footer">
          <div className="footer-inner">
            <span className="footer-brand tonet-cool">TONET GALLERY</span>
            <span className="footer-copy">&copy; 2026 TONET GALLERY. ALL RIGHTS RESERVED.</span>
          </div>
        </footer>

      </div>

      <style>{`
        /* ══ GLOBAL DESIGN SYSTEM ══ */
        .tonet-flagship {
          background-color: #000000;
          color: #fafafa;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          width: 100vw;
          scroll-behavior: smooth;
        }

        /* Serif/Luxury accent font */
        .tonet-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        /* Coolvetica brand font */
        .tonet-cool {
          font-family: var(--font-coolvetica), sans-serif;
        }

        /* ══ GLOBAL OVERRIDES FOR FLAGSHIP HOMEPAGE ══ */
        body:has(.tonet-flagship) {
          padding-top: 0 !important;
          background-color: #000000 !important;
        }
        body:has(.tonet-flagship) .erd-header {
          top: 0 !important;
        }
        body:has(.tonet-flagship) .erd-logo,
        body:has(.tonet-flagship) .erd-nav a,
        body:has(.tonet-flagship) .erd-action-btn,
        body:has(.tonet-flagship) .erd-action-link,
        body:has(.tonet-flagship) .erd-cart-count {
          color: #fafafa !important;
        }
        body:has(.tonet-flagship) .erd-hamburger-line {
          background: #fafafa !important;
        }
        body:has(.tonet-flagship) .erd-irl-badge {
          color: #888888 !important;
        }
        body:has(.tonet-flagship) .ft,
        body:has(.tonet-flagship) .shipping-banner {
          display: none !important;
        }

        /* ══ SECTION 1: HERO ══ */
        .flagship-hero {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: crosshair;
        }

        .flagship-hero-bg {
          position: absolute;
          inset: -20px;
          background-image: url('/hero/ComfyUI-main_reference_00020_.png');
          background-size: cover;
          background-position: center;
          transform: scale(1.05) translate(var(--mx, 0px), var(--my, 0px));
          transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
          z-index: 1;
        }

        .flagship-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 2;
        }

        .flagship-hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-logo {
          font-size: clamp(40px, 9vw, 92px);
          font-weight: normal;
          letter-spacing: 0.1em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #fafafa;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s,
                      transform 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        }

        .hero-sublogo {
          font-size: clamp(12px, 2.5vw, 22px);
          font-weight: normal;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #888888;
          margin-bottom: 32px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s,
                      transform 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s;
        }

        .hero-statement {
          font-style: italic;
          font-size: 14px;
          color: #888888;
          letter-spacing: 0.08em;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s,
                      transform 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s;
        }

        /* Trigger page-load animations */
        .flagship-hero.active .hero-logo {
          opacity: 1;
          transform: translateY(0);
        }
        .flagship-hero.active .hero-sublogo {
          opacity: 1;
          transform: translateY(0);
        }
        .flagship-hero.active .hero-statement {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          opacity: 0.4;
          transition: opacity 1s ease 1.2s;
        }

        .scroll-text {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #888888;
          text-transform: uppercase;
        }

        .scroll-line {
          width: 1px;
          height: 50px;
          background-color: #888888;
          animation: pulseLine 2.4s infinite ease-in-out;
        }

        @keyframes pulseLine {
          0%, 100% { height: 40px; opacity: 0.4; }
          50% { height: 65px; opacity: 1; }
        }

        /* ══ SECTION 2: MANIFESTO ══ */
        .flagship-manifesto {
          background-color: #000000;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 180px 40px;
          box-sizing: border-box;
        }

        .manifesto-inner {
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        .manifesto-text {
          font-size: clamp(24px, 4.5vw, 54px);
          line-height: 1.5;
          color: #888888;
          font-weight: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .manifesto-text span {
          display: block;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.8s cubic-bezier(0.215, 0.61, 0.355, 1),
                      transform 1.8s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        .manifesto-text span.accent {
          color: #fafafa;
          font-weight: 400;
        }

        .manifesto-note {
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #444444;
          text-transform: uppercase;
          margin-top: 80px;
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) 1.2s,
                      transform 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) 1.2s;
        }

        /* Active animations for Manifesto */
        .flagship-manifesto.active .manifesto-text span:nth-child(1) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.1s;
        }
        .flagship-manifesto.active .manifesto-text span:nth-child(2) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.4s;
        }
        .flagship-manifesto.active .manifesto-text span:nth-child(3) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.7s;
        }
        .flagship-manifesto.active .manifesto-note {
          opacity: 1;
          transform: scale(1);
        }

        /* ══ SECTION 3: FEATURED WORK ══ */
        .flagship-featured {
          background-color: #000000;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 120px 40px;
          box-sizing: border-box;
        }

        .featured-wrapper {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .featured-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background-color: #050505;
          border: 1px solid #111111;
        }

        .featured-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.08);
          transition: transform 14s ease, filter 1.6s ease;
          filter: brightness(80%);
        }

        /* Elegant image sliding overlay reveal */
        .featured-image-reveal-overlay {
          position: absolute;
          inset: 0;
          background-color: #000000;
          transform: scaleX(1);
          transform-origin: right;
          transition: transform 2s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 2;
        }

        .featured-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s,
                      transform 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s;
        }

        .featured-meta-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .feat-title {
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: normal;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fafafa;
        }

        .feat-price {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #888888;
        }

        .featured-meta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .feat-acq-code {
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.05em;
          color: #555555;
          text-transform: uppercase;
        }

        .feat-collect-btn {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #fafafa;
          text-decoration: none;
          border-bottom: 1px solid #fafafa;
          padding-bottom: 4px;
          transition: opacity 0.3s ease, border-color 0.3s ease;
        }

        .feat-collect-btn:hover {
          opacity: 0.6;
          border-color: transparent;
        }

        /* Active animations for Featured Work */
        .flagship-featured.active .featured-image-reveal-overlay {
          transform: scaleX(0);
        }
        .flagship-featured.active .featured-image-frame img {
          transform: scale(1);
          filter: brightness(100%);
          transition-delay: 0.5s;
        }
        .flagship-featured.active .featured-info {
          opacity: 1;
          transform: translateY(0);
        }

        /* ══ SECTION 4: THE ARCHIVE ══ */
        .flagship-archive {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #030303;
        }

        .archive-bg {
          position: absolute;
          inset: 0;
          background-image: url('/section6_archive_vault.png');
          background-size: cover;
          background-position: center;
          opacity: 0;
          filter: brightness(35%) grayscale(60%);
          transform: scale(1.05);
          transition: opacity 2.5s ease, transform 2.5s cubic-bezier(0.215, 0.61, 0.355, 1);
          z-index: 1;
        }

        .archive-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 20%, #000000 90%), rgba(0, 0, 0, 0.6);
          z-index: 2;
        }

        .archive-content {
          position: relative;
          z-index: 3;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
        }

        .archive-title {
          font-size: clamp(24px, 4vw, 44px);
          font-weight: normal;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fafafa;
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .archive-title span {
          display: block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.8s cubic-bezier(0.215, 0.61, 0.355, 1),
                      transform 1.8s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        .archive-btn {
          background: none;
          border: 1px solid #ffffff;
          padding: 14px 36px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #ffffff;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.4s, color 0.4s, opacity 0.4s, transform 0.4s;
          border-radius: 0;
          opacity: 0;
          transform: scale(0.95);
        }

        .archive-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }

        /* Active animations for Archive */
        .flagship-archive.active .archive-bg {
          opacity: 0.35;
          transform: scale(1);
        }
        .flagship-archive.active .archive-title span:nth-child(1) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.2s;
        }
        .flagship-archive.active .archive-title span:nth-child(2) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.5s;
        }
        .flagship-archive.active .archive-btn {
          opacity: 1;
          transform: scale(1);
          transition-delay: 0.9s;
        }

        /* ══ MINIMAL FOOTER ══ */
        .flagship-footer {
          background-color: #000000;
          border-top: 1px solid #111111;
          padding: 80px 40px;
          box-sizing: border-box;
        }

        .footer-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-brand {
          font-size: 20px;
          font-weight: normal;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fafafa;
        }

        .footer-copy {
          font-size: 8px;
          letter-spacing: 0.08em;
          color: #444444;
          text-transform: uppercase;
        }

        /* ══ RESPONSIVE ADAPTATIONS ══ */
        @media (max-width: 1024px) {
          .flagship-manifesto { padding: 140px 40px; }
          .flagship-featured { padding: 100px 40px; }
          .featured-wrapper { max-width: 100%; }
        }

        @media (max-width: 767px) {
          .flagship-manifesto { padding: 100px 20px; }
          .manifesto-text { gap: 14px; }
          .flagship-featured { padding: 80px 20px; }
          .featured-wrapper { gap: 24px; }
          .featured-image-frame { aspect-ratio: 4 / 3; }
          .featured-info { flex-direction: column; gap: 20px; align-items: flex-start; }
          .featured-meta-right { align-items: flex-start; }
          .flagship-footer { padding: 60px 20px; }
          .footer-inner { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
    </>
  );
}
