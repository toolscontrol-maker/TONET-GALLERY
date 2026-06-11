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

const getProductColor = (product: Product): string => {
  const seen = new Set<string>();
  for (const v of product.variants) {
    const opt = v.selectedOptions.find(o => {
      const n = o.name.toLowerCase();
      return n === 'color' || n === 'colour';
    });
    if (opt) seen.add(opt.value.toUpperCase());
  }
  return seen.size > 0 ? Array.from(seen).join(' / ') : 'BLACK';
};

const isProductAvailable = (product: Product): boolean => {
  return product.variants.some(v => v.availableForSale);
};

const formatProductPrice = (priceVal: number, currencyCode?: string) => {
  const symbol = currencyCode === 'USD' ? '$' : '€';
  return `${symbol}${priceVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function CollectionClient({ collection }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tops' | 'bottoms' | 'outerwear'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold-out'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Page title mapping
  const pageTitle = useMemo(() => {
    const handle = collection.handle.toLowerCase();
    if (handle === 'men' || handle === 'homme') return 'HOMME > NEW ARRIVALS';
    if (handle === 'women' || handle === 'femme') return 'FEMME > NEW ARRIVALS';
    return `${collection.title.toUpperCase()} > ALL`;
  }, [collection.handle, collection.title]);

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
        <h1 className="erd-coll-title">{pageTitle}</h1>
        <button 
          className={`erd-coll-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          FILTERS
        </button>
      </div>

      {/* FILTER DRAWER / PANEL */}
      {showFilters && (
        <div className="erd-coll-filters-drawer">
          <div className="erd-coll-filter-group">
            <span className="erd-coll-filter-label">CATEGORY</span>
            <div className="erd-coll-filter-options">
              {(['all', 'tops', 'bottoms', 'outerwear'] as const).map(cat => (
                <button
                  key={cat}
                  className={`erd-coll-filter-option-btn ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="erd-coll-filter-group">
            <span className="erd-coll-filter-label">AVAILABILITY</span>
            <div className="erd-coll-filter-options">
              {(['all', 'available', 'sold-out'] as const).map(avail => (
                <button
                  key={avail}
                  className={`erd-coll-filter-option-btn ${availabilityFilter === avail ? 'active' : ''}`}
                  onClick={() => setAvailabilityFilter(avail)}
                >
                  {avail === 'sold-out' ? 'SOLD OUT' : avail.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="erd-coll-filter-group">
            <span className="erd-coll-filter-label">SORT</span>
            <div className="erd-coll-filter-options">
              <button
                className={`erd-coll-filter-option-btn ${sortOrder === 'default' ? 'active' : ''}`}
                onClick={() => setSortOrder('default')}
              >
                DEFAULT
              </button>
              <button
                className={`erd-coll-filter-option-btn ${sortOrder === 'price-asc' ? 'active' : ''}`}
                onClick={() => setSortOrder('price-asc')}
              >
                PRICE: LOW TO HIGH
              </button>
              <button
                className={`erd-coll-filter-option-btn ${sortOrder === 'price-desc' ? 'active' : ''}`}
                onClick={() => setSortOrder('price-desc')}
              >
                PRICE: HIGH TO LOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="erd-coll-grid">
          {filteredProducts.map(product => {
            const color = getProductColor(product);
            const available = isProductAvailable(product);
            const price = formatProductPrice(product.price, product.currencyCode);
            const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;

            return (
              <Link 
                key={product.handle} 
                href={`/product/${product.handle}`} 
                className="erd-coll-card"
              >
                <div className="erd-coll-img-wrap">
                  {product.imageUrl ? (
                    <>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="erd-coll-img erd-coll-img-primary"
                        loading="lazy"
                      />
                      {secondImage && (
                        <img 
                          src={secondImage} 
                          alt={`${product.title} alternate`} 
                          className="erd-coll-img erd-coll-img-secondary"
                          loading="lazy"
                        />
                      )}
                    </>
                  ) : (
                    <div className="erd-coll-no-img">NO IMAGE AVAILABLE</div>
                  )}
                </div>
                
                <div className="erd-coll-meta">
                  <h2 className="erd-coll-card-title">{product.title.toUpperCase()}</h2>
                  <p className="erd-coll-card-color">{color}</p>
                  <p className="erd-coll-card-price">
                    {available ? price : 'SOLD OUT'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="erd-coll-empty">
          <p>NO PRODUCTS FOUND MATCHING YOUR SELECTION.</p>
        </div>
      )}

      <style>{`
        .erd-collection-page {
          background-color: #ffffff;
          color: #000000;
          min-height: 100vh;
          padding: 40px 32px 120px 32px;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }

        /* HEADER */
        .erd-coll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          margin-top: 20px;
        }
        .erd-coll-title {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #000000;
          margin: 0;
        }
        .erd-coll-filter-btn {
          background-color: #000000;
          color: #ffffff;
          border: none;
          padding: 10px 24px;
          font-size: 10.2px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0;
          transition: background-color 0.2s ease, opacity 0.2s ease;
        }
        .erd-coll-filter-btn:hover {
          opacity: 0.8;
          background-color: #000000;
          transform: none;
        }
        .erd-coll-filter-btn:active {
          transform: none;
        }

        /* FILTERS DRAWER */
        .erd-coll-filters-drawer {
          border-top: 1px solid #000000;
          border-bottom: 1px solid #000000;
          padding: 24px 0;
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .erd-coll-filter-group {
          display: flex;
          align-items: baseline;
          gap: 40px;
        }
        .erd-coll-filter-label {
          font-size: 9.35px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #888888;
          width: 120px;
          flex-shrink: 0;
        }
        .erd-coll-filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .erd-coll-filter-option-btn {
          background: none !important;
          border: none !important;
          color: #000000 !important;
          padding: 0 !important;
          font-size: 10.2px;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0 !important;
          transform: none !important;
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }
        .erd-coll-filter-option-btn:hover {
          opacity: 0.7;
        }
        .erd-coll-filter-option-btn.active {
          opacity: 1;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* PRODUCTS GRID */
        .erd-coll-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px 32px;
        }

        /* PRODUCT CARD */
        .erd-coll-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .erd-coll-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background-color: #ffffff;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .erd-coll-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s ease;
        }
        .erd-coll-img-secondary {
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        
        /* Hover show secondary image */
        .erd-coll-card:hover .erd-coll-img-primary {
          opacity: 0;
        }
        .erd-coll-card:hover .erd-coll-img-secondary {
          opacity: 1;
        }

        .erd-coll-no-img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9.35px;
          letter-spacing: 0.1em;
          color: #888888;
          background-color: #f7f7f7;
        }

        /* METADATA */
        .erd-coll-meta {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .erd-coll-card-title {
          font-size: 11.9px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #000000;
          margin: 0;
          line-height: 1.2;
        }
        .erd-coll-card-color {
          font-size: 10.2px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #555555;
          margin: 0;
          text-transform: uppercase;
        }
        .erd-coll-card-price {
          font-size: 10.2px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #000000;
          margin: 0;
        }

        .erd-coll-empty {
          text-align: center;
          padding: 120px 0;
          font-size: 10.2px;
          letter-spacing: 0.1em;
          color: #888888;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 767px) {
          .erd-collection-page {
            padding: 104px 16px 80px 16px;
          }
          .erd-coll-header {
            margin-bottom: 24px;
          }
          .erd-coll-title {
            font-size: 13.6px;
          }
          .erd-coll-filter-btn {
            padding: 8px 16px;
            font-size: 9.35px;
          }
          .erd-coll-filters-drawer {
            gap: 16px;
            margin-bottom: 32px;
          }
          .erd-coll-filter-group {
            flex-direction: column;
            gap: 8px;
          }
          .erd-coll-filter-label {
            width: auto;
          }
          .erd-coll-filter-options {
            gap: 16px;
          }
          
          /* Mobile Viewport Model: 1-column grid, large blocks taking around 0.7vh */
          .erd-coll-grid {
            grid-template-columns: 1fr;
            gap: 80px;
          }
          .erd-coll-img-wrap {
            height: 60vh;
            aspect-ratio: auto;
            margin-bottom: 16px;
          }
          .erd-coll-img {
            object-fit: contain;
          }
        }
      `}</style>
    </div>
  );
}
