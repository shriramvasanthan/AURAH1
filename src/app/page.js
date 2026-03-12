'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ParticleHero from '@/components/ParticleHero';
import ProductCard from '@/components/ProductCard';

// Counter animation hook
function useCounter(end, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, started]);
  return count;
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const heroLines = ['Premium', 'Spices &', 'Nuts'];

  const years = useCounter(25, 2000, statsVisible);
  const productsCount = useCounter(50, 2000, statsVisible);
  const ordersCount = useCounter(10000, 2500, statsVisible);
  const countries = useCounter(30, 2000, statsVisible);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else console.error('Featured products fetch failed:', data);
      })
      .catch(console.error);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const spiceWords = [
    'Cardamom', '✦', 'Black Pepper', '✦', 'Fenugreek', '✦', 'Cashews', '✦',
    'Cinnamon', '✦', 'Turmeric', '✦', 'Star Anise', '✦', 'Cloves', '✦',
    'Almonds', '✦', 'Fennel', '✦', 'Pure Spices', '✦', 'Authentic Taste', '✦',
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <ParticleHero />
        <div className="hero-bg-grid" />
        <div className="hero-content">
          <div className="hero-label reveal">
            <span className="hero-label-line" />
            Est. 1998 — Premium Spice House
            <span className="hero-label-line" />
          </div>
          <h1 className="hero-title">
            {heroLines.map((line, i) => (
              <span key={i} className="hero-line" style={{ animationDelay: `${i * 0.2}s` }}>
                {i === 1 ? (
                  <>
                    <em className="italic-word">Spices</em>
                    <span> & </span>
                  </>
                ) : null}
                {i !== 1 ? <span className="gold-text">{line}</span> : null}
                {i === 1 ? <span className="gold-text">Nuts</span> : null}
              </span>
            ))}
          </h1>

          <p className="hero-desc reveal" style={{ animationDelay: '0.7s' }}>
            Hand-picked from the world's finest farms, our spices and nuts are a
            celebration of <em>authentic flavour</em> — pure, potent, and premium.
          </p>

          <div className="hero-cta reveal" style={{ animationDelay: '1s' }}>
            <Link href="/products" className="btn-gold">
              Explore Collection
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#story" className="btn-outline">Our Story</Link>
          </div>

          <div className="hero-scroll-hint">
            <div className="scroll-line" />
            <span>Scroll</span>
          </div>
        </div>

        <div className="hero-side-text">AURAH SPICES</div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...spiceWords, ...spiceWords].map((word, i) => (
            <span key={i} className="marquee-item">
              {word === '✦' ? <span className="marquee-dot marquee-star">✦</span> : word}
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-label reveal">
            Our Finest Selection
          </div>
          <h2 className="section-title reveal">
            <span className="gold-text">Featured</span> Products
          </h2>
          <p className="section-desc reveal">
            The jewels of our collection — time-honoured spices and premium nuts,
            ethically sourced and carefully curated for the discerning palate.
          </p>
          <div className="products-grid" style={{ marginTop: '48px' }}>
            {products.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))
              : products.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link href="/products" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ===== STORY ===== */}
      <section className="story-section section" id="story">
        <div className="container">
          <div className="story-grid">
            <div className="story-visual reveal">
              <div className="story-img-container">
                <div className="story-orb story-orb-1" />
                <div className="story-orb story-orb-2" />
                <div className="story-img-placeholder">
                  <span className="story-icon">✦</span>
                  <span className="story-text-overlay">AURAH</span>
                </div>
              </div>
              <div className="story-badge">
                <div className="badge-ring">
                  <span>25 YEARS OF</span>
                  <span className="badge-main">EXCELLENCE</span>
                </div>
              </div>
            </div>
            <div className="story-content">
              <div className="section-label reveal">Our Heritage</div>
              <h2 className="section-title reveal">
                A Legacy of <span className="gold-text">Purity</span>
              </h2>
              <p className="story-para reveal">
                Founded in 1998 in the spice markets of South Asia, AURAH was born from
                a simple belief: <em>great food begins with great spices</em>. Our founders
                travelled across India, Sri Lanka, and the Middle East, forging relationships
                with farmers who shared our passion for purity.
              </p>
              <p className="story-para reveal">
                Today, we source over 50 spices and nuts from 30+ countries, ensuring
                every grain, pod, and kernel that reaches you carries the soul of its origin.
                No fillers. No shortcuts. Just nature, perfected.
              </p>
              <div className="story-features reveal">
                {['100% Natural', 'Farm Direct', 'lab Tested', 'Sustainably Sourced'].map((f) => (
                  <div key={f} className="story-feature">
                    <span className="feature-dot">✦</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="stats-section">
        <div className="stats-bg" />
        <div className="container">
          <div className="stats-grid">
            {[
              { value: years, suffix: '+', label: 'Years of Heritage' },
              { value: productsCount, suffix: '+', label: 'Unique Products' },
              { value: ordersCount, suffix: '+', label: 'Happy Customers' },
              { value: countries, suffix: '+', label: 'Source Countries' },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">
                  <span className="gold-text">{stat.value.toLocaleString()}</span>
                  <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{stat.suffix}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-label reveal">Browse By Category</div>
          <h2 className="section-title reveal">The <span className="gold-text">Aurah</span> Collection</h2>
          <div className="categories-grid">
            {[
              { name: 'Premium Spices', desc: 'Cardamom, Pepper, Cinnamon & more', icon: '🌿', cat: 'Spices' },
              { name: 'Select Nuts', desc: 'Cashews, Almonds & premium nut varieties', icon: '🥜', cat: 'Nuts' },
            ].map((cat, i) => (
              <Link href={`/products?category=${cat.cat}`} key={i} className="category-card reveal">
                <div className="cat-bg" />
                <div className="cat-icon">{cat.icon}</div>
                <h3 className="cat-name">{cat.name}</h3>
                <p className="cat-desc">{cat.desc}</p>
                <span className="cat-cta">
                  Shop Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="cta-strip">
        <div className="cta-strip-bg" />
        <div className="container cta-content">
          <div>
            <h2 className="cta-title">Ready to Elevate Your Kitchen?</h2>
            <p className="cta-sub">Join thousands of food lovers who trust AURAH for the finest spices and nuts.</p>
          </div>
          <Link href="/products" className="btn-gold">Shop Now</Link>
        </div>
      </section>


    </>
  );
}
