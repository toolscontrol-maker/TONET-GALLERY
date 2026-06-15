"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { Plus, Minus } from "lucide-react";

interface HomeClientProps {
  products: Product[];
}

const HERO_IMAGES = [
  "/hero/ComfyUI-main_reference_00020_.png",
  "/hero/ComfyUI-main_reference_00012_.png",
  "/hero/ComfyUI-main_reference_00016_.png",
  "/hero/ComfyUI-main_reference_00018_.png",
  "/hero/ComfyUI-main_reference_00022_.png"
];

const COLOR_MAP: Record<string, string> = {
  pablo: "#9e8e7a",
  "french blue": "#5f7193",
  "sky blue": "#9bbad5",
  black: "#111111",
  white: "#ffffff",
  navy: "#1a2c4c",
  grey: "#808080",
  gray: "#808080",
  charcoal: "#333333",
  olive: "#556b2f",
  sand: "#e5d3b3",
  cream: "#fffdd0",
  red: "#d32f2f",
  blue: "#1976d2",
  green: "#388e3c",
  brown: "#5d4037",
  orange: "#f57c00",
  yellow: "#fbc02d",
  purple: "#7b1fa2",
  pink: "#c2185b",
};

export default function HomeClient({ products }: HomeClientProps) {
  const { addToCart } = useCart();
  const { openCart } = useUI();

  // Slideshow state
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Quick Add state
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Filter tops products (excluding shorts/pants/joggers)
  const topsProducts = useMemo(() => {
    return products.filter(p => {
      const title = p.title.toLowerCase();
      const isBottom = title.includes("shorts") || title.includes("pants") || title.includes("trousers") || title.includes("jogger") || title.includes("sweatpants");
      return !isBottom;
    });
  }, [products]);

  // Fallback to all products if no tops found
  const displayProducts = useMemo(() => {
    return topsProducts.length > 0 ? topsProducts : products;
  }, [topsProducts, products]);

  // Initialize options for Quick Add
  useEffect(() => {
    if (quickAddProduct) {
      const initial: Record<string, string> = {};
      if (quickAddProduct.variants.length > 0) {
        quickAddProduct.variants[0].selectedOptions.forEach(opt => {
          initial[opt.name] = opt.value;
        });
      }
      setSelectedOptions(initial);
      setQuantity(1);
    }
  }, [quickAddProduct]);

  // Extract available options (Color, Size, etc.) for the quick add product
  const quickAddProductOptions = useMemo(() => {
    if (!quickAddProduct) return [];
    const optionMap: Record<string, Set<string>> = {};
    quickAddProduct.variants.forEach(variant => {
      variant.selectedOptions.forEach(opt => {
        if (!optionMap[opt.name]) {
          optionMap[opt.name] = new Set();
        }
        optionMap[opt.name].add(opt.value);
      });
    });
    return Object.keys(optionMap).map(name => ({
      name,
      values: Array.from(optionMap[name])
    }));
  }, [quickAddProduct]);

  // Resolve selected options to a single variant
  const selectedVariant = useMemo(() => {
    if (!quickAddProduct) return null;
    return quickAddProduct.variants.find(v => {
      return v.selectedOptions.every(opt => {
        return selectedOptions[opt.name] === opt.value;
      });
    }) || quickAddProduct.variants[0];
  }, [quickAddProduct, selectedOptions]);

  // Handle active variant image preview in Quick Add
  const quickAddImage = useMemo(() => {
    if (selectedVariant && selectedVariant.image?.url) {
      return selectedVariant.image.url;
    }
    return quickAddProduct?.imageUrl;
  }, [selectedVariant, quickAddProduct]);

  // Add selected item to Shopify cart
  const handleQuickAddSubmit = async () => {
    if (!selectedVariant || adding) return;
    setAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      setQuickAddProduct(null);
      openCart();
    } catch (err) {
      console.error("Failed to add product via quick add:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="tonet-flagship">
        
        {/* HERO SECTION - 1.5 BLOCKS SPLIT IN 2 */}
        <section className="hero-split-section">
          {/* Left Panel: Brand Identity, Typography & CTA */}
          <div className="hero-split-panel left-panel">
            <div className="hero-brand-content">
              <span className="hero-eyebrow">TONET — SS MMXXVI</span>
              <h1 className="hero-title">
                SILENCE.<br />
                STRUCTURE.<br />
                PERMANENCE.
              </h1>
              <p className="hero-description">
                A curation of permanence. Minimalist geometry, structural garment design, and quiet luxury. Crafted for those who seek form and function in unison.
              </p>
              <Link href="/search" className="hero-cta-button">
                ENTER THE GALLERY
              </Link>
            </div>
          </div>

          {/* Right Panel: Crossfading Slideshow */}
          <div className="hero-split-panel right-panel">
            <div className="hero-slideshow">
              {HERO_IMAGES.map((src, i) => (
                <div 
                  key={i} 
                  className={`hero-slide-item ${i === activeSlideIndex ? "active" : ""}`}
                >
                  <img src={src} alt={`Editorial photoshoot ${i + 1}`} loading="lazy" />
                  <div className="hero-slide-overlay" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MINIMAL FOOTER */}
        <footer className="gd-footer">
          <div className="gd-footer-inner">
            <span className="gd-footer-brand">TONET GALLERY</span>
            <span className="gd-footer-copy">&copy; 2026 TONET GALLERY. ALL RIGHTS RESERVED.</span>
          </div>
        </footer>

        {/* QUICK ADD DRAWER / SELECT OPTIONS */}
        <div 
          className={`qa-backdrop ${quickAddProduct ? "open" : ""}`} 
          onClick={() => setQuickAddProduct(null)} 
        />
        <div className={`qa-drawer ${quickAddProduct ? "open" : ""}`} role="dialog" aria-modal="true">
          <div className="qa-header">
            <span className="qa-header-title">SELECT OPTIONS</span>
            <button className="qa-close-btn" onClick={() => setQuickAddProduct(null)} aria-label="Close menu">
              &times;
            </button>
          </div>

          {quickAddProduct && (
            <div className="qa-content-grid">
              
              {/* Left Side: Product Image */}
              <div className="qa-media-side">
                {quickAddImage && (
                  <img src={quickAddImage} alt={quickAddProduct.title} />
                )}
              </div>

              {/* Right Side: Variant & Option Selectors */}
              <div className="qa-details-side">
                <h1 className="qa-product-title">{quickAddProduct.title.toUpperCase()}</h1>
                <div className="qa-product-price">
                  {selectedVariant?.price?.amount 
                    ? `€${parseFloat(selectedVariant.price.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                    : `€${quickAddProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
                <div className="qa-tax-note">Tax included.</div>

                <div className="qa-selectors-container">
                  {quickAddProductOptions.map(option => {
                    const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';
                    const selectedValue = selectedOptions[option.name];

                    return (
                      <div key={option.name} className="qa-option-section">
                        <span className="qa-option-label">
                          {option.name.toUpperCase()}: {selectedValue?.toUpperCase()}
                        </span>
                        <div className="qa-swatches-row">
                          {option.values.map(val => {
                            const isActive = selectedValue === val;
                            if (isColor) {
                              const colorHex = COLOR_MAP[val.toLowerCase()] || '#cccccc';
                              return (
                                <button
                                  key={val}
                                  className={`qa-color-swatch ${isActive ? 'active' : ''}`}
                                  style={{ backgroundColor: colorHex }}
                                  onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                                  title={val}
                                  aria-label={`Select Color ${val}`}
                                />
                              );
                            } else {
                              return (
                                <button
                                  key={val}
                                  className={`qa-size-swatch ${isActive ? 'active' : ''}`}
                                  onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                                  aria-label={`Select ${option.name} ${val}`}
                                >
                                  {val}
                                </button>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity and CTA row */}
                <div className="qa-actions-row">
                  <div className="qa-quantity-selector">
                    <button 
                      className="qa-quantity-btn"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} strokeWidth={1.5} />
                    </button>
                    <span className="qa-quantity-value">{quantity}</span>
                    <button 
                      className="qa-quantity-btn"
                      onClick={() => setQuantity(q => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>

                  <button 
                    className="qa-add-btn"
                    onClick={handleQuickAddSubmit}
                    disabled={adding || !selectedVariant?.availableForSale}
                  >
                    {adding ? "ADDING..." : selectedVariant?.availableForSale ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════
           DESIGN-TOKEN LAYER — single source of truth
           All gutters, gaps, heights driven by CSS custom props.
           ═══════════════════════════════════════════════════ */
        :root {
          /* Gutter: constant lateral padding that matches header padding */
          --gd-gutter: 32px;

          /* Grid */
          --gd-cols: 4;
          --gd-col-gap: 40px;
          --gd-row-gap: 88px;

          /* Card proportions */
          --gd-card-min-h: 62vh;
          --gd-img-h: 38vh;

          /* Typography */
          --gd-name-size: 11px;
          --gd-price-size: 10px;
          --gd-title-size: 28px;
          --gd-viewall-size: 11px;

          /* Section spacing */
          --gd-section-pt: 80px;
          --gd-section-pb: 80px;
          --gd-header-mb: 60px;
          --gd-info-pt: 28px;

          /* Hero */
          --hero-items: 3.2;
          --hero-gap: 24px;
          --hero-pad: 40px;

          /* Quick-add button */
          --gd-qab-size: 28px;
          --gd-qab-font: 16px;
        }

        /* ─── Tablet (768–1024) ─── */
        @media (max-width: 1024px) {
          :root {
            --gd-gutter: 24px;
            --gd-col-gap: 28px;
            --gd-row-gap: 64px;
            --gd-card-min-h: 56vh;
            --gd-img-h: 34vh;
            --gd-name-size: 10px;
            --gd-price-size: 9px;
            --gd-title-size: 22px;
            --gd-section-pt: 56px;
            --gd-section-pb: 56px;
            --gd-header-mb: 40px;
            --gd-info-pt: 20px;
            --hero-pad: 24px;
          }
        }

        /* ─── Mobile (≤767) ─── */
        @media (max-width: 767px) {
          :root {
            --gd-gutter: 16px;
            --gd-cols: 2;
            --gd-col-gap: 12px;
            --gd-row-gap: 40px;
            --gd-card-min-h: 48vh;
            --gd-img-h: 28vh;
            --gd-name-size: 8.5px;
            --gd-price-size: 8px;
            --gd-title-size: 18px;
            --gd-viewall-size: 9px;
            --gd-section-pt: 40px;
            --gd-section-pb: 40px;
            --gd-header-mb: 28px;
            --gd-info-pt: 12px;
            --hero-pad: 16px;
            --hero-gap: 12px;
            --gd-qab-size: 22px;
            --gd-qab-font: 12px;
          }
        }

        /* ═══════════════════════════════════════════════════
           CONTAINER
           ═══════════════════════════════════════════════════ */
        .tonet-flagship {
          background-color: #0a0a0a;
          color: #ffffff;
          font-family: var(--font-primary), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          width: 100%;
          min-height: 100vh;
        }

        /* ═══════════════════════════════════════════════════
           HOMEPAGE BODY & NAVBAR OVERRIDES (Black & White Theme)
           ═══════════════════════════════════════════════════ */
         body:has(.tonet-flagship) {
           padding-top: 70px !important;
           background-color: #0a0a0a !important;
         }
         body:has(.tonet-flagship) .erd-header {
           background-color: #0a0a0a !important;
           border-bottom: none !important;
           box-shadow: none !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-logo {
           color: #ffffff !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-nav a {
           color: #ffffff !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-nav a.active {
           background-color: #ffffff !important;
           color: #0a0a0a !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-action-btn,
         body:has(.tonet-flagship) .erd-header .erd-action-link {
           color: #ffffff !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-action-btn svg,
         body:has(.tonet-flagship) .erd-header .erd-action-link svg {
           color: #ffffff !important;
         }
         body:has(.tonet-flagship) .erd-header .erd-action-btn span,
         body:has(.tonet-flagship) .erd-header .erd-action-link span {
           color: #ffffff !important;
         }
        body:has(.tonet-flagship) .ft {
          display: none !important;
        }

        /* ═══════════════════════════════════════════════════
           HERO — SPLIT 1.5 BLOCKS
           ═══════════════════════════════════════════════════ */
        .hero-split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 150vh;
          width: 100%;
          background-color: #0a0a0a;
          overflow: hidden;
          position: relative;
        }
        .hero-split-panel {
          height: 100%;
          width: 100%;
          position: relative;
        }
        .left-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px var(--gd-gutter);
          background-color: #0a0a0a;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
        .hero-brand-content {
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .hero-eyebrow {
          font-family: var(--font-primary), sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.4em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hero-title {
          font-family: var(--font-coolvetica), var(--font-primary), sans-serif;
          font-size: clamp(36px, 5.5vw, 68px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: 0.03em;
          color: #ffffff;
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .hero-description {
          font-family: var(--font-primary), sans-serif;
          font-size: clamp(12px, 1vw, 15px);
          font-weight: 300;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 48px;
        }
        .hero-cta-button {
          font-family: var(--font-ui), var(--font-primary), sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: #0a0a0a;
          background-color: #ffffff;
          padding: 16px 36px;
          text-transform: uppercase;
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
          border: 1px solid #ffffff;
        }
        .hero-cta-button:hover {
          background-color: transparent;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .right-panel {
          overflow: hidden;
          background-color: #121212;
        }
        .hero-slideshow {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .hero-slide-item {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 1;
        }
        .hero-slide-item.active {
          opacity: 1;
          z-index: 2;
        }
        .hero-slide-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, transparent 40%), linear-gradient(to top, rgba(10, 10, 10, 0.4) 0%, transparent 30%);
          z-index: 3;
          pointer-events: none;
        }

        @media (max-width: 767px) {
          .hero-split-section {
            grid-template-columns: 1fr;
            grid-template-rows: 60vh 90vh;
            height: 150vh;
          }
          .left-panel {
            grid-row: 2;
            border-right: none;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding: 32px 20px;
          }
          .right-panel {
            grid-row: 1;
          }
          .hero-title {
            font-size: 34px;
            margin-bottom: 20px;
          }
          .hero-description {
            font-size: 13px;
            margin-bottom: 32px;
          }
        }

        /* ═══════════════════════════════════════════════════
           FOOTER — minimal, matching gutter (Black & White Theme)
           ═══════════════════════════════════════════════════ */
        .gd-footer {
          background-color: #0a0a0a;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 60px var(--gd-gutter);
        }
        .gd-footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .gd-footer-brand {
          font-family: var(--font-display), sans-serif;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
        }
        .gd-footer-copy {
          font-size: 8.5px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }
        @media (max-width: 767px) {
          .gd-footer-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        /* ═══════════════════════════════════════════════════
           QUICK ADD DRAWER — unchanged logic, clean style
           ═══════════════════════════════════════════════════ */
        .qa-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 2000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .qa-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .qa-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 840px;
          max-width: 100%;
          background: #ffffff;
          z-index: 2001;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid #e5e5e5;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
        }
        .qa-drawer.open {
          transform: translateX(0);
        }

        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
        }
        .qa-header-title {
          font-family: var(--font-brand), sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #121212;
        }
        .qa-close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          color: #121212;
          line-height: 1;
        }

        .qa-content-grid {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .qa-media-side {
          flex: 1;
          background: #fcfcfc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          overflow: hidden;
        }
        .qa-media-side img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .qa-drawer img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .qa-details-side {
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 40px 32px;
          overflow-y: auto;
          border-left: 1px solid #e5e5e5;
        }

        .qa-product-title {
          font-family: var(--font-brand), sans-serif;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #121212;
          margin-bottom: 12px;
        }
        .qa-product-price {
          font-family: var(--font-ui), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #121212;
          margin-bottom: 4px;
        }
        .qa-tax-note {
          font-size: 10px;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 28px;
          letter-spacing: 0.04em;
        }

        .qa-selectors-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .qa-option-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .qa-option-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #121212;
        }
        .qa-swatches-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Color Swatch */
        .qa-color-swatch {
          width: 38px;
          height: 28px;
          border: 1px solid #dcdcdc;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease;
          border-radius: 0;
        }
        .qa-color-swatch:hover {
          border-color: #121212;
        }
        .qa-color-swatch.active {
          border: 2px solid #121212;
        }

        /* Size Swatch */
        .qa-size-swatch {
          border: 1px solid #dcdcdc;
          background: #ffffff;
          color: #121212;
          min-width: 42px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
          border-radius: 0;
          padding: 0 8px;
        }
        .qa-size-swatch:hover {
          border-color: #121212;
        }
        .qa-size-swatch.active {
          border: 2px solid #121212;
          font-weight: 700;
        }

        /* Actions row */
        .qa-actions-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 32px;
          flex-shrink: 0;
        }
        .qa-quantity-selector {
          display: inline-flex;
          align-items: center;
          border: 1px solid #121212;
          height: 44px;
          width: 100px;
          flex-shrink: 0;
        }
        .qa-quantity-btn {
          width: 32px;
          height: 100%;
          background: none;
          border: none;
          color: #121212;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qa-quantity-value {
          flex: 1;
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: #121212;
        }

        .qa-add-btn {
          flex: 1;
          height: 44px;
          background: #ffffff;
          color: #121212;
          border: 1px solid #121212;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.25s ease, color 0.25s ease;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .qa-add-btn:hover {
          background: #121212;
          color: #ffffff;
        }
        .qa-add-btn:disabled {
          border-color: #cccccc;
          color: #888888;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        @media (max-width: 767px) {
          .qa-drawer {
            width: 100%;
          }
          .qa-content-grid {
            flex-direction: column;
            overflow-y: auto;
          }
          .qa-media-side {
            height: 280px;
            flex: none;
            padding: 16px;
          }
          .qa-details-side {
            width: 100%;
            border-left: none;
            border-top: 1px solid #e5e5e5;
            padding: 24px 20px;
          }
          .qa-actions-row {
            margin-top: 24px;
          }
        }
      `}</style>
    </>
  );
}
