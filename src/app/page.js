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
    // Pre-populate with 9 skeleton products to match the fetch count and stabilize grid
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
    const yHero = useTransform(scrollY, [0, 500], [0, 150]);
    const yHeroDesc = useTransform(scrollY, [0, 500], [0, 200]);
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
            {/* Cinematic Hero - Exact Heritage Match */}
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
                            <Link href="/story" className="btn-outline">{content.hero_btn2_text}</Link>
                        </div>
                    </motion.div>
                </motion.div>
                
                <div className="scroll-hint">
                    <span className="hint-text">{content.hero_scroll_hint}</span>
                    <div className="hint-line" />
                </div>
            </section>

            {/* The Staggered Collection - 3 Column Flagship Grid */}
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
                                initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -1 : 1 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 1.2, 
                                    delay: (i % 3) * 0.1,
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

            {/* The Heritage - 1:1 Flagship Layout */}
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
                                sizes="(max-width: 1024px) 100vw, 50vw"
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
                        <Link href="/story" className="btn-outline" style={{ marginTop: '2.5rem' }}>{content.heritage_btn_text}</Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .flagship-root {
                    background: var(--black);
                    color: var(--white);
                    min-height: 100vh;
                }
                .hero-primary {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    text-align: center;
                    background: radial-gradient(circle at center, rgba(192, 82, 42, 0.08) 0%, transparent 70%);
                }
                .hero-overlay-content {
                    z-index: 10;
                    margin-top: -50px;
                }
                .heritage-top {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    font-family: var(--font-cinzel);
                    font-size: 0.6rem;
                    letter-spacing: 0.5em;
                    color: var(--gold);
                    margin-bottom: 3rem;
                    font-weight: 800;
                }
                .heritage-top .star { font-size: 1rem; }
                
                .flagship-title {
                    font-family: var(--font-cinzel);
                    font-size: clamp(3.5rem, 9vw, 9.5rem);
                    font-weight: 900;
                    line-height: 0.85;
                    margin-bottom: 3rem;
                    letter-spacing: -0.03em;
                    color: var(--white); /* Dark Brown on Light Cream */
                }
                .title-serif {
                    font-style: italic;
                    color: var(--gold);
                    font-weight: 400;
                }
                .flagship-desc {
                    font-family: var(--font-montserrat);
                    font-size: 1.15rem;
                    line-height: 1.8;
                    color: var(--muted);
                    max-width: 650px;
                    margin: 0 auto 4rem;
                    font-style: italic;
                    font-weight: 500;
                }
                .hero-actions-group {
                    display: flex;
                    justify-content: center;
                    gap: 2.5rem;
                }
                .scroll-hint {
                    position: absolute;
                    bottom: 4rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
                .hint-text {
                    font-size: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.6em;
                    color: var(--gold);
                    font-weight: 900;
                    opacity: 0.8;
                }
                .hint-line {
                    width: 1px;
                    height: 80px;
                    background: linear-gradient(to bottom, var(--gold), transparent);
                }
                .collection-flagship {
                    padding: 200px 0;
                    border-top: 1px solid rgba(192, 82, 42, 0.1);
                }
                .container-flagship {
                    max-width: var(--container-max);
                    margin: 0 auto;
                    padding: 0 60px;
                }
                .flagship-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 120px;
                    padding-bottom: 40px;
                    border-bottom: 1px solid rgba(192, 82, 42, 0.1);
                }
                .pre-label {
                    display: block;
                    font-family: var(--font-cinzel);
                    font-size: 0.6rem;
                    letter-spacing: 0.4em;
                    color: var(--gold);
                    margin-bottom: 1rem;
                    font-weight: 800;
                }
                .flagship-section-title {
                    font-family: var(--font-cinzel);
                    font-size: 4rem;
                    letter-spacing: 0.05em;
                }
                .section-subtitle {
                    font-family: var(--font-montserrat);
                    font-size: 0.95rem;
                    color: var(--muted);
                    margin-top: 1rem;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    max-width: 600px;
                }
                .flagship-counter {
                    font-family: var(--font-montserrat);
                    font-size: 0.65rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--muted);
                    font-weight: 800;
                }
                .flagship-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 60px;
                    min-height: 800px; /* Prevent collapse */
                }
                .skeleton-card {
                    width: 100%;
                    aspect-ratio: 1/1.5;
                    background: rgba(192, 82, 42, 0.03);
                    border-radius: 4px;
                }
                .offset-mid { margin-top: 100px; }
                .offset-deep { margin-top: 200px; }
                
                .heritage-section {
                    background: var(--dark);
                    padding: 200px 0;
                }
                .split-view {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 120px;
                    align-items: center;
                }
                .heritage-image-frame {
                    aspect-ratio: 4/5;
                    border: 1px solid rgba(192, 82, 42, 0.15);
                    position: relative;
                    padding: 60px;
                    background: #ede4cc;
                }
                .heritage-img-inner {
                    width: 100%;
                    height: 100%;
                    background-position: center;
                    background-size: cover;
                    mix-blend-mode: luminosity;
                    opacity: 0.6;
                }
                .frame-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: var(--font-cinzel);
                    font-size: 8rem;
                    opacity: 0.08;
                    letter-spacing: 0.25em;
                    pointer-events: none;
                }
                .tag-gold {
                    font-family: var(--font-cinzel);
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.35em;
                    color: var(--gold);
                    margin-bottom: 2.5rem;
                    display: block;
                    font-weight: 900;
                }
                .heritage-h {
                    font-family: var(--font-cinzel);
                    font-size: 5rem;
                    margin-bottom: 3.5rem;
                    line-height: 1;
                    letter-spacing: -0.01em;
                }
                .heritage-p {
                    font-family: var(--font-montserrat);
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: var(--muted);
                    font-style: italic;
                    font-weight: 500;
                }
                @media (max-width: 1200px) {
                    .flagship-grid { grid-template-columns: 1fr 1fr; }
                    .offset-deep { margin-top: 100px; }
                }
                @media (max-width: 1024px) {
                    .flagship-grid, .split-view { grid-template-columns: 1fr; }
                    .offset-mid, .offset-deep { margin-top: 0; }
                    .collection-flagship, .heritage-section { padding: 100px 0; }
                    .heritage-h { font-size: 3.5rem; }
                }
            `}</style>

            <style jsx global>{`
                .btn-gold {
                    background: linear-gradient(135deg, #8b3c1e, #c0522a, #d96a38);
                    border: none;
                    color: #f5edd6;
                    padding: 18px 48px;
                    font-family: var(--font-cinzel);
                    font-size: 0.75rem;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    font-weight: 900;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: var(--transition);
                }
                .btn-gold:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--glow-strong);
                }
                .btn-outline {
                    background: transparent;
                    border: 2px solid var(--gold);
                    color: var(--gold);
                    padding: 18px 48px;
                    font-family: var(--font-cinzel);
                    font-size: 0.75rem;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    font-weight: 900;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: var(--transition);
                }
                .btn-outline:hover {
                    background: var(--gold);
                    color: var(--black);
                }
            `}</style>
        </div>
    );
}
