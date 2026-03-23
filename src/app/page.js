'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ParticleHero from '@/components/ParticleHero';
import ProductCard from '@/components/ProductCard';

const SoftRevealText = ({ children, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function HomePage() {
    const [products, setProducts] = useState(Array(9).fill({ id: 'loading', loading: true }));
    const [content, setContent] = useState({
        hero_est: 'EST. 1998',
        hero_label: 'NATURE\'S SPECIMENS',
        hero_title: 'Premium <br /> <span class="title-serif">Spices</span> & Nuts',
        hero_desc: "Hand-picked from the world's finest farms, our specimens are masterfully preserved to deliver nature's most intense character.",
        hero_btn1_text: 'Explore Collection',
        hero_btn2_text: 'Our Story',
        hero_scroll_hint: 'SACRED HARVEST',
        collection_pre: '✦ Curated Selection ✦',
        collection_title: 'Featured Products',
        collection_desc: 'The jewels of our collection, hand-selected for their superior grade and sensory profile.',
        collection_counter: 'Collection / 01 — 09',
        heritage_tag: 'Our Philosophy',
        heritage_title: 'A Harvest <br /> of Purity',
        heritage_desc: 'For over two decades, we have partnered with small-scale producers who honor the ancient traditions of cultivation. No shortcuts—just the raw character of the earth.',
        heritage_bg: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
        heritage_btn_text: 'Full Heritage Report',
        heritage_frame_text: 'AURAH'
    });
    
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 80]);
    const yHeroDesc = useTransform(scrollY, [0, 500], [0, 120]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
    const scaleHeritage = useTransform(scrollY, [1200, 2000], [0.95, 1.05]);

    useEffect(() => {
        fetch('/api/products?featured=true')
            .then(r => r.json())
            .then(data => setProducts(data.slice(0, 9)))
            .catch(console.error);
            
        fetch('/api/content')
            .then(r => r.json())
            .then(data => {
                if(Object.keys(data).length > 0) {
                    setContent(prev => ({ ...prev, ...data }));
                }
            })
            .catch(console.error);
    }, []);

    return (
        <div ref={containerRef} className="flagship-root">
            {/* Cinematic Hero */}
            <section className="hero-primary">
                <div className="hero-visual">
                    <Image 
                        src="https://images.unsplash.com/photo-1596040033229-a9821ebd05ca?auto=format&fit=crop&q=60&w=2000"
                        alt="Hero Background"
                        fill
                        priority
                        className="hero-bg-img"
                        style={{ objectFit: 'cover', opacity: 0.15 }}
                    />
                    <ParticleHero />
                    <div className="glow-radial" />
                </div>
                
                <motion.div 
                    className="hero-overlay-content"
                    style={{ y: yHero, opacity: opacityHero }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="heritage-top">
                           <span>{content.hero_est}</span>
                           <span className="star">✦</span>
                           <span>{content.hero_label}</span>
                        </div>
                        
                        <h1 className="flagship-title" dangerouslySetInnerHTML={{ __html: content.hero_title }} />
                        
                        <motion.p 
                            className="flagship-desc"
                            style={{ y: yHeroDesc }}
                            dangerouslySetInnerHTML={{ __html: content.hero_desc }}
                        />
                        
                        <div className="hero-actions-group">
                            <Link href="/products" className="btn-gold">{content.hero_btn1_text}</Link>
                            <Link href="/heritage" className="btn-outline">View Heritage</Link>
                        </div>
                    </motion.div>
                </motion.div>
                
                <div className="scroll-hint">
                    <span className="hint-text">{content.hero_scroll_hint}</span>
                    <div className="hint-line" />
                </div>
            </section>

            {/* Featured Products */}
            <section className="collection-flagship">
                <div className="container-flagship">
                    <div className="flagship-header">
                        <div className="title-stack">
                           <span className="pre-label">{content.collection_pre}</span>
                           <SoftRevealText>
                               <h2 className="flagship-section-title">{content.collection_title}</h2>
                           </SoftRevealText>
                           <SoftRevealText>
                               <p className="section-subtitle" dangerouslySetInnerHTML={{ __html: content.collection_desc }} />
                           </SoftRevealText>
                        </div>
                        <span className="flagship-counter">{content.collection_counter}</span>
                    </div>

                    <div className="flagship-grid">
                        {products.map((product, i) => (
                            <motion.div 
                                key={product.id === 'loading' ? `loading-${i}` : product.id}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 1.2, 
                                    delay: (i % 3) * 0.08,
                                    ease: [0.23, 1, 0.32, 1]
                                }}
                                className={`grid-item-flagship ${i % 3 === 1 ? 'offset-mid' : i % 3 === 2 ? 'offset-deep' : ''}`}
                            >
                                {product.loading ? (
                                    <div className="skeleton-card" />
                                ) : (
                                    <ProductCard product={product} />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Heritage Section */}
            <section className="heritage-section">
                <div className="container-flagship split-view">
                    <motion.div 
                        className="heritage-visual"
                        style={{ scale: scaleHeritage }}
                    >
                        <div className="heritage-image-frame">
                            <Image 
                                src={content.heritage_bg} 
                                alt="Heritage Background" 
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ 
                                    objectFit: 'cover',
                                    mixBlendMode: 'luminosity',
                                    opacity: 0.6
                                }}
                            />
                            <div className="frame-overlay">{content.heritage_frame_text}</div>
                        </div>
                    </motion.div>
                    
                    <div className="heritage-copy">
                        <span className="tag-gold">{content.heritage_tag}</span>
                        <SoftRevealText>
                            <h2 className="heritage-h" dangerouslySetInnerHTML={{ __html: content.heritage_title }} />
                        </SoftRevealText>
                        <SoftRevealText>
                            <p className="heritage-p" dangerouslySetInnerHTML={{ __html: content.heritage_desc }} />
                        </SoftRevealText>
                        <Link href="/story" className="btn-outline heritage-btn">{content.heritage_btn_text}</Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .flagship-root {
                    background: linear-gradient(to bottom, #fdfaf3 0%, #f4efdc 50%, #d2c394 100%);
                    color: #2C1A0E;
                    min-height: 100vh;
                }
                /* ===== HERO ===== */
                .hero-primary {
                    height: 100svh;
                    min-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    text-align: center;
                    overflow: hidden;
                }
                .hero-visual {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .hero-overlay-content {
                    z-index: 10;
                    padding: 0 1.5rem;
                    width: 100%;
                }
                .heritage-top {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    font-family: var(--font-cinzel);
                    font-size: 0.55rem;
                    letter-spacing: 0.45em;
                    color: var(--gold);
                    margin-bottom: 2rem;
                    font-weight: 800;
                    flex-wrap: wrap;
                }
                .heritage-top .star { font-size: 0.9rem; }
                
                .flagship-title {
                    font-family: var(--font-cinzel);
                    font-size: clamp(3rem, 9vw, 9.5rem);
                    font-weight: 900;
                    line-height: 0.9;
                    margin-bottom: 2rem;
                    letter-spacing: -0.03em;
                    color: #2C1A0E !important;
                }
                .title-serif {
                    font-style: italic;
                    color: var(--gold);
                    font-weight: 400;
                }
                .flagship-desc {
                    font-family: var(--font-montserrat);
                    font-size: clamp(0.9rem, 2.5vw, 1.15rem);
                    line-height: 1.8;
                    color: #2C1A0E !important;
                    max-width: 560px;
                    margin: 0 auto 2.5rem;
                    font-style: italic;
                    font-weight: 500;
                    opacity: 0.8;
                }
                .hero-actions-group {
                    display: flex;
                    justify-content: center;
                    gap: 1.2rem;
                    flex-wrap: wrap;
                }
                .scroll-hint {
                    position: absolute;
                    bottom: 3rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    z-index: 10;
                }
                .hint-text {
                    font-size: 0.45rem;
                    text-transform: uppercase;
                    letter-spacing: 0.6em;
                    color: var(--gold);
                    font-weight: 900;
                    opacity: 0.8;
                }
                .hint-line {
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(to bottom, var(--gold), transparent);
                }

                /* ===== COLLECTION ===== */
                .collection-flagship {
                    padding: 120px 0;
                    border-top: 1px solid rgba(192, 82, 42, 0.1);
                }
                .container-flagship {
                    max-width: var(--container-max);
                    margin: 0 auto;
                    padding: 0 3rem;
                }
                .flagship-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 80px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid rgba(192, 82, 42, 0.1);
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .pre-label {
                    display: block;
                    font-family: var(--font-cinzel);
                    font-size: 0.55rem;
                    letter-spacing: 0.4em;
                    color: var(--gold);
                    margin-bottom: 0.8rem;
                    font-weight: 800;
                }
                .flagship-section-title {
                    font-family: var(--font-cinzel);
                    font-size: clamp(2rem, 5vw, 4rem);
                    letter-spacing: 0.05em;
                    color: #2C1A0E;
                }
                .section-subtitle {
                    font-family: var(--font-montserrat);
                    font-size: 0.9rem;
                    color: #2C1A0E;
                    opacity: 0.7;
                    margin-top: 0.8rem;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    max-width: 500px;
                }
                .flagship-counter {
                    font-family: var(--font-montserrat);
                    font-size: 0.6rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--muted);
                    font-weight: 800;
                    white-space: nowrap;
                }
                .flagship-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 40px;
                    min-height: 600px;
                }
                .skeleton-card {
                    width: 100%;
                    aspect-ratio: 1/1.5;
                    background: rgba(192, 82, 42, 0.04);
                    border-radius: 4px;
                    border: 1px solid rgba(192, 82, 42, 0.06);
                }
                .offset-mid { margin-top: 80px; }
                .offset-deep { margin-top: 160px; }

                /* ===== HERITAGE ===== */
                .heritage-section {
                    background: var(--dark);
                    padding: 120px 0;
                }
                .split-view {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                }
                .heritage-image-frame {
                    aspect-ratio: 4/5;
                    border: 1px solid rgba(192, 82, 42, 0.15);
                    position: relative;
                    padding: 40px;
                    background: #ede4cc;
                }
                .frame-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: var(--font-cinzel);
                    font-size: clamp(4rem, 10vw, 8rem);
                    opacity: 0.08;
                    letter-spacing: 0.25em;
                    pointer-events: none;
                }
                .tag-gold {
                    font-family: var(--font-cinzel);
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 0.35em;
                    color: var(--gold);
                    margin-bottom: 2rem;
                    display: block;
                    font-weight: 900;
                }
                .heritage-h {
                    font-family: var(--font-cinzel);
                    font-size: clamp(2.5rem, 5vw, 5rem);
                    margin-bottom: 2.5rem;
                    line-height: 1;
                    letter-spacing: -0.01em;
                    color: #2C1A0E;
                }
                .heritage-p {
                    font-family: var(--font-montserrat);
                    font-size: 1.05rem;
                    line-height: 1.8;
                    color: #2C1A0E;
                    opacity: 0.8;
                    font-style: italic;
                    font-weight: 500;
                }
                .heritage-btn {
                    margin-top: 2.5rem;
                    display: inline-flex;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1200px) {
                    .flagship-grid { grid-template-columns: 1fr 1fr; }
                    .offset-deep { margin-top: 80px; }
                }
                @media (max-width: 1024px) {
                    .flagship-grid { grid-template-columns: 1fr 1fr; }
                    .split-view {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }
                    .heritage-section, .collection-flagship { padding: 80px 0; }
                    .container-flagship { padding: 0 2rem; }
                    .flagship-header { margin-bottom: 48px; }
                }
                @media (max-width: 768px) {
                    .flagship-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    }
                    .offset-mid, .offset-deep { margin-top: 0; }
                    .container-flagship { padding: 0 1.25rem; }
                    .flagship-header { margin-bottom: 36px; }
                    .collection-flagship { padding: 64px 0; }
                    .heritage-section { padding: 64px 0; }
                    .flagship-title {
                        font-size: clamp(2.5rem, 12vw, 5rem);
                        line-height: 0.95;
                    }
                }
                @media (max-width: 480px) {
                    .flagship-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                        min-height: unset;
                    }
                    .hero-primary { height: 100svh; min-height: 580px; }
                    .hero-overlay-content { margin-top: 0; padding: 0 1rem; }
                    .heritage-top {
                        gap: 0.8rem;
                        letter-spacing: 0.3em;
                        font-size: 0.5rem;
                    }
                    .flagship-title {
                        font-size: clamp(2.2rem, 14vw, 3.5rem);
                        margin-bottom: 1.25rem;
                    }
                    .flagship-desc {
                        font-size: 0.85rem;
                        margin-bottom: 2rem;
                    }
                    .hero-actions-group {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.8rem;
                    }
                    .scroll-hint { bottom: 2rem; }
                    .hint-line { height: 40px; }
                    .collection-flagship { padding: 48px 0; }
                    .heritage-section { padding: 48px 0; }
                    .heritage-image-frame { padding: 20px; }
                }
                @media (max-width: 360px) {
                    .flagship-title { font-size: clamp(2rem, 15vw, 3rem); }
                    .hero-actions-group { gap: 0.6rem; }
                }
            `}</style>

            <style jsx global>{`
                .btn-gold {
                    background: linear-gradient(135deg, #8b3c1e, #c0522a, #d96a38);
                    border: none;
                    color: #f5edd6;
                    padding: 16px 36px;
                    font-family: var(--font-cinzel);
                    font-size: 0.72rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-weight: 900;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: var(--transition);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 52px;
                    min-width: 160px;
                    text-align: center;
                }
                .btn-gold:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--glow-strong);
                }
                .btn-gold:active { transform: translateY(0); }
                .btn-outline {
                    background: transparent;
                    border: 2px solid var(--gold);
                    color: var(--gold);
                    padding: 14px 36px;
                    font-family: var(--font-cinzel);
                    font-size: 0.72rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-weight: 900;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: var(--transition);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 52px;
                    min-width: 160px;
                    text-align: center;
                }
                .btn-outline:hover {
                    background: var(--gold);
                    color: var(--black);
                }
                .btn-outline:active { opacity: 0.8; }
                @media (max-width: 480px) {
                    .btn-gold, .btn-outline {
                        padding: 14px 28px;
                        font-size: 0.65rem;
                        min-width: 140px;
                        width: 100%;
                        max-width: 280px;
                    }
                }
            `}</style>
        </div>
    );
}
