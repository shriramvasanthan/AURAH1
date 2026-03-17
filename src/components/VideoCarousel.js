'use client';
import { useState, useEffect } from 'react';

const videos = [
  {
    src: 'https://cdn.coverr.co/videos/coverr-spices-in-a-market-6047/1080p.mp4',
    title: 'The Spice Markets',
    subtitle: 'Where vibrant colours meet intoxicating aromas'
  },
  {
    src: 'https://cdn.coverr.co/videos/coverr-pouring-coffee-beans-2150/1080p.mp4',
    title: 'Pristine Harvest',
    subtitle: 'Sourced directly from the finest local farms'
  },
  {
    src: 'https://cdn.coverr.co/videos/coverr-peanuts-in-a-bowl-9993/1080p.mp4',
    title: 'Premium Selection',
    subtitle: 'Only the best nuts make it to our collection'
  }
];

export default function VideoCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="video-carousel-section">
      <div className="carousel-container">
        {videos.map((vid, i) => (
          <div
            key={i}
            className={`carousel-slide ${i === current ? 'active' : ''}`}
          >
            <video
              src={vid.src}
              autoPlay
              muted
              loop
              playsInline
              className="carousel-video"
            />
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <h2 className="carousel-title">{vid.title}</h2>
              <p className="carousel-subtitle">{vid.subtitle}</p>
            </div>
          </div>
        ))}
        
        <div className="carousel-nav">
          {videos.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .video-carousel-section {
          width: 100%;
          height: 80vh;
          min-height: 500px;
          position: relative;
          background: var(--black);
          overflow: hidden;
          margin: 60px 0;
          border-top: 1px solid rgba(192,82,42,0.15);
          border-bottom: 1px solid rgba(192,82,42,0.15);
        }
        
        .carousel-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
          z-index: 1;
        }

        .carousel-slide.active {
          opacity: 1;
          z-index: 2;
        }

        .carousel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.6) 100%
          );
        }

        .carousel-content {
          position: absolute;
          bottom: 15%;
          left: 10%;
          max-width: 600px;
          color: white;
          transform: translateY(20px);
          opacity: 0;
          transition: all 1s ease-out 0.5s;
        }

        .carousel-slide.active .carousel-content {
          transform: translateY(0);
          opacity: 1;
        }

        .carousel-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 4rem);
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.05em;
        }

        .carousel-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.02em;
        }

        .carousel-nav {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        .carousel-dot.active {
          background: transparent;
          border-color: var(--gold);
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .carousel-content {
            left: 5%;
            bottom: 10%;
            padding-right: 20px;
          }
        }
      `}</style>
    </section>
  );
}
