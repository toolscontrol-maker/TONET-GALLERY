"use client";

import { useUI } from "@/context/UIContext";
import { useCart, CartLine } from "@/context/CartContext";
import { useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { X, Plus, Minus } from "lucide-react";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  colour: string;
  size: string;
  qty: number;
  image: string;
}

function lineToItem(line: CartLine): CartItem {
  const colourOpt = line.options.find(
    (o) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour"
  );
  const sizeOpt = line.options.find((o) => o.name.toLowerCase() === "size");
  return {
    id: line.id,
    variantId: line.variantId,
    name: line.name,
    price: line.price,
    colour: colourOpt?.value ?? "",
    size: sizeOpt?.value ?? (line.variantTitle || ""),
    qty: line.quantity,
    image: line.image,
  };
}

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUI();
  const { cart, updateQty, removeFromCart } = useCart();
  const { formatPrice } = useLocale();

  const items: CartItem[] = cart.lines.map(lineToItem);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  async function changeQty(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = item.qty + delta;
    if (next <= 0) await removeFromCart(id);
    else await updateQty(id, next);
  }

  const totalFormatted = formatPrice(cart.totalAmount, cart.currencyCode ?? 'EUR');

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cd-backdrop ${isCartOpen ? "open" : ""}`}
        aria-hidden="true"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`cd-drawer ${isCartOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        {/* ── HEADER ── */}
        <div className="cd-header">
          <span className="cd-title">CART ({items.reduce((acc, item) => acc + item.qty, 0)})</span>
          <button className="cd-close" onClick={closeCart} aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="cd-body">
          {items.length === 0 ? (
            <div className="cd-empty-state">
              <p className="cd-empty-text">No garments have been selected.</p>
              <button className="cd-continue-btn" onClick={closeCart}>
                Return to Shop
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cd-item">
                <div className="cd-item-img">
                  {item.image && <img src={item.image} alt={item.name} draggable={false} />}
                </div>
                <div className="cd-item-info">
                  <span className="cd-item-name">{item.name}</span>
                  {item.colour && (
                    <span className="cd-item-detail">
                      COLOR {item.colour.toUpperCase()}
                    </span>
                  )}
                  {item.size && (
                    <span className="cd-item-detail">
                      SIZE {item.size.toUpperCase()}
                    </span>
                  )}
                  <span className="cd-item-price">
                    {formatPrice(item.price * item.qty, 'EUR')}
                  </span>
                  <div className="cd-qty-row">
                    <button className="cd-qty-btn" onClick={() => changeQty(item.id, -1)} aria-label="Decrease">-</button>
                    <span className="cd-qty-val">{item.qty}</span>
                    <button className="cd-qty-btn" onClick={() => changeQty(item.id, 1)} aria-label="Increase">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── FOOTER ── */}
        {items.length > 0 && (
          <div className="cd-footer">
            <div className="cd-subtotal-row">
              <span className="cd-subtotal-label">SUBTOTAL: {totalFormatted}</span>
            </div>
            <div className="cd-cta-group">
              <button
                className="cd-checkout-btn"
                onClick={() => {
                  if (cart.checkoutUrl) window.location.href = cart.checkoutUrl;
                }}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* ══ BACKDROP ══ */
        .cd-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
          z-index: 1000;
        }
        .cd-backdrop.open { opacity: 1; pointer-events: auto; }

        /* ══ DRAWER ══ */
        .cd-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(100vw, 440px);
          background: #ffffff;
          border-left: 1px solid #000000;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: Arial, sans-serif;
          color: #000000;
          overflow: hidden;
          box-shadow: none;
        }
        .cd-drawer.open { transform: translateX(0); }

        /* ══ HEADER ══ */
        .cd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px;
          flex-shrink: 0;
        }
        .cd-title {
          font-family: Arial, sans-serif;
          font-size: 20.4px;
          font-weight: 900;
          text-transform: uppercase;
          color: #000000;
          letter-spacing: -0.01em;
        }
        .cd-close {
          background: none; border: none;
          cursor: pointer;
          color: #000000;
          padding: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.2s;
        }
        .cd-close:hover { opacity: 0.6; }

        /* ══ BODY ══ */
        .cd-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .cd-body::-webkit-scrollbar { display: none; }

        /* ══ EMPTY STATE ══ */
        .cd-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0 32px 48px;
          gap: 24px;
        }
        .cd-empty-text {
          font-family: Arial, sans-serif;
          font-size: 9.35px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #000000;
          margin: 0;
          text-align: center;
        }
        .cd-continue-btn {
          width: 180px;
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          font-size: 9.35px;
          font-family: Arial, sans-serif;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0;
          transition: opacity 0.2s ease;
        }
        .cd-continue-btn:hover { opacity: 0.85; }

        /* ══ ITEM ══ */
        .cd-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px;
        }
        .cd-item-img {
          width: 240px;
          height: auto;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          margin-bottom: 24px;
        }
        .cd-item-img img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }
        .cd-item-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }
        .cd-item-name {
          font-family: Arial, sans-serif;
          font-size: 11.9px;
          font-weight: 900;
          text-transform: uppercase;
          color: #000000;
          letter-spacing: -0.01em;
          line-height: 1.2;
          max-width: 280px;
        }
        .cd-item-detail {
          font-family: Arial, sans-serif;
          font-size: 9.35px;
          font-weight: 700;
          text-transform: uppercase;
          color: #000000;
          letter-spacing: 0.02em;
        }
        .cd-item-price {
          font-family: Arial, sans-serif;
          font-size: 11.05px;
          font-weight: 700;
          color: #000000;
          margin-top: 4px;
        }
        .cd-qty-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 12px;
        }
        .cd-qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #000000;
          font-family: Arial, sans-serif;
          font-size: 13.6px;
          font-weight: 700;
          padding: 0 4px;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cd-qty-btn:hover { opacity: 0.6; }
        .cd-qty-val {
          font-family: Arial, sans-serif;
          font-size: 11.9px;
          font-weight: 700;
          color: #000000;
        }

        /* ══ FOOTER ══ */
        .cd-footer {
          flex-shrink: 0;
          padding: 24px 24px 32px;
          background: #ffffff;
        }
        .cd-subtotal-row {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
        }
        .cd-subtotal-label {
          font-family: Arial, sans-serif;
          font-size: 9.35px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #000000;
        }
        .cd-cta-group {
          width: 100%;
        }
        .cd-checkout-btn {
          width: 100%;
          border: none;
          padding: 14px 16px;
          font-family: Arial, sans-serif;
          font-size: 11.9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          cursor: pointer;
          border-radius: 0;
          background: #000000;
          color: #ffffff;
          transition: opacity 0.2s;
        }
        .cd-checkout-btn:hover { opacity: 0.85; }

        /* ══ MOBILE ══ */
        @media (max-width: 767px) {
          .cd-drawer { width: 100vw; border-left: none; }
          .cd-header { padding: 20px 20px; }
          .cd-item { padding: 30px 20px; }
          .cd-footer { padding: 20px 20px 28px; }
        }
      `}</style>
    </>
  );
}
