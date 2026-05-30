"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Menu, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const { openCart, openMenuWithSearch, openMenu, closeMenu } = useUI();
  const { cartCount } = useCart();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProduct = pathname.startsWith("/product/");
  const isCollection = pathname.startsWith("/collection/");
  const hasSubnav = isProduct || isCollection;

  const [collections, setCollections] = useState<{handle: string; title: string}[]>([]);
  useEffect(() => {
    if (!hasSubnav) return;
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
    if (!domain || !token) return;
    fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query: '{ collections(first: 10) { edges { node { handle title } } } }' }),
    })
      .then(r => r.json())
      .then(d => setCollections(d.data?.collections?.edges?.map((e: any) => ({ handle: e.node.handle, title: e.node.title })) ?? []))
      .catch(() => {});
  }, [hasSubnav]);

  const currentCollectionHandle = isCollection ? pathname.split('/collection/')[1]?.split('/')[0] : '';
  const [subnavOpen, setSubnavOpen] = useState(false);
  const currentCollection = collections.find(c => c.handle === currentCollectionHandle);

  // Pages with fullbleed gallery (transparent header overlay)
  const isFullbleed = isProduct || isCollection;

  const BANNER_H = 22;

  // Smart header: hide on scroll down, show solid on scroll up
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [navTop, setNavTop] = useState(BANNER_H);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Track if scrolled past the first viewport (video hero)
  const [pastVideo, setPastVideo] = useState(false);
  const [overDark, setOverDark] = useState(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      setScrolledPast(y > 80);
      setPastVideo(y > window.innerHeight * 0.5);
      setHeaderVisible(true);
      setNavTop(Math.max(0, BANNER_H - y));
      lastScrollY.current = y;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // IntersectionObserver for dark sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let anyDark = false;
        entries.forEach(entry => {
          if (entry.isIntersecting) anyDark = true;
        });
        setOverDark(anyDark);
      },
      { threshold: 0.5 }
    );
    const sections = document.querySelectorAll('.dark-section');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // Body padding
  useEffect(() => {
    const body = document.body;
    if (isFullbleed || isHome) {
      body.style.paddingTop = "0px";
    } else {
      body.style.paddingTop = "48px";
    }
    return () => { body.style.paddingTop = "48px"; };
  }, [isFullbleed, isHome]);

  const solid = !isHome && (!isFullbleed || scrolledPast);

  return (
    <>
      <header className={`tonet-header ${solid ? "solid" : "transparent"} ${isHome && !pastVideo ? "home-top" : ""} ${isHome && pastVideo ? "home-dark" : ""} ${isCollection && !scrolledPast ? "fullbleed-top" : ""} ${!headerVisible ? "header-hidden" : ""} ${overDark ? "over-dark" : ""}`} style={{top: `${navTop}px`}}>
        <div className="tonet-header-inner">
          {/* LEFT: Hamburger (mobile) + Nav links (desktop) */}
          <div className="tonet-nav-left">
            <button className="tonet-mob-icon tonet-mobile-only" aria-label="Menu" onClick={openMenu}>
              <Menu size={16} strokeWidth={1} />
            </button>
            <nav className="tonet-nav-links tonet-desktop-only">
              <Link href="/collections" onClick={closeMenu}>The Collection</Link>
              <Link href="/about" onClick={closeMenu}>The House</Link>
              <Link href="/archive" onClick={closeMenu}>The Archive</Link>
            </nav>
          </div>

          {/* CENTER: Logo */}
          <Link href="/" className="tonet-logo">
            <span className="tonet-logo-text">TONET</span>
          </Link>

          {/* RIGHT: Nav links (desktop) + Search + Account + Cart */}
          <div className="tonet-nav-right">
            <div className="tonet-right-icons">
              <nav className="tonet-nav-links tonet-desktop-only" style={{ marginRight: '28px' }}>
                <Link href="/account" onClick={closeMenu}>The Residence</Link>
              </nav>
              <button className="tonet-right-icon" aria-label="Search" onClick={openMenuWithSearch}>
                <svg width="15" height="15" viewBox="-1 -1 19 19" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <path d="M16.604 15.868l-5.173-5.173c0.975-1.137 1.569-2.611 1.569-4.223 0-3.584-2.916-6.5-6.5-6.5-1.736 0-3.369 0.676-4.598 1.903-1.227 1.228-1.903 2.861-1.902 4.597 0 3.584 2.916 6.5 6.5 6.5 1.612 0 3.087-0.594 4.224-1.569l5.173 5.173 0.707-0.708zM6.5 11.972c-3.032 0-5.5-2.467-5.5-5.5-0.001-1.47 0.571-2.851 1.61-3.889 1.038-1.039 2.42-1.611 3.89-1.611 3.032 0 5.5 2.467 5.5 5.5 0 3.032-2.468 5.5-5.5 5.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="tonet-right-icon" onClick={openCart} aria-label="Open bag">
                <div className="cart-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  {cartCount > 0 && <span className="cart-badge-count">[{cartCount}]</span>}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <style>{`
        /* ══ BASE ══ */
        .tonet-header {
          position: fixed;
          top: 0;
          left: 0; right: 0;
          z-index: 500;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition:
            background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.45s ease;
        }
        .tonet-header.header-hidden { transform: translateY(-100%); }

        /* ══ ALL STATES: luxurious muted whites ══ */
        .tonet-header .tonet-nav-links a,
        .tonet-header .tonet-mob-icon,
        .tonet-header .tonet-right-icon,
        .tonet-header .tonet-logo-text { 
          color: rgba(255, 255, 255, 0.65); 
          transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tonet-header svg { 
          stroke: rgba(255, 255, 255, 0.65); 
          transition: stroke 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Hover glows to pure clean white instead of dimming */
        .tonet-header .tonet-nav-links a:hover,
        .tonet-header .tonet-mob-icon:hover,
        .tonet-header .tonet-right-icon:hover { 
          color: #ffffff; 
          opacity: 1;
        }
        .tonet-header .tonet-right-icon:hover svg {
          stroke: #ffffff;
        }

        /* ══ SCROLL STATES: clean glass backdrops ══ */
        .tonet-header.home-dark {
          background: rgba(12, 12, 12, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: rgba(243, 240, 234, 0.04);
        }
        .tonet-header.solid {
          background: rgba(12, 12, 12, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: rgba(243, 240, 234, 0.05);
        }

        /* ══ LAYOUT ══ */
        .tonet-header-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 56px;
          padding: 0 40px;
        }

        /* ══ LOGO ══ */
        .tonet-logo {
          grid-column: 2;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tonet-logo-text {
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.6em;
          padding-right: 0.6em;
          color: rgba(255, 255, 255, 0.9) !important;
          text-transform: uppercase;
          line-height: 1;
        }
        .tonet-logo:hover .tonet-logo-text { 
          color: #ffffff !important; 
        }

        /* ══ LEFT NAV ══ */
        .tonet-nav-left {
          grid-column: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .tonet-nav-links { display: flex; align-items: center; gap: 36px; }
        .tonet-nav-links a {
          font-family: var(--font-primary);
          font-size: 8.5px;
          font-weight: 300;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 0.35em;
          line-height: 1;
          white-space: nowrap;
        }
        .tonet-mobile-only { display: flex; }
        .tonet-desktop-only { display: none; }

        /* ══ RIGHT ICONS ══ */
        .tonet-nav-right {
          grid-column: 3;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .tonet-right-icons { display: flex; align-items: center; gap: 4px; }
        .tonet-right-icon {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px;
          background: none; border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
        }

        /* ══ CART ══ */
        .cart-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cart-badge-count {
          font-family: var(--font-primary);
          font-size: 8px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.7);
        }
        .tonet-right-icon:hover .cart-badge-count {
          color: #ffffff;
        }

        /* ══ MOB ICON ══ */
        .tonet-mob-icon {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px;
          background: none; border: none;
          cursor: pointer;
          padding: 0;
        }
        .tonet-mobile-left { display: flex; align-items: center; }

        /* ══ DESKTOP ══ */
        @media (min-width: 768px) {
          .tonet-mobile-only { display: none !important; }
          .tonet-desktop-only { display: flex !important; }
          .tonet-header-inner { padding: 0 64px; }
        }

        /* ══ MOBILE ══ */
        @media (max-width: 767px) {
          .tonet-header-inner { padding: 0 20px; height: 52px; }
          .tonet-logo-text { font-size: 11px; letter-spacing: 0.5em; padding-right: 0.5em; }
          .tonet-mob-icon { width: 32px; height: 52px; }
          .tonet-right-icon { width: 32px; height: 52px; }
          .tonet-right-icon:first-of-type { display: none; }
        }
      `}</style>
    </>
  );
}
