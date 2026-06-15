"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  // Generate dynamic breadcrumbs based on route
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = ['TONET', ...segments.map(s => {
    // Translate common URL handles
    if (s === 'men') return 'HOMBRE';
    if (s === 'women') return 'MUJER';
    if (s === 'children') return 'NIÑOS';
    if (s === 'private-sale') return 'VENTA PRIVADA';
    if (s === 'maison-tonet') return 'MAISON TONET';
    return s.replace('-', ' ');
  })].map(s => s.toUpperCase()).join(' / ');

  return (
    <footer className="ft-ysl">
      {/* Dynamic Breadcrumbs */}
      <div className="ft-ysl-breadcrumbs">
        {breadcrumbs}
      </div>

      {/* 4 Columns Grid */}
      <div className="ft-ysl-grid">
        {/* Column 1: Shipping Location */}
        <div className="ft-ysl-col">
          <span className="ft-ysl-label">ENTREGA EN</span>
          <Link href="#" className="ft-ysl-link ft-ysl-chevron-link">
            ESPAÑA / ES
            <span className="ft-ysl-chevron">›</span>
          </Link>
        </div>

        {/* Column 2: Customer Service */}
        <div className="ft-ysl-col">
          <span className="ft-ysl-section-title">SERVICIO DE ATENCIÓN AL CLIENTE</span>
          <div className="ft-ysl-links-stack">
            <Link href="#" className="ft-ysl-link">ENVÍO & DEVOLUCIÓN</Link>
            <Link href="#" className="ft-ysl-link">SEGUIR PEDIDO</Link>
            <Link href="tel:+34911087850" className="ft-ysl-link">+34 911 08 78 50</Link>
            <Link href="#" className="ft-ysl-link">DEVUELVA SU PEDIDO</Link>
            <Link href="#" className="ft-ysl-link ft-ysl-chevron-link">
              CONCERTAR UNA CITA
              <span className="ft-ysl-chevron">›</span>
            </Link>
          </div>
        </div>

        {/* Column 3: Legal Affairs */}
        <div className="ft-ysl-col">
          <span className="ft-ysl-section-title">ASUNTOS LEGALES</span>
          <div className="ft-ysl-links-stack">
            <Link href="#" className="ft-ysl-link">CONFIGURACIÓN DE COOKIES</Link>
            <Link href="#" className="ft-ysl-link">POLÍTICA DE COOKIES</Link>
            <Link href="#" className="ft-ysl-link">ACCESIBILIDAD</Link>
            <Link href="#" className="ft-ysl-link">EMPLEOS</Link>
          </div>
        </div>

        {/* Column 4: Newsletter Signup */}
        <div className="ft-ysl-col">
          <Link href="#" className="ft-ysl-link ft-ysl-chevron-link">
            REGISTRARSE PARA RECIBIR LA NEWSLETTER
            <span className="ft-ysl-chevron">›</span>
          </Link>
        </div>
      </div>

      {/* Social Media */}
      <div className="ft-ysl-socials">
        <Link href="#" aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
          </svg>
        </Link>
        <Link href="#" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </Link>
        <Link href="#" aria-label="YouTube">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Link>
        <Link href="#" aria-label="TikTok">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.2 8.2 0 0 0 4.79 1.52V7.07a4.85 4.85 0 0 1-1.02-.38z"/>
          </svg>
        </Link>
      </div>

      <style>{`
        .ft-ysl {
          background-color: #ffffff;
          color: #000000;
          padding: 80px 24px 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          border-top: 1px solid #eaeaea;
        }

        .ft-ysl-breadcrumbs {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #777777;
          margin-bottom: 48px;
        }

        .ft-ysl-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          width: 100%;
          margin-bottom: 48px;
        }

        .ft-ysl-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .ft-ysl-label {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #888888;
          margin-bottom: 6px;
        }

        .ft-ysl-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          color: #000000;
        }

        .ft-ysl-links-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .ft-ysl-link {
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: #000000;
          text-decoration: none;
          transition: opacity 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          line-height: 1.4;
        }

        .ft-ysl-link:hover {
          opacity: 0.6;
        }

        .ft-ysl-chevron-link {
          font-weight: 700;
        }

        .ft-ysl-chevron {
          font-size: 12px;
          margin-left: 2px;
          line-height: 1;
        }

        .ft-ysl-socials {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          width: 100%;
        }

        .ft-ysl-socials a {
          color: #000000;
          opacity: 0.8;
          transition: opacity 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ft-ysl-socials a:hover {
          opacity: 0.5;
        }

        /* Desktop Layout (4 Columns) */
        @media (min-width: 768px) {
          .ft-ysl {
            padding: 100px 40px 80px 40px;
          }
          .ft-ysl-breadcrumbs {
            margin-bottom: 60px;
          }
          .ft-ysl-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            max-width: 1200px;
            gap: 40px;
            align-items: start;
            margin-bottom: 80px;
          }
          .ft-ysl-col {
            align-items: start;
            text-align: left;
          }
          .ft-ysl-links-stack {
            align-items: start;
          }
          .ft-ysl-link {
            justify-content: start;
            text-align: left;
          }
        }
      `}</style>
    </footer>
  );
}
