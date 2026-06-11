"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { openCart, openMenuWithSearch, openMenu } = useUI();
  const { cartCount } = useCart();
  const pathname = usePathname();

  return (
    <>
      <header className="erd-header">
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
              <Link href="/stores" className="erd-nav-irl-link">
                <span className="erd-irl-badge">COMING SOON</span>
                IRL
              </Link>
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="erd-header-right erd-desktop-only">
            <button className="erd-action-btn" onClick={openMenuWithSearch}>
              SEARCH
            </button>
            <button className="erd-action-btn" onClick={openCart}>
              CART ({cartCount})
            </button>
            <Link href="/account" className="erd-action-link">
              ACCOUNT
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

      <style>{`
        .erd-header {
          position: fixed;
          top: 22px;
          left: 0;
          right: 0;
          height: 90px;
          background: transparent;
          z-index: 1000;
          box-sizing: border-box;
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
          letter-spacing: 0.02em;
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
          font-family: Arial, sans-serif;
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
          top: 58px;
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
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
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
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
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
          padding-top: 112px !important;
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
            height: 72px;
            padding: 24px 16px;
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
      `}</style>
    </>
  );
}
