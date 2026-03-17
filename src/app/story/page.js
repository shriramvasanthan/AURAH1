'use client';
import { motion } from 'framer-motion';

export default function StoryPage() {
  return (
    <div className="story-page">
      <div className="story-hero">
        <div className="story-hero-bg" />
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="section-label">Our Legacy</div>
            <h1 className="story-title">Aurah <span className="gold-text">Heritage</span></h1>
            <p className="story-subtitle">The alchemical pursuit of nature's most potent treasures.</p>
          </motion.div>
        </div>
      </div>

      <section className="story-content">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <h2>The Earthy Alchemist</h2>
              <p>
                Founded on the spice-scented winds of the Malabar Coast, Aurah represents a centuries-old 
                commitment to the alchemical transformation of raw nature into culinary gold. Our heritage 
                is not just a history; it is a living practice of preservation, selection, and elevation.
              </p>
              <p>
                We believe that every spice tells a story of the soil it was born from. Our curators 
                travel to the most remote corners of the world to identify specimens that possess not 
                just flavor, but soul.
              </p>
              <blockquote>
                "True luxury is found in the purity of the source and the patience of the process."
              </blockquote>
              <p>
                From the deep forests where our wild-harvested peppercorns cure in the sun, to the high 
                plateaus where our saffron is hand-plucked at dawn—every Aurah product is a testament 
                to our relentless pursuit of intensity.
              </p>
            </div>
            <div className="story-visual">
              <div className="visual-frame">
                <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800" alt="Heritage" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .story-page { min-height: 100vh; background: var(--bg-warm); }
        .story-hero {
          padding: 200px 0 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .story-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 100%, rgba(192,82,42,0.1) 0%, transparent 60%);
          border-bottom: 1px solid rgba(192,82,42,0.1);
        }
        .story-title { font-size: clamp(3rem, 8vw, 6rem); margin-bottom: 2rem; }
        .story-subtitle { font-family: var(--font-lora); font-style: italic; color: var(--muted); font-size: 1.2rem; }
        
        .story-content { padding: 100px 0; }
        .story-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .story-text h2 { 
          font-family: var(--font-playfair); 
          font-size: 2.5rem; 
          margin-bottom: 2rem; 
          color: var(--white);
        }
        .story-text p { 
          font-family: var(--font-lora); 
          font-size: 1.1rem; 
          line-height: 1.8; 
          color: var(--muted); 
          margin-bottom: 1.5rem; 
        }
        blockquote {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          color: var(--gold);
          border-left: 3px solid var(--gold);
          padding-left: 30px;
          margin: 40px 0;
          font-style: italic;
        }
        .visual-frame {
          padding: 15px;
          background: var(--bg-warm);
          border: 1px solid rgba(192,82,42,0.2);
          transform: rotate(2deg);
          box-shadow: var(--glow);
        }
        .visual-frame img { width: 100%; display: block; filter: sepia(30%); }

        @media (max-width: 1024px) {
          .story-grid { grid-template-columns: 1fr; gap: 60px; }
          .story-hero { padding: 160px 0 60px; }
        }
      `}</style>
    </div>
  );
}
