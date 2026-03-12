'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const searchParams = useSearchParams();

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        const url = activeCategory === 'All' ? '/api/products' : `/api/products?category=${activeCategory}`;
        fetch(url)
            .then((r) => r.json())
            .then((data) => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [activeCategory]);

    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
            { threshold: 0.1 }
        );
        reveals.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [products]);

    const categories = ['All', 'Spices', 'Nuts'];

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-bg" />
                <div className="container">
                    <div className="section-label" style={{ justifyContent: 'center' }}>Our Collection</div>
                    <h1 className="page-title">
                        <span className="gold-text">All</span> Products
                    </h1>
                    <p className="page-subtitle">
                        Explore our full range of hand-picked spices and premium nuts
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="container filter-inner">
                    <div className="filter-tabs">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                                {activeCategory === cat && <span className="tab-indicator" />}
                            </button>
                        ))}
                    </div>
                    <div className="products-count">
                        {!loading && <span>{products.length} products</span>}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container" style={{ paddingTop: '48px', paddingBottom: '100px' }}>
                {loading ? (
                    <div className="products-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✦</div>
                        <h3>No products found</h3>
                        <p>Try a different category or check back later.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((p, i) => (
                            <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 0.08}s` }}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .page-header {
          padding: 160px 0 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .page-header-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(192,82,42,0.08) 0%, transparent 70%);
          border-bottom: 1px solid rgba(192, 82, 42, 0.12);
        }
        .page-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          margin-bottom: 16px;
        }
        .page-subtitle {
          color: var(--muted);
          font-size: 0.95rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .filter-bar {
          position: sticky;
          top: 70px;
          background: rgba(245, 237, 214, 0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(192, 82, 42, 0.12);
          z-index: 100;
          padding: 0;
        }
        .filter-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0;
          padding-bottom: 0;
        }
        .filter-tabs {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .filter-tab {
          position: relative;
          background: none;
          border: none;
          color: var(--muted);
          padding: 20px 28px;
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s;
        }
        .filter-tab:hover { color: var(--gold); }
        .filter-tab.active { color: var(--gold-dark); }
        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          background: var(--gold);
          animation: fadeInUp 0.2s ease;
        }
        .products-count {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .skeleton-card {
          height: 400px;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--dark-2) 25%, var(--dark-3) 50%, var(--dark-2) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
        .empty-state {
          text-align: center;
          padding: 100px 40px;
          color: var(--muted);
        }
        .empty-icon {
          font-size: 4rem;
          color: rgba(201, 168, 76, 0.2);
          margin-bottom: 24px;
        }
        .empty-state h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--white);
          margin-bottom: 8px;
        }
      `}</style>
        </>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--black)' }} />}>
            <ProductsContent />
        </Suspense>
    );
}
