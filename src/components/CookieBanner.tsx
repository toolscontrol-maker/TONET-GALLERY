'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CONSENT_KEY = 'tonet_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const respond = (value: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, value);
    setDismissing(true);
    setTimeout(() => setVisible(false), 800);
  };

  // Do not render the cookie modal on specific administrative or checkout screens if necessary,
  // but let's keep it global unless hidden.
  if (!visible) return null;

  return (
    <div className={`ck-overlay${dismissing ? ' ck-dismissing-overlay' : ''}`} role="dialog" aria-label="Cookie consent">
      <div className={`ck-card${dismissing ? ' ck-dismissing-card' : ''}`}>
        
        {/* Self-drawing card border */}
        <svg className="ck-card-border-svg">
          <rect x="0" y="0" width="100%" height="100%" fill="none" className="ck-card-border-rect" />
        </svg>

        {/* Vector skull motif */}
        <div className="ck-skull-wrap">
          <svg className="ck-skull-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M 28 45 C 28 18, 72 18, 72 45 C 72 58, 65 62, 62 70 C 62 74, 38 74, 38 70 C 35 62, 28 58, 28 45 Z" strokeWidth="1.5" className="ck-drawing-path ck-skull-main" />
            <circle cx="42" cy="46" r="3.5" fill="currentColor" className="ck-skull-eye ck-delay-eye" />
            <circle cx="58" cy="46" r="3.5" fill="currentColor" className="ck-skull-eye ck-delay-eye" />
            <path d="M 47 55 L 50 51 L 53 55 L 50 58 Z" fill="currentColor" className="ck-skull-nose ck-delay-eye" />
            <path d="M 41 65 L 59 65" strokeWidth="1" className="ck-drawing-path ck-skull-teeth-line" />
            <path d="M 45 63 L 45 67" strokeWidth="0.75" className="ck-drawing-path ck-skull-tooth" />
            <path d="M 50 63 L 50 67" strokeWidth="0.75" className="ck-drawing-path ck-skull-tooth" />
            <path d="M 55 63 L 55 67" strokeWidth="0.75" className="ck-drawing-path ck-skull-tooth" />
          </svg>
        </div>

        {/* Typographic Logo */}
        <div className="ck-logo-wrap">
          <span className="ck-brand-title">TONET GALLERY</span>
          <span className="ck-brand-sub">EVERYONE'S ART</span>
        </div>

        {/* Rainbow divider */}
        <div className="ck-divider" />

        {/* Messaging */}
        <div className="ck-content">
          <p className="ck-title">DATA COLLECTION CONSENT</p>
          <p className="ck-body">
            This house utilizes selective data tracking nodes to archive your collector preferences and refine your digital experience. We respect your autonomy.
          </p>
          <p className="ck-footer-note">
            Refer to our <Link href="/privacy" className="ck-link">Privacy Policy</Link> for detailed archive records.
          </p>
        </div>

        {/* Actions */}
        <div className="ck-actions">
          <button className="ck-btn ck-btn--decline" onClick={() => respond('declined')}>
            DECLINE
          </button>
          <button className="ck-btn ck-btn--accept" onClick={() => respond('accepted')}>
            ACCEPT
          </button>
        </div>

      </div>

      <style>{`
        /* ══ COOKIE BANNER OVERLAY ══ */
        .ck-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ck-fade-in 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes ck-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ck-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .ck-overlay.ck-dismissing-overlay {
          animation: ck-fade-out 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* ══ COOKIE BANNER CARD ══ */
        .ck-card {
          position: relative;
          width: 90%;
          max-width: 380px;
          background: #000000;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 32px 40px 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          box-sizing: border-box;
          animation: ck-scale-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes ck-scale-up {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes ck-scale-down {
          from {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          to {
            transform: scale(0.9) translateY(30px);
            opacity: 0;
          }
        }

        .ck-card.ck-dismissing-card {
          animation: ck-scale-down 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* ══ CARD SVG BORDER ══ */
        .ck-card-border-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }

        .ck-card-border-rect {
          width: 100%;
          height: 100%;
          stroke: #ffffff;
          stroke-width: 1.5px;
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: ck-draw-border 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }

        @keyframes ck-draw-border {
          to { stroke-dashoffset: 0; }
        }

        /* ══ VECTOR SKULL ILLUSTRAION ══ */
        .ck-skull-wrap {
          width: 50px;
          height: 50px;
          margin-bottom: 20px;
          color: #ffffff;
          opacity: 0;
          transform: translateY(15px) scale(0.85);
          animation: ck-reveal-skull 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.3s forwards;
        }

        .ck-skull-svg {
          width: 100%;
          height: 100%;
        }

        .ck-drawing-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: ck-draw-path-anim 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }

        @keyframes ck-draw-path-anim {
          to { stroke-dashoffset: 0; }
        }

        .ck-skull-eye {
          transform: scale(0);
          transform-origin: center;
        }

        .ck-delay-eye {
          animation: ck-eye-bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s forwards;
        }

        @keyframes ck-eye-bloom {
          to { transform: scale(1); }
        }

        @keyframes ck-reveal-skull {
          to {
            opacity: 0.95;
            transform: translateY(0) scale(1);
          }
        }

        /* ══ LOGO ══ */
        .ck-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
        }

        .ck-brand-title {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .ck-brand-sub {
          font-family: var(--font-coolvetica), sans-serif;
          font-size: 8px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #888888;
        }

        /* ══ RAINBOW DIVIDER ══ */
        .ck-divider {
          width: 0px;
          height: 2px;
          background: linear-gradient(90deg, #ff3b30, #ff9500, #ffcc00, #34c759, #007aff, #af52de);
          background-size: 200% auto;
          margin-bottom: 24px;
          animation: ck-draw-divider 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards, ck-rainbow-scroll 6s linear infinite;
        }

        @keyframes ck-draw-divider {
          to { width: 70px; }
        }

        @keyframes ck-rainbow-scroll {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* ══ CONTENT & TYPOGRAPHY ══ */
        .ck-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .ck-title {
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 0.18em;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.7s forwards;
        }

        .ck-body {
          font-family: 'Georgia', serif;
          font-style: italic;
          font-size: 11px;
          line-height: 1.8;
          color: #cccccc;
          margin: 0 0 16px 0;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.9s forwards;
        }

        .ck-footer-note {
          font-family: Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 0.05em;
          color: #444444;
          text-transform: uppercase;
          margin: 0;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.1s forwards;
        }

        .ck-link {
          color: #666666;
          text-decoration: none;
          border-bottom: 1px solid #333333;
          padding-bottom: 1px;
          transition: color 0.3s, border-color 0.3s;
        }

        .ck-link:hover {
          color: #ffffff;
          border-color: #ffffff;
        }

        @keyframes ck-reveal-text {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ══ ACTIONS & BUTTONS ══ */
        .ck-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 36px;
          width: 100%;
        }

        .ck-btn {
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          transition: opacity 0.3s, color 0.3s, transform 0.3s;
          border-radius: 0;
        }

        .ck-btn:active {
          transform: scale(0.96);
        }

        .ck-btn--decline {
          color: #555555;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.3s forwards;
        }

        .ck-btn--decline:hover {
          color: #888888;
        }

        .ck-btn--accept {
          color: #ffffff;
          border-bottom: 1px solid #ffffff;
          padding-bottom: 4px;
          opacity: 0;
          transform: translateY(15px);
          animation: ck-reveal-text 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.4s forwards;
        }

        .ck-btn--accept:hover {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
