import Link from "next/link";
import { getProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="tn-hero">
        <div className="tn-hero-bg" />
        <div className="tn-hero-overlay" />
        
        <div className="tn-hero-logo">
          <span className="tn-logo-txt">T G</span>
        </div>

        <div className="tn-hero-content">
          <h1 className="tn-hero-brand">TONET GALLERY</h1>
          <h2 className="tn-hero-sub">EVERYONE&apos;S ART</h2>
          <p className="tn-hero-desc">Curated for those who see differently.</p>
        </div>
      </section>

      {/* SECTION 2: MINIMALIST ART SHOWCASE */}
      <section className="tn-showcase">
        <div className="tn-showcase-inner">
          <div className="tn-showcase-img-wrap">
            <img 
              src="/section2_abstract_art.png" 
              alt="Art should not belong to a few" 
              className="tn-showcase-img"
              loading="lazy"
            />
          </div>
          <p className="tn-showcase-caption">Art should not belong to a few.</p>
        </div>
      </section>

      {/* SECTION 3: MANIFESTO */}
      <section className="tn-manifesto">
        <div className="tn-manifesto-inner">
          <p className="tn-manifesto-body">
            Most art became decoration.
            <br />
            <br />
            We believe it should remain dangerous.
            <br />
            <br />
            <span className="tn-manifesto-words">Collected. Discussed. Remembered.</span>
          </p>
        </div>
      </section>

      {/* SECTION 4: FEATURED WORKS (MAGAZINE STYLE) */}
      <section className="tn-featured-works">
        <div className="tn-works-header">
          <span className="tn-works-tag">SELECTED EXHIBITS</span>
          <h2 className="tn-works-title">FEATURED WORKS</h2>
        </div>

        <div className="tn-works-list">
          {products.slice(0, 4).map((p) => {
            const priceFormatted = `${p.currencyCode === "USD" ? "$" : "€"}${parseFloat(String(p.price)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            return (
              <div key={p.id} className="tn-work-item">
                <Link href={`/product/${p.handle}`} className="tn-work-img-link">
                  <div className="tn-work-img-frame">
                    <img src={p.imageUrl || p.images[0]} alt={p.title} className="tn-work-img" loading="lazy" />
                  </div>
                </Link>
                <div className="tn-work-meta">
                  <div className="tn-work-info">
                    <h3 className="tn-work-title-text">{p.title}</h3>
                    <span className="tn-work-price-text">{priceFormatted}</span>
                  </div>
                  <Link href={`/product/${p.handle}`} className="tn-work-archive-btn">
                    ARCHIVE &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: COLLECTOR JOURNAL */}
      <section className="tn-collector-journal">
        <div className="tn-journal-header">
          <span className="tn-journal-tag">VOLUME IV</span>
          <h2 className="tn-journal-title">COLLECTOR JOURNAL</h2>
        </div>

        <div className="tn-journal-grid">
          {[
            {
              title: "Why Color Matters",
              category: "ESSAY 01",
              excerpt: "Color is not an aesthetic afterthought. It is a psychological weight. We explore the raw wavelength of human reaction.",
              readTime: "4 MIN READ"
            },
            {
              title: "The Death of Monotony",
              category: "ESSAY 02",
              excerpt: "Modern minimalism chose obedience. An investigation into the decay of architectural variety and the return of ornament.",
              readTime: "6 MIN READ"
            },
            {
              title: "Inside the Collector's Mind",
              category: "ANALYSIS",
              excerpt: "What drives the visceral instinct to possess? Exploring the transition from passive observer to curator of physical artifacts.",
              readTime: "5 MIN READ"
            },
            {
              title: "Why Most Art Feels Empty",
              category: "CRITIQUE",
              excerpt: "In the age of digital replication, the canvas has lost its edge. An inquiry into reclaiming artwork as a dangerous statement.",
              readTime: "7 MIN READ"
            }
          ].map((essay, idx) => (
            <article key={idx} className="tn-journal-card">
              <span className="tn-card-cat">{essay.category}</span>
              <h3 className="tn-card-title">{essay.title}</h3>
              <p className="tn-card-excerpt">{essay.excerpt}</p>
              <div className="tn-card-footer">
                <span className="tn-card-read-time">{essay.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 6: THE ARCHIVE */}
      <section className="tn-archive-section">
        <div className="tn-archive-bg" />
        <div className="tn-archive-overlay" />
        
        <div className="tn-archive-content">
          <p className="tn-archive-quote">
            Some works disappear.
            <br />
            Others wait.
          </p>
          <Link href="/collection/strange" className="tn-archive-btn">
            ENTER THE ARCHIVE
          </Link>
        </div>
      </section>

      {/* SECTION 7: ARTISTIC COORDINATE MAP */}
      <section className="tn-artistic-map">
        {/* Decorative Grid Overlay */}
        <svg className="tn-map-grid-svg" viewBox="0 0 1000 400" fill="none" stroke="currentColor">
          <path d="M 250 150 Q 400 80 500 130 T 750 180" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.2" />
          <path d="M 150 220 Q 300 150 500 130" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.15" />
          <path d="M 500 130 Q 650 100 850 200" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.2" />
          <line x1="0" y1="100" x2="1000" y2="100" strokeWidth="0.25" opacity="0.08" />
          <line x1="0" y1="200" x2="1000" y2="200" strokeWidth="0.25" opacity="0.08" />
          <line x1="0" y1="300" x2="1000" y2="300" strokeWidth="0.25" opacity="0.08" />
          <line x1="250" y1="0" x2="250" y2="400" strokeWidth="0.25" opacity="0.08" />
          <line x1="500" y1="0" x2="500" y2="400" strokeWidth="0.25" opacity="0.08" />
          <line x1="750" y1="0" x2="750" y2="400" strokeWidth="0.25" opacity="0.08" />
        </svg>

        <div className="tn-map-inner">
          <div className="tn-map-points">
            <div className="tn-map-point">
              <span className="tn-point-city">PARIS</span>
              <span className="tn-point-coords">48.8566° N, 2.3522° E</span>
            </div>
            <div className="tn-map-point">
              <span className="tn-point-city">LONDON</span>
              <span className="tn-point-coords">51.5074° N, 0.1278° W</span>
            </div>
            <div className="tn-map-point">
              <span className="tn-point-city">NEW YORK</span>
              <span className="tn-point-coords">40.7128° N, 74.0060° W</span>
            </div>
            <div className="tn-map-point">
              <span className="tn-point-city">BEVERLY HILLS</span>
              <span className="tn-point-coords">34.0736° N, 118.4004° W</span>
            </div>
          </div>
          <p className="tn-map-phrase">
            The next gallery is always somewhere else.
          </p>
        </div>
      </section>

      {/* GIANT EDITORIAL FOOTER */}
      <footer className="tn-editorial-footer">
        <div className="tn-footer-grid">
          <div className="tn-footer-col">
            <span className="tn-footer-tag">THE INVITATION</span>
            <p className="tn-footer-copy">
              Access to special pieces and privileged giftings is reserved for private list members.
            </p>
          </div>
          <div className="tn-footer-col">
            <span className="tn-footer-tag">NAV</span>
            <Link href="/collection/tops">TOPS</Link>
            <Link href="/collection/bottom">BOTTOM</Link>
            <Link href="/collection/strange">STRANGE</Link>
            <Link href="/about">THE HOUSE</Link>
          </div>
          <div className="tn-footer-col">
            <span className="tn-footer-tag">SOCIETY</span>
            <a href="#society">PRIVATE LIST</a>
            <a href="#curation">CULTURE</a>
            <a href="#contact">INQUIRIES</a>
          </div>
          <div className="tn-footer-col">
            <span className="tn-footer-tag">LEGAL</span>
            <Link href="/privacy">PRIVACY POLICY</Link>
            <Link href="/terms">TERMS OF SERVICE</Link>
          </div>
        </div>

        <div className="tn-footer-bottom">
          <h1 className="tn-footer-brand">TONET GALLERY</h1>
          <div className="tn-footer-sub-bar">
            <span>&copy; 2026 TONET GALLERY. ALL RIGHTS RESERVED.</span>
            <span>FOR THOSE WHO SEE DIFFERENTLY.</span>
          </div>
        </div>
      </footer>

      {/* ══ STYLES OVERRIDES ══ */}
      <style>{`
        /* ══ SECTION 1: HERO ══ */
        .tn-hero {
          position: relative;
          width: 100vw;
          height: 100vh;
          margin-top: -101px;
          overflow: hidden;
          background: #000000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .tn-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/parisian_salon_hero.png');
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
        }

        .tn-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.25) 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 1;
        }

        .tn-hero-logo {
          position: absolute;
          top: 140px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tn-logo-txt {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 6px 12px;
          text-transform: uppercase;
        }

        .tn-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-hero-brand {
          font-family: var(--font-coolvetica), sans-serif;
          font-weight: 400;
          font-size: clamp(32px, 6vw, 76px);
          line-height: 0.95;
          letter-spacing: 0.04em;
          color: #ffffff;
          margin: 0 0 16px 0;
          text-transform: uppercase;
        }

        .tn-hero-sub {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(10px, 2.5vw, 15px);
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #ffffff;
          margin: 0 0 32px 0;
          text-transform: uppercase;
        }

        .tn-hero-desc {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(10px, 2vw, 12.5px);
          font-style: italic;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        /* ══ SECTION 2: SHOWCASE ══ */
        .tn-showcase {
          background-color: #ffffff;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10vh 40px;
          box-sizing: border-box;
        }

        .tn-showcase-inner {
          max-width: 1300px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-showcase-img-wrap {
          width: 100%;
          height: 72vh;
          background: #fcfcfc;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .tn-showcase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tn-showcase-caption {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #999999;
          text-transform: uppercase;
          margin: 0;
        }

        /* ══ SECTION 3: MANIFESTO ══ */
        .tn-manifesto {
          background-color: #ffffff;
          width: 100vw;
          padding: 220px 40px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tn-manifesto-inner {
          max-width: 550px;
          width: 100%;
          text-align: center;
        }

        .tn-manifesto-body {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(12px, 2.5vw, 14.5px);
          line-height: 2.2;
          font-weight: 400;
          text-transform: uppercase;
          color: #111111;
          letter-spacing: 0.08em;
          margin: 0;
        }

        .tn-manifesto-words {
          display: block;
          font-weight: 700;
          color: #000000;
          letter-spacing: 0.15em;
          margin-top: 8px;
        }

        /* ══ SECTION 4: FEATURED WORKS ══ */
        .tn-featured-works {
          background-color: #000000;
          width: 100vw;
          padding: 160px 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-works-header {
          text-align: center;
          margin-bottom: 120px;
          max-width: 500px;
          width: 100%;
        }

        .tn-works-tag {
          font-family: Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #888888;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }

        .tn-works-title {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0;
        }

        .tn-works-list {
          max-width: 720px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 160px;
        }

        .tn-work-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-work-img-link {
          width: 100%;
          display: block;
          text-decoration: none;
        }

        .tn-work-img-frame {
          width: 100%;
          aspect-ratio: 3 / 4;
          background-color: #111111;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .tn-work-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tn-work-img-frame:hover .tn-work-img {
          transform: scale(1.05);
        }

        .tn-work-meta {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }

        .tn-work-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tn-work-title-text {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .tn-work-price-text {
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #888888;
        }

        .tn-work-archive-btn {
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1.5px solid #ffffff;
          padding-bottom: 2px;
          transition: opacity 0.3s ease;
        }

        .tn-work-archive-btn:hover {
          opacity: 0.6;
        }

        /* ══ SECTION 5: COLLECTOR JOURNAL ══ */
        .tn-collector-journal {
          background-color: #ffffff;
          width: 100vw;
          padding: 160px 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-journal-header {
          text-align: center;
          margin-bottom: 100px;
          max-width: 500px;
          width: 100%;
        }

        .tn-journal-tag {
          font-family: Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #888888;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }

        .tn-journal-title {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #000000;
          text-transform: uppercase;
          margin: 0;
        }

        .tn-journal-grid {
          max-width: 1100px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 60px 80px;
        }

        .tn-journal-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 36px;
        }

        .tn-card-cat {
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .tn-card-title {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #000000;
          text-transform: uppercase;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .tn-card-excerpt {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          line-height: 1.8;
          color: #555555;
          margin: 0 0 24px 0;
          text-align: justify;
        }

        .tn-card-read-time {
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #bbbbbb;
          text-transform: uppercase;
        }

        /* ══ SECTION 6: THE ARCHIVE ══ */
        .tn-archive-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tn-archive-bg {
          position: absolute;
          inset: 0;
          background-image: url('/section6_archive_vault.png');
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
        }

        .tn-archive-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 1;
        }

        .tn-archive-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-archive-quote {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(18px, 3.5vw, 28px);
          line-height: 1.6;
          font-weight: 300;
          text-transform: uppercase;
          color: #ffffff;
          letter-spacing: 0.08em;
          margin-bottom: 48px;
        }

        .tn-archive-btn {
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #ffffff;
          border: 1px solid #ffffff;
          padding: 14px 32px;
          text-transform: uppercase;
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease;
          border-radius: 0;
        }

        .tn-archive-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }

        /* ══ SECTION 7: ARTISTIC MAP ══ */
        .tn-artistic-map {
          background-color: #000000;
          width: 100vw;
          min-height: 90vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 160px 40px;
          box-sizing: border-box;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tn-map-grid-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 1000px;
          height: auto;
          color: #ffffff;
          pointer-events: none;
          z-index: 1;
        }

        .tn-map-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-map-points {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 90px;
          text-align: center;
        }

        .tn-map-point {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tn-point-city {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 15px;
          letter-spacing: 0.05em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .tn-point-coords {
          font-family: Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          color: #888888;
        }

        .tn-map-phrase {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(11px, 2.2vw, 14px);
          font-style: italic;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin: 0;
          text-align: center;
        }

        /* ══ GIANT EDITORIAL FOOTER ══ */
        .tn-editorial-footer {
          background-color: #000000;
          width: 100vw;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 120px 40px 60px 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-footer-grid {
          max-width: 1100px;
          width: 100%;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 100px;
        }

        .tn-footer-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .tn-footer-tag {
          font-family: Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 950;
          letter-spacing: 0.15em;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .tn-footer-copy {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          max-width: 320px;
        }

        .tn-footer-col a {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.3s ease;
        }

        .tn-footer-col a:hover {
          color: #ffffff;
        }

        .tn-footer-bottom {
          width: 100%;
          max-width: 1100px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tn-footer-brand {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: clamp(36px, 12vw, 138px);
          font-weight: 400;
          line-height: 0.8;
          letter-spacing: 0.05em;
          color: #ffffff;
          margin: 0 0 32px 0;
          text-transform: uppercase;
          text-align: center;
        }

        .tn-footer-sub-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          color: #555555;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ══ RESPONSIVE ADAPTATIONS ══ */
        @media (max-width: 1024px) {
          .tn-journal-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .tn-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 48px;
          }
        }

        @media (max-width: 767px) {
          .tn-hero {
            margin-top: 0;
            height: 100vh;
            height: 100dvh;
          }

          .tn-hero-logo {
            top: 120px;
          }

          .tn-manifesto {
            padding: 140px 24px;
          }

          .tn-featured-works {
            padding: 100px 24px;
          }

          .tn-works-list {
            gap: 100px;
          }

          .tn-collector-journal {
            padding: 100px 24px;
          }

          .tn-artistic-map {
            padding: 100px 24px;
          }

          .tn-map-points {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px 16px;
            margin-bottom: 60px;
          }

          .tn-editorial-footer {
            padding: 80px 24px 40px 24px;
          }

          .tn-footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 60px;
          }

          .tn-footer-bottom {
            padding-top: 40px;
          }

          .tn-footer-sub-bar {
            flex-direction: column;
            align-items: center;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
