"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";

const COUNTRY_CODES = [
  { code: "+34", label: "ES (+34)" },
  { code: "+1", label: "US/CA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+39", label: "IT (+39)" },
  { code: "+351", label: "PT (+351)" },
  { code: "+52", label: "MX (+52)" },
  { code: "+54", label: "AR (+54)" },
  { code: "+56", label: "CL (+56)" },
  { code: "+57", label: "CO (+57)" },
  { code: "+51", label: "PE (+51)" },
];

export default function Navbar() {
  const { openCart, openMenu, isSearchOpen, openSearch, closeSearch, isIrlOpen, openIrl, closeIrl } = useUI();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [countryCode, setCountryCode] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    
    if (!cleanPhone) {
      setErrorMessage("PHONE NUMBER IS REQUIRED");
      return;
    }
    
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      setErrorMessage("ENTER A VALID PHONE NUMBER (7-15 DIGITS)");
      return;
    }

    setSubmitted(true);
    setErrorMessage("");
    setTimeout(() => {
      setPhoneNumber("");
    }, 2000);
  };

  useEffect(() => {
    if (!isIrlOpen) {
      setSubmitted(false);
      setPhoneNumber("");
      setCountryCode("+34");
      setErrorMessage("");
    }
  }, [isIrlOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeSearch();
      const q = searchQuery.trim();
      setSearchQuery("");
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <>
      <header className={`erd-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="erd-header-inner">
          {/* LEFT: Logo */}
          <div className="erd-header-left">
            <Link href="/" className="erd-logo">
              <span className="erd-logo-desktop">TONET GALLERY</span>
              <span className="erd-logo-mobile">TONET<br />GALLERY</span>
            </Link>
          </div>

          {/* CENTER: Navigation */}
          <div className="erd-header-center erd-desktop-only">
            <nav className="erd-nav">
              <Link href="/collection/tops">TOPS</Link>
              <Link href="/collection/bottom">BOTTOM</Link>
              <Link href="/collection/strange">STRANGE</Link>
              <a
                href="#irl"
                className="erd-nav-irl-link"
                onClick={(e) => {
                  e.preventDefault();
                  openIrl();
                }}
              >
                <span className="erd-irl-badge">COMING SOON</span>
                IRL
              </a>
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="erd-header-right erd-desktop-only">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="erd-search-inline-form">
                <input
                  ref={inputRef}
                  type="text"
                  className="erd-search-inline-input"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => {
                      closeSearch();
                      setSearchQuery("");
                    }, 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      closeSearch();
                      setSearchQuery("");
                    }
                  }}
                  autoFocus
                />
              </form>
            ) : (
              <button className="erd-action-btn" onClick={openSearch} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
            <button className="erd-action-btn" onClick={openCart} aria-label="Cart" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="erd-cart-count">{cartCount}</span>}
            </button>
            <Link href="/account" className="erd-action-link" aria-label="Account" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button className="erd-mobile-menu-btn erd-mobile-only" onClick={openMenu} aria-label="Open menu">
            <span className="erd-hamburger-line" />
            <span className="erd-hamburger-line" />
            <span className="erd-hamburger-line" />
          </button>
        </div>
      </header>

      {/* IRL MODAL DIALOG WITH FLORAL GROWING ANIMATIONS */}
      {isIrlOpen && (
        <div className="irl-modal-overlay" onClick={closeIrl}>
          <div className="irl-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Self-drawing border SVG */}
            <svg className="irl-card-border-svg">
              <rect x="0" y="0" width="100%" height="100%" rx="0" fill="none" className="irl-card-border-rect" />
            </svg>

            {/* Close button */}
            <button className="irl-modal-close" onClick={closeIrl} aria-label="Close modal">
              &times;
            </button>

            {/* Falling Petals container */}
            <div className="irl-petals-container">
              {[
                { type: "petal-black" },
                { type: "petal-r" },
                { type: "petal-black" },
                { type: "petal-o" },
                { type: "petal-y" },
                { type: "petal-black" },
                { type: "petal-g" },
                { type: "petal-b" },
                { type: "petal-black" },
                { type: "petal-i" },
                { type: "petal-v" },
                { type: "petal-black" }
              ].map((petal, i) => (
                <div key={i} className={`irl-petal ${petal.type} petal-${i + 1}`} />
              ))}
            </div>

            {/* Floral Art SVGs */}
            <div className="irl-floral-decor left-decor">
              <svg viewBox="0 0 100 200" fill="none" stroke="currentColor">
                {/* Winding stem */}
                <path d="M10,200 C30,150 10,100 40,50 C50,30 30,10 40,0" strokeWidth="1" className="drawing-path vine-stem" />
                {/* Leaves along the stem */}
                <path d="M22,165 Q35,165 28,155 Z" fill="currentColor" className="blooming-leaf leaf-1" />
                <path d="M15,125 Q2,125 8,115 Z" fill="currentColor" className="blooming-leaf leaf-2" />
                <path d="M26,85 Q38,80 30,70 Z" fill="currentColor" className="blooming-leaf leaf-3" />
                <path d="M42,40 Q55,35 48,25 Z" fill="currentColor" className="blooming-leaf leaf-4" />
                {/* Delicate flowers */}
                <g className="blooming-flower flower-1" style={{ transformOrigin: '28px 155px' }}>
                  <circle cx="28" cy="155" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="28" cy="155" r="1" fill="currentColor" />
                </g>
                <g className="blooming-flower flower-2" style={{ transformOrigin: '30px 70px' }}>
                  <circle cx="30" cy="70" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="30" cy="70" r="1" fill="currentColor" />
                </g>
                <g className="blooming-flower flower-3" style={{ transformOrigin: '40px 0px' }}>
                  <path d="M40,0 C35,-5 35,-12 40,-15 C45,-12 45,-5 40,0 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <path d="M40,0 C32,-3 32,-10 38,-13 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M40,0 C48,-3 48,-10 42,-13 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </g>
              </svg>
            </div>

            <div className="irl-floral-decor right-decor">
              <svg viewBox="0 0 100 200" fill="none" stroke="currentColor">
                {/* Winding stem mirrored */}
                <path d="M90,200 C70,150 90,100 60,50 C50,30 70,10 60,0" strokeWidth="1" className="drawing-path vine-stem" />
                <path d="M78,165 Q65,165 72,155 Z" fill="currentColor" className="blooming-leaf leaf-1" />
                <path d="M85,125 Q98,125 92,115 Z" fill="currentColor" className="blooming-leaf leaf-2" />
                <path d="M74,85 Q62,80 70,70 Z" fill="currentColor" className="blooming-leaf leaf-3" />
                <path d="M58,40 Q45,35 52,25 Z" fill="currentColor" className="blooming-leaf leaf-4" />
                <g className="blooming-flower flower-1" style={{ transformOrigin: '72px 155px' }}>
                  <circle cx="72" cy="155" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="72" cy="155" r="1" fill="currentColor" />
                </g>
                <g className="blooming-flower flower-2" style={{ transformOrigin: '70px 70px' }}>
                  <circle cx="70" cy="70" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="70" cy="70" r="1" fill="currentColor" />
                </g>
                <g className="blooming-flower flower-3" style={{ transformOrigin: '60px 0px' }}>
                  <path d="M60,0 C55,-5 55,-12 60,-15 C65,-12 65,-5 60,0 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <path d="M60,0 C52,-3 52,-10 58,-13 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M60,0 C68,-3 68,-10 62,-13 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </g>
              </svg>
            </div>

            {/* Main Content Info */}
            <div className="irl-modal-content">
              {/* Skull SVG */}
              <div className="irl-skull-wrap">
                <svg className="irl-skull-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                  {/* Skull head contour */}
                  <path d="M 25 45 C 25 15, 75 15, 75 45 C 75 58, 68 62, 65 72 C 65 76, 35 76, 35 72 C 32 62, 25 58, 25 45 Z" strokeWidth="1.5" className="drawing-path skull-main" />
                  {/* Left Eye */}
                  <path d="M 36 45 C 33 40, 47 40, 44 45 C 42 48, 38 48, 36 45 Z" fill="currentColor" className="blooming-leaf leaf-1 skull-eye-l" />
                  {/* Right Eye */}
                  <path d="M 56 45 C 53 40, 67 40, 64 45 C 62 48, 58 48, 56 45 Z" fill="currentColor" className="blooming-leaf leaf-2 skull-eye-r" />
                  {/* Nose */}
                  <path d="M 47 55 L 50 51 L 53 55 L 50 58 Z" fill="currentColor" className="blooming-leaf leaf-3 skull-nose" />
                  {/* Teeth line & teeth */}
                  <path d="M 40 68 L 60 68" strokeWidth="1.2" className="drawing-path skull-teeth-line" />
                  <path d="M 44 65 L 44 71" strokeWidth="1" className="drawing-path skull-tooth" />
                  <path d="M 48 65 L 48 71" strokeWidth="1" className="drawing-path skull-tooth" />
                  <path d="M 52 65 L 52 71" strokeWidth="1" className="drawing-path skull-tooth" />
                  <path d="M 56 65 L 56 71" strokeWidth="1" className="drawing-path skull-tooth" />
                </svg>
              </div>
              <h3 className="irl-subtitle">NEXT OPENING</h3>
              <h2 className="irl-title">TONET GALLERY</h2>
              <div className="irl-divider" />
              <h4 className="irl-location">RODEO DRIVE</h4>
              <p className="irl-city">BEVERLY HILLS, CA</p>
              <div className="irl-date-box">
                <span className="irl-date">FALL 2026</span>
              </div>

              {/* Marketing Phone collection signup */}
              <form onSubmit={handlePhoneSubmit} className="irl-marketing-form">
                <p className="irl-marketing-text">
                  JOIN THE PRIVATE LIST FOR SPECIAL PIECES & PRIVILEGED GIFTINGS
                </p>
                <div className="irl-input-group">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setErrorMessage("");
                    }}
                    className="irl-country-select"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="PHONE NUMBER"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(val);
                      setErrorMessage("");
                    }}
                    className="irl-phone-input"
                  />
                  <button type="submit" className="irl-submit-btn">
                    {submitted ? "REQUESTED" : "REQUEST INVITE"}
                  </button>
                </div>
                {errorMessage && (
                  <p className="irl-error-message">{errorMessage}</p>
                )}
                {submitted && (
                  <p className="irl-success-message">YOUR APPLICATION HAS BEEN FILED.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .erd-header {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          height: 81px;
          background: transparent;
          z-index: 1000;
          box-sizing: border-box;
          transition: top 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .erd-header.scrolled {
          top: 0;
        }

        .erd-header-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 100%;
        }

        /* ══ LEFT: Logo ══ */
        .erd-header-left {
          display: flex;
          align-items: center;
          padding-left: 32px;
        }
        .erd-logo {
          font-family: var(--font-coolvetica), sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 0.95;
          letter-spacing: 0.05em;
          color: #000000;
          text-decoration: none;
          display: block;
          text-transform: uppercase;
        }
        .erd-logo:hover {
          opacity: 1;
        }
        .erd-logo-desktop {
          display: inline;
        }
        .erd-logo-mobile {
          display: none;
        }

        /* ══ CENTER: Navigation ══ */
        .erd-header-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .erd-nav {
          display: flex;
          align-items: center;
          gap: 36px;
        }
        .erd-nav a {
          font-family: var(--font-helvetica-bold-cond), sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #000000;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .erd-nav a:hover {
          opacity: 0.6;
        }
        .erd-nav-irl-link {
          position: relative;
          display: inline-block;
        }
        .erd-irl-badge {
          position: absolute;
          top: -9px;
          left: 50%;
          transform: translateX(-50%);
          font-family: Arial, sans-serif;
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #888888;
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
        }

        .erd-header-right {
          position: fixed;
          top: 52px;
          right: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          z-index: 1000;
        }
        .erd-action-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: var(--font-helvetica-thin-cond), sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #000000;
          transition: opacity 0.2s ease;
          border-radius: 0;
        }
        .erd-action-btn:hover {
          opacity: 0.6;
          background: none;
          transform: none;
        }
        .erd-action-btn:active {
          transform: none;
        }
        .erd-action-link {
          font-family: var(--font-helvetica-thin-cond), sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #000000;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .erd-action-link:hover {
          opacity: 0.6;
        }

        /* Add top padding to body to prevent content from going behind the fixed header */
        body {
          padding-top: 101px !important;
        }

        /* ══ INLINE SEARCH STYLES ══ */
        .erd-search-inline-form {
          display: inline-block;
          margin: 0;
          padding: 0;
        }

        .erd-search-inline-input {
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          margin: 0;
          width: 100px;
          font-family: var(--font-helvetica-thin-cond), sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #000000;
          text-align: right;
          caret-color: #000000;
        }

        .erd-search-inline-input::placeholder {
          color: #888888;
          opacity: 0.5;
        }

        .erd-cart-count {
          font-family: var(--font-helvetica-thin-cond), sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #000000;
        }

        /* ══ RESPONSIVE UTILITIES ══ */
        .erd-mobile-only {
          display: none !important;
        }
        .erd-desktop-only {
          display: flex !important;
        }

        @media (max-width: 767px) {
          .erd-mobile-only {
            display: block !important;
          }
          .erd-desktop-only {
            display: none !important;
          }

          .erd-header {
            height: 65px;
            padding: 21px 16px;
            background: transparent;
          }
          .erd-header-inner {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: auto;
            width: 100%;
          }
          .erd-header-left {
            padding-left: 0;
          }
          .erd-logo {
            font-size: 20px;
            line-height: 0.9;
          }
          .erd-logo-desktop {
            display: none;
          }
          .erd-logo-mobile {
            display: block;
          }

          .erd-mobile-menu-btn {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            border-radius: 0;
          }
          .erd-mobile-menu-btn:hover {
            background: none;
            transform: none;
          }
          .erd-mobile-menu-btn:active {
            transform: none;
          }

          .erd-hamburger-line {
            display: block;
            width: 24px;
            height: 2px;
            background: #000000;
            margin: 3px 0;
          }



          body {
            padding-top: 0 !important;
          }
        }

        /* ══ IRL MODAL OVERLAY ══ */
        .irl-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: irlFadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes irlFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ══ IRL MODAL CARD ══ */
        .irl-modal-card {
          position: relative;
          width: 90%;
          max-width: 420px;
          height: 580px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
          animation: irlScaleUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes irlScaleUp {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        /* ══ SELF DRAWING BORDER ══ */
        .irl-card-border-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }

        .irl-card-border-rect {
          stroke: #000000;
          stroke-width: 1.5px;
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawBorder 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }

        @keyframes drawBorder {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* ══ CLOSE BUTTON ══ */
        .irl-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          font-weight: 300;
          line-height: 1;
          cursor: pointer;
          color: #000000;
          z-index: 20;
          opacity: 0;
          animation: fadeInClose 0.5s ease 1.2s forwards;
          transition: transform 0.3s ease;
        }

        .irl-modal-close:hover {
          transform: rotate(90deg);
        }

        @keyframes fadeInClose {
          to { opacity: 0.6; }
        }

        /* ══ FLORAL CORNER VINES ══ */
        .irl-floral-decor {
          position: absolute;
          width: 90px;
          height: 180px;
          bottom: 15px;
          pointer-events: none;
          z-index: 2;
          color: #000000;
          opacity: 0.8;
        }

        .left-decor {
          left: 15px;
        }

        .right-decor {
          right: 15px;
          transform: scaleX(-1); /* mirror */
        }

        /* SVG Line Drawing */
        .drawing-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawVine 2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
        }

        @keyframes drawVine {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Blooming leaves */
        .blooming-leaf {
          transform: scale(0);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
        }

        .blooming-leaf.leaf-1 { animation: bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards; }
        .blooming-leaf.leaf-2 { animation: bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s forwards; }
        .blooming-leaf.leaf-3 { animation: bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.6s forwards; }
        .blooming-leaf.leaf-4 { animation: bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s forwards; }

        /* Blooming flowers */
        .blooming-flower {
          transform: scale(0);
          opacity: 0;
        }

        .blooming-flower.flower-1 { animation: bloom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.5s forwards; }
        .blooming-flower.flower-2 { animation: bloom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s forwards; }
        .blooming-flower.flower-3 { animation: bloom 1s cubic-bezier(0.34, 1.56, 0.64, 1) 2s forwards; }

        @keyframes bloom {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* ══ FALLING PETALS (AVANT-GARDE LUXURY BLACK PETALS) ══ */
        .irl-petals-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        .irl-petal {
          position: absolute;
          background: #000000;
          border-radius: 50% 0 50% 50%;
          opacity: 0;
          transform: rotate(0deg);
          width: 6px;
          height: 9px;
        }

        /* Different animation paths for each petal */
        .petal-1 { left: 15%; animation: fallPetal1 6s linear infinite 0.2s; }
        .petal-2 { left: 35%; animation: fallPetal2 7s linear infinite 1.5s; }
        .petal-3 { left: 55%; animation: fallPetal3 6.5s linear infinite 0.8s; }
        .petal-4 { left: 75%; animation: fallPetal4 8s linear infinite 2s; }
        .petal-5 { left: 25%; animation: fallPetal2 7.5s linear infinite 3s; }
        .petal-6 { left: 65%; animation: fallPetal1 6.8s linear infinite 4.2s; }
        .petal-7 { left: 85%; animation: fallPetal3 8.2s linear infinite 1.2s; }
        .petal-8 { left: 45%; animation: fallPetal4 7.2s linear infinite 3.5s; }
        .petal-9 { left: 10%; animation: fallPetal3 9s linear infinite 5s; }
        .petal-10 { left: 90%; animation: fallPetal2 6.2s linear infinite 2.5s; }
        .petal-11 { left: 50%; animation: fallPetal1 8.5s linear infinite 5.5s; }
        .petal-12 { left: 70%; animation: fallPetal4 7s linear infinite 0.5s; }

        @keyframes fallPetal1 {
          0% { top: -10px; transform: translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.12; }
          100% { top: 100%; transform: translateX(30px) rotate(360deg); opacity: 0; }
        }

        @keyframes fallPetal2 {
          0% { top: -10px; transform: translateX(0) rotate(45deg); opacity: 0; }
          10% { opacity: 0.18; }
          90% { opacity: 0.15; }
          100% { top: 100%; transform: translateX(-40px) rotate(405deg); opacity: 0; }
        }

        @keyframes fallPetal3 {
          0% { top: -10px; transform: translateX(0) rotate(-30deg); opacity: 0; }
          10% { opacity: 0.12; }
          90% { opacity: 0.1; }
          100% { top: 100%; transform: translateX(20px) rotate(330deg); opacity: 0; }
        }

        @keyframes fallPetal4 {
          0% { top: -10px; transform: translateX(0) rotate(15deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.1; }
          100% { top: 100%; transform: translateX(-20px) rotate(375deg); opacity: 0; }
        }

        /* ══ MODAL CONTENT & TYPOGRAPHY REVEAL ══ */
        .irl-modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 5;
          text-align: center;
          padding: 40px;
        }

        .irl-subtitle {
          font-family: Arial, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #888888;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s forwards;
        }

        .irl-title {
          font-family: var(--font-coolvetica), sans-serif;
          font-weight: normal;
          font-size: 36px;
          letter-spacing: 0.05em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #000000;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.8s forwards;
        }

        .irl-divider {
          width: 0px;
          height: 2.5px;
          background: linear-gradient(90deg, #ff3b30, #ff9500, #ffcc00, #34c759, #007aff, #af52de);
          margin-bottom: 24px;
          animation: drawDivider 1s cubic-bezier(0.22, 1, 0.36, 1) 1s forwards;
        }

        @keyframes drawDivider {
          to { width: 60px; }
        }

        .irl-location {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #000000 0%, #ff3b30 25%, #ffcc00 50%, #34c759 75%, #000000 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 4px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1s forwards, rainbowScroll 6s linear infinite;
        }

        .irl-city {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555555;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.2s forwards;
        }

        .irl-date-box {
          border: 1px solid #000000;
          padding: 8px 20px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.4s forwards;
        }

        .irl-date {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 14px;
          letter-spacing: 0.08em;
          color: #000000;
          text-transform: uppercase;
        }

        @keyframes revealText {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rainbowScroll {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* ══ SKULL ICON STYLE ══ */
        .irl-skull-wrap {
          width: 60px;
          height: 60px;
          margin-bottom: 16px;
          color: #000000;
          opacity: 0;
          transform: translateY(15px) scale(0.8);
          animation: revealSkull 1s cubic-bezier(0.25, 1, 0.5, 1) 0.4s forwards;
        }

        .irl-skull-svg {
          width: 100%;
          height: 100%;
        }

        @keyframes revealSkull {
          to {
            opacity: 0.95;
            transform: translateY(0) scale(1);
          }
        }

        /* ══ RAINBOW PETAL COLOR SCHEMES ══ */
        .irl-petal.petal-black { background: #000000; }
        .irl-petal.petal-r { background: #ff3b30; }
        .irl-petal.petal-o { background: #ff9500; }
        .irl-petal.petal-y { background: #ffcc00; }
        .irl-petal.petal-g { background: #34c759; }
        .irl-petal.petal-b { background: #007aff; }
        .irl-petal.petal-i { background: #5856d6; }
        .irl-petal.petal-v { background: #af52de; }
        
        /* ══ IRL MARKETING FORM ══ */
        .irl-marketing-form {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 280px;
          opacity: 0;
          transform: translateY(15px);
          animation: revealText 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.5s forwards;
        }

        .irl-marketing-text {
          font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1.4;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 14px;
          text-align: center;
        }

        .irl-input-group {
          display: flex;
          width: 100%;
          border-bottom: 1.5px solid #000000;
          padding-bottom: 4px;
        }

        .irl-phone-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 13px;
          letter-spacing: 0.05em;
          color: #000000;
          padding: 4px 0;
          width: 100%;
        }

        .irl-phone-input::placeholder {
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: #cccccc;
          letter-spacing: 0.08em;
        }

        .irl-submit-btn {
          border: none;
          background: transparent;
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.05em;
          color: #000000;
          cursor: pointer;
          padding: 0 4px;
          text-transform: uppercase;
          transition: opacity 0.2s ease;
        }

        .irl-submit-btn:hover {
          opacity: 0.6;
        }

        .irl-success-message {
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #34c759;
          text-transform: uppercase;
          margin-top: 8px;
          animation: irlFadeIn 0.3s ease forwards;
        }

        .irl-error-message {
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #ff3b30;
          text-transform: uppercase;
          margin-top: 8px;
          animation: irlFadeIn 0.3s ease forwards;
        }

        .irl-country-select {
          border: none;
          background: transparent;
          outline: none;
          font-family: Arial, sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #000000;
          padding-right: 6px;
          margin-right: 8px;
          border-right: 1.5px solid #000000;
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border-radius: 0;
        }

        .irl-country-select option {
          background-color: #ffffff;
          color: #000000;
          font-family: Arial, sans-serif;
          font-weight: 700;
        }
        
        @media (max-width: 767px) {
          body {
            padding-top: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
