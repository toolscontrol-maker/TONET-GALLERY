'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CollectionDetail, Product } from '@/lib/shopify';

interface Props {
  collection: CollectionDetail;
}

const getGarmentType = (product: Product): 'tops' | 'bottoms' | 'outerwear' => {
  const title = product.title.toLowerCase();
  const tags = product.tags.map(t => t.toLowerCase());

  const isOuterwear = tags.includes('outerwear') || tags.includes('jacket') || tags.includes('coat') || title.includes('jacket') || title.includes('coat') || title.includes('bomber') || title.includes('trench') || title.includes('hoodie');
  const isBottoms = tags.includes('pants') || tags.includes('shorts') || tags.includes('bottoms') || tags.includes('trousers') || title.includes('shorts') || title.includes('pants') || title.includes('trousers') || title.includes('jogger');

  if (isOuterwear) return 'outerwear';
  if (isBottoms) return 'bottoms';
  return 'tops';
};

const isProductAvailable = (product: Product): boolean => {
  return product.variants.some(v => v.availableForSale);
};

const formatProductPrice = (priceVal: number, currencyCode?: string) => {
  const symbol = currencyCode === 'USD' ? '$' : '€';
  return `${priceVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${symbol}`;
};

function ProductCard({ product }: { product: Product }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.imageUrl) return [product.imageUrl];
    return [];
  }, [product.images, product.imageUrl]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const available = isProductAvailable(product);
  const price = formatProductPrice(product.price, product.currencyCode);

  return (
    <Link href={`/product/${product.handle}`} className="erd-coll-card">
      <div className="erd-coll-img-wrap">
        {images.length > 0 ? (
          <img 
            src={images[currentImgIdx]} 
            alt={product.title} 
            className="erd-coll-img"
            loading="lazy"
          />
        ) : (
          <div className="erd-coll-no-img">NO IMAGE AVAILABLE</div>
        )}

        {/* Carousel Arrows (Visible on hover if there are multiple images) */}
        {images.length > 1 && (
          <>
            <button className="erd-carousel-arrow prev" onClick={handlePrev} aria-label="Previous image">
              &lt;
            </button>
            <button className="erd-carousel-arrow next" onClick={handleNext} aria-label="Next image">
              &gt;
            </button>
          </>
        )}

        {/* Carousel Indicators removed */}
      </div>
      
      <div className="erd-coll-meta">
        <h2 className="erd-coll-card-title">{product.title.toUpperCase()}</h2>
        <p className="erd-coll-card-price">
          {available ? price : 'SOLD OUT'}
        </p>
      </div>
    </Link>
  );
}

const collectionsList = [
  { title: 'Private Sale', handle: 'private-sale' },
  { title: 'Women', handle: 'women' },
  { title: 'Men', handle: 'men' },
  { title: 'Children', handle: 'children' },
  { title: 'Curb', handle: 'curb' },
  { title: 'Maison Tonet', handle: 'maison-tonet' }
];

