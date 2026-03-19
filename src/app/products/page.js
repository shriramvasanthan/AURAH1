'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CategoryEffects from '@/components/CategoryEffects';
import { Suspense } from 'react';

function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL PRODUCTS');
    const searchParams = useSearchParams();

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        const url = activeCategory === 'ALL PRODUCTS' ? '/api/products' : `/api/products?category=${activeCategory}`;
        fetch(url)
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
                else {
                    console.error('Products fetch failed:', data);
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setProducts([]);
            });
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

    const categories = ['ALL PRODUCTS', 'Spices', 'Nuts'];

    return (
        <>
            <CategoryEffects category={activeCategory} />

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-bg" />
                <div className="container">
                    <div className="section-label" style={{ justifyContent: 'center' }}>Our Collection</div>
                    <h1 className="page-title">
                        <span className="gold-text">{activeCategory.toUpperCase()}</span>
                    </h1>
                    <p className="page-subtitle">
                        Explore our full range of hand-picked spices and premium nuts
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="container filter-inner">
                    <div className="filter-tabs-scroll">
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
                    </div>
                    <div className="products-count">
                        {!loading && <span>{products.length} products</span>}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container products-container">
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
                            <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 0.07}s` }}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .page-header {
                    padding: 120px 0 60px;
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
                    font-size: clamp(2rem, 6vw, 5rem);
                    margin-bottom: 12px;
                }
                .page-subtitle {
                    color: var(--muted);
                    font-size: clamp(0.82rem, 2vw, 0.95rem);
                    max-width: 400px;
                    margin: 0 auto;
                    line-height: 1.6;
                }
                .filter-bar {
                    position: sticky;
                    top: 60px;
                    background: rgba(245, 237, 214, 0.97);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(192, 82, 42, 0.12);
                    z-index: 100;
                }
                .filter-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    min-height: 52px;
                }
                .filter-tabs-scroll {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    flex: 1;
                }
                .filter-tabs-scroll::-webkit-scrollbar { display: none; }
                .filter-tabs {
                    display: flex;
                    align-items: center;
                }
                .filter-tab {
                    position: relative;
                    background: none;
                    border: none;
                    color: var(--muted);
                    padding: 16px 20px;
                    font-family: var(--font-display);
                    font-size: 0.68rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: color 0.3s;
                    white-space: nowrap;
                    min-height: 52px;
                    flex-shrink: 0;
                    -webkit-tap-highlight-color: transparent;
                }
                .filter-tab:hover { color: var(--gold); }
                .filter-tab.active { color: var(--gold-dark); font-weight: 700; }
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
                    font-size: 0.62rem;
                    letter-spacing: 0.2em;
                    color: var(--muted);
                    text-transform: uppercase;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .products-container {
                    padding-top: 40px;
                    padding-bottom: 80px;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 28px;
                    min-height: 400px;
                }
                .skeleton-card {
                    width: 100%;
                    aspect-ratio: 1/1.4;
                    border-radius: 4px;
                    background: rgba(192, 82, 42, 0.04);
                    border: 1px solid rgba(192, 82, 42, 0.08);
                }
                .empty-state {
                    text-align: center;
                    padding: 80px 24px;
                    color: var(--muted);
                }
                .empty-icon {
                    font-size: 3.5rem;
                    color: rgba(201, 168, 76, 0.2);
                    margin-bottom: 20px;
                }
                .empty-state h3 {
                    font-family: var(--font-display);
                    font-size: 1.4rem;
                    color: var(--white);
                    margin-bottom: 8px;
                }
                @media (max-width: 768px) {
                    .products-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                        min-height: unset;
                    }
                    .page-header { padding: 100px 0 40px; }
                    .filter-tab { padding: 14px 14px; font-size: 0.6rem; }
                }
                @media (max-width: 480px) {
                    .products-grid {
                        grid-template-columns: 1fr;
                        gap: 14px;
                    }
                    .page-header { padding: 90px 0 32px; }
                    .products-container { padding-top: 24px; padding-bottom: 60px; }
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