export default function CollectionClient({ collection }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tops' | 'bottoms' | 'outerwear'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold-out'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [gridColumns, setGridColumns] = useState<3 | 6>(3);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [mobileGridColumns, setMobileGridColumns] = useState<2 | 3>(3);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (availabilityFilter !== 'all') count++;
    if (sortOrder !== 'default') count++;
    return count;
  }, [categoryFilter, availabilityFilter, sortOrder]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...collection.products];

    // Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter(p => getGarmentType(p) === categoryFilter);
    }

    // Availability Filter
    if (availabilityFilter !== 'all') {
      result = result.filter(p => {
        const avail = isProductAvailable(p);
        return availabilityFilter === 'available' ? avail : !avail;
      });
    }

    // Sort Order
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [collection.products, categoryFilter, availabilityFilter, sortOrder]);

  return (
    <div className="erd-collection-page">
      {/* HEADER SECTION */}
      <div className="erd-coll-header">
        <div className="erd-coll-title-container">
          <button 
            className="erd-coll-title-btn"
            onClick={() => setShowTitleDropdown(!showTitleDropdown)}
          >
            <span>{collection.title.toUpperCase()}</span>
            <svg 
              className={`erd-coll-arrow-svg ${showTitleDropdown ? 'open' : ''}`} 
              width="8" 
              height="8" 
              viewBox="0 0 10 10" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2"
            >
              <path d="M1 3L5 7L9 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {showTitleDropdown && (
            <div className="erd-coll-title-dropdown">
              <div className="erd-coll-title-dropdown-content">
                {collectionsList.map((col) => (
                  <Link 
                    key={col.handle} 
                    href={`/collection/${col.handle}`}
                    className={`erd-coll-title-dropdown-link ${collection.handle === col.handle ? 'active' : ''}`}
                    onClick={() => setShowTitleDropdown(false)}
                  >
                    {col.title.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="erd-coll-controls">
          <button 
            className="erd-grid-toggle-btn erd-desktop-only"
            onClick={() => setGridColumns(prev => prev === 3 ? 6 : 3)}
          >
            {gridColumns === 3 ? 'VER POR 6' : 'VER POR 3'}
          </button>
          <button 
            className={`erd-filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            FILTRAR
            <svg className="erd-coll-arrow-svg" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 3L5 7L9 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* FILTER DRAWER / PANEL */}
      {showFilters && (
        <>
          {/* Backdrop click overlay */}
          <div className="erd-filters-backdrop" onClick={() => setShowFilters(false)} />
          
          <div className="erd-coll-filters-drawer">
            {/* Drawer Header */}
            <div className="erd-mobile-filter-header">
              <span className="erd-mobile-filter-title">FILTROS</span>
              <button 
                className="erd-mobile-filter-close"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="erd-coll-filters-content-wrapper">
              <div className="erd-coll-filter-group">
                <span className="erd-coll-filter-label">CATEGORÍA</span>
                <div className="erd-coll-filter-options">
                  {(['all', 'tops', 'bottoms', 'outerwear'] as const).map(cat => (
                    <button
                      key={cat}
                      className={`erd-coll-filter-option-btn ${categoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      <span className="erd-filter-radio-icon">
                        {categoryFilter === cat ? '●' : '○'}
                      </span>
                      {cat === 'all' ? 'VER TODO' : cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="erd-coll-filter-group">
                <span className="erd-coll-filter-label">DISPONIBILIDAD</span>
                <div className="erd-coll-filter-options">
                  {(['all', 'available', 'sold-out'] as const).map(avail => (
                    <button
                      key={avail}
                      className={`erd-coll-filter-option-btn ${availabilityFilter === avail ? 'active' : ''}`}
                      onClick={() => setAvailabilityFilter(avail)}
                    >
                      <span className="erd-filter-radio-icon">
                        {availabilityFilter === avail ? '●' : '○'}
                      </span>
                      {avail === 'all' ? 'MOSTRAR TODO' : avail === 'sold-out' ? 'AGOTADO' : 'DISPONIBLE'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="erd-coll-filter-group">
                <span className="erd-coll-filter-label">ORDENAR</span>
                <div className="erd-coll-filter-options">
                  <button
                    className={`erd-coll-filter-option-btn ${sortOrder === 'default' ? 'active' : ''}`}
                    onClick={() => setSortOrder('default')}
                  >
                    <span className="erd-filter-radio-icon">
                      {sortOrder === 'default' ? '●' : '○'}
                    </span>
                    ORDENAR POR DEFECTO
                  </button>
                  <button
                    className={`erd-coll-filter-option-btn ${sortOrder === 'price-asc' ? 'active' : ''}`}
                    onClick={() => setSortOrder('price-asc')}
                  >
                    <span className="erd-filter-radio-icon">
                      {sortOrder === 'price-asc' ? '●' : '○'}
                    </span>
                    PRECIO: BAJO A ALTO
                  </button>
                  <button
                    className={`erd-coll-filter-option-btn ${sortOrder === 'price-desc' ? 'active' : ''}`}
                    onClick={() => setSortOrder('price-desc')}
                  >
                    <span className="erd-filter-radio-icon">
                      {sortOrder === 'price-desc' ? '●' : '○'}
                    </span>
                    PRECIO: ALTO A BAJO
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="erd-filter-actions-bottom">
              <button 
                className="erd-filter-action-btn-clear"
                onClick={() => {
                  setCategoryFilter('all');
                  setAvailabilityFilter('all');
                  setSortOrder('default');
                }}
              >
                SUPRIMIR
              </button>
              <button 
                className="erd-filter-action-btn-apply"
                onClick={() => setShowFilters(false)}
              >
                APLICAR ({activeFiltersCount})
              </button>
            </div>
          </div>
        </>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className={`erd-coll-grid columns-${gridColumns} mobile-columns-${mobileGridColumns}`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      ) : (
        <div className="erd-coll-empty">
          <p>NO PRODUCTS FOUND MATCHING YOUR SELECTION.</p>
        </div>
      )}

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <div className="erd-coll-mobile-bottom-bar">
        <button 
          className="erd-coll-mobile-bottom-btn"
          onClick={() => setMobileGridColumns(prev => prev === 3 ? 2 : 3)}
        >
          {mobileGridColumns === 3 ? 'VER POR 2' : 'VER POR 3'}
        </button>
        <button 
          className="erd-coll-mobile-bottom-btn"
          onClick={() => setShowFilters(true)}
        >
          FILTRAR
        </button>
      </div>

      <style>{`
        .erd-collection-page {
          background-color: #ffffff;
          color: #000000;
          min-height: 100vh;
          padding: 40px 40px 120px 40px;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }

        /* HEADER */
        .erd-coll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          margin-top: 10px;
        }
        
        /* TITLE DROPDOWN */
        .erd-coll-title-container {
          position: relative;
          display: inline-block;
        }
        .erd-coll-title-btn {
          background: none;
          border: none;
          padding: 8px 12px;
          margin: 0;
          cursor: pointer;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #000000;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          outline: none;
          transition: opacity 0.3s ease;
        }
        .erd-coll-title-btn:hover {
          opacity: 0.7;
        }
        .erd-coll-arrow-svg {
          transition: transform 0.3s ease;
          display: inline-block;
          vertical-align: middle;
          margin-top: -1px;
          opacity: 0.8;
        }
        .erd-coll-arrow-svg.open {
          transform: rotate(180deg);
        }
        
        .erd-coll-title-dropdown {
          position: fixed;
          top: 92px; /* 70px header + 22px banner */
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ffffff;
          z-index: 999;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .erd-coll-title-dropdown-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px;
        }
        .erd-coll-title-dropdown-link {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #000000;
          opacity: 0.5;
          transition: opacity 0.3s ease, font-weight 0.3s ease;
          padding: 8px 16px;
        }
        .erd-coll-title-dropdown-link:hover {
          opacity: 0.9;
        }
        .erd-coll-title-dropdown-link.active {
          opacity: 1;
          font-weight: 700;
        }

        .erd-coll-controls {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .erd-grid-toggle-btn,
        .erd-filter-btn {
          background: none;
          border: none;
          padding: 8px 0;
          margin: 0;
          cursor: pointer;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #000000;
          transition: opacity 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .erd-grid-toggle-btn:hover,
        .erd-filter-btn:hover {
          opacity: 0.5;
        }

        /* FILTERS BACKDROP AND DRAWERS (DESKTOP SIDEBAR) */
        .erd-filters-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.15);
          z-index: 999;
          animation: fadeIn 0.2s ease-out;
        }

        .erd-coll-filters-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 450px;
          background-color: #ffffff;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          border-left: 1px solid #eaeaea;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
          margin: 0;
          padding: 0;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .erd-coll-filters-content-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .erd-mobile-filter-header {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          border-bottom: 1px solid #eaeaea;
          position: relative;
          width: 100%;
          flex-shrink: 0;
          background-color: #ffffff;
        }
        .erd-mobile-filter-title {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #000000;
        }
        .erd-mobile-filter-close {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #000000;
          outline: none;
        }

        .erd-coll-filter-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .erd-coll-filter-label {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #000000;
          width: auto;
          margin-bottom: 4px;
        }
        .erd-coll-filter-options {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
        }
        .erd-coll-filter-option-btn {
          display: flex;
          align-items: center;
          width: 100%;
          text-align: left;
          padding: 8px 0 !important;
          background: none !important;
          border: none !important;
          color: #000000 !important;
          font-size: 11px !important;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0 !important;
          transform: none !important;
          opacity: 1 !important;
          transition: opacity 0.2s ease;
        }
        .erd-coll-filter-option-btn:hover {
          opacity: 0.6 !important;
        }
        .erd-coll-filter-option-btn.active {
          font-weight: 400 !important;
          text-decoration: none !important;
        }

        .erd-filter-radio-icon {
          display: inline-block;
          margin-right: 12px;
          font-size: 12px;
          line-height: 1;
          color: #000000;
          width: 14px;
          height: 14px;
          text-align: center;
        }

        .erd-filter-actions-bottom {
          display: flex;
          width: 100%;
          height: 50px;
          flex-shrink: 0;
          border-top: 1px solid #eaeaea;
        }
        .erd-filter-action-btn-clear {
          flex: 1;
          height: 100%;
          background-color: #eaeaea;
          color: #000000;
          border: none;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          outline: none;
        }
        .erd-filter-action-btn-clear:hover {
          background-color: #e0e0e0;
        }
        .erd-filter-action-btn-apply {
          flex: 1;
          height: 100%;
          background-color: #000000;
          color: #ffffff;
          border: none;
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          outline: none;
        }
        .erd-filter-action-btn-apply:hover {
          opacity: 0.9;
        }

        /* PRODUCTS GRID WITH THIN OUTLINES */
        .erd-coll-grid {
          display: grid;
          gap: 0;
          border-top: 1px solid #eaeaea;
          border-left: 1px solid #eaeaea;
          width: 100%;
        }
        .erd-coll-grid.columns-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        .erd-coll-grid.columns-6 {
          grid-template-columns: repeat(6, 1fr);
        }

        /* PRODUCT CARD */
        .erd-coll-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          border-right: 1px solid #eaeaea;
          border-bottom: 1px solid #eaeaea;
          box-sizing: border-box;
        }
        .erd-coll-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 10 / 16;
          background-color: #f6f6f6;
          overflow: hidden;
        }
        .erd-coll-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 24px;
          box-sizing: border-box;
        }
        
        /* Carousel Navigation Controls */
        .erd-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #000000;
          font-size: 20px;
          font-family: monospace;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.2s ease;
          padding: 12px;
          outline: none;
        }
        .erd-carousel-arrow.prev {
          left: 8px;
        }
        .erd-carousel-arrow.next {
          right: 8px;
        }
        .erd-coll-card:hover .erd-carousel-arrow {
          opacity: 0.35;
        }
        .erd-carousel-arrow:hover {
          opacity: 0.95 !important;
          transform: translateY(-50%) scale(1.15);
        }

        /* METADATA */
        .erd-coll-meta {
          text-align: center;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background-color: #ffffff;
        }
        .erd-coll-card-title {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #000000;
          margin: 0;
          line-height: 1.3;
        }
        .erd-coll-card-price {
          font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #000000;
          margin: 0;
        }

        .erd-coll-empty {
          text-align: center;
          padding: 120px 0;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #888888;
        }

        /* STICKY BOTTOM BAR (MOBILE ONLY) */
        .erd-coll-mobile-bottom-bar {
          display: none;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 767px) {
          .erd-collection-page {
            padding: 20px 0 100px 0; /* full bleed! zero horizontal spacing */
          }
          .erd-coll-header {
            margin-bottom: 20px;
            margin-top: 10px;
            justify-content: center; /* center title container on mobile */
            padding: 0 16px;
          }
          .erd-coll-title-container {
            margin: 0 auto;
          }
          .erd-coll-title-dropdown {
            top: 82px; /* 60px mobile header + 22px banner */
          }
          
          /* Hide top desktop-only controls */
          .erd-coll-controls {
            display: none;
          }

          /* Hide metadata text on mobile to display only images */
          .erd-coll-meta {
            display: none !important;
          }

          /* Grid full bleed and thin white separators */
          .erd-coll-grid {
            border-left: none;
            border-top: 1px solid #ffffff;
            background-color: #ffffff;
          }
          .erd-coll-card {
            border-right: 1px solid #ffffff;
            border-bottom: 1px solid #ffffff;
            background-color: #f6f6f6;
          }
          .erd-coll-img-wrap {
            background-color: #f6f6f6;
          }
          .erd-coll-img {
            padding: 12px; /* compact display */
          }

          /* STICKY BOTTOM BAR */
          .erd-coll-mobile-bottom-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            background-color: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border-top: 1px solid rgba(234, 234, 234, 0.6);
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 99;
          }
          .erd-coll-mobile-bottom-btn {
            background: none;
            border: none;
            color: #000000;
            font-family: var(--font-helvetica-roman), 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            padding: 8px 12px;
            outline: none;
          }

          /* FULL-SCREEN MOBILE FILTER DRAWER */
          .erd-coll-filters-drawer {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            border-left: none;
            z-index: 1000;
          }
          .erd-coll-filters-content-wrapper {
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
}
