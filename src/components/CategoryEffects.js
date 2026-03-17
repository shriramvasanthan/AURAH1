'use client';
import { useEffect, useRef } from 'react';

export default function CategoryEffects({ category }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!category || category === 'All') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 40;

    // Define colors based on category
    const getParticleProps = () => {
      if (category === 'Spices') {
        // Red, orange, gold hues for Spices
        const colors = [
          'rgba(192, 82, 42, 0.6)', 
          'rgba(217, 119, 6, 0.6)', 
          'rgba(201, 168, 76, 0.6)',
          'rgba(185, 28, 28, 0.4)' 
        ];
        return {
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
          speedY: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 1
        };
      } else if (category === 'Nuts') {
        // Brown, tan, beige hues for Nuts
        const colors = [
          'rgba(139, 69, 19, 0.6)',
          'rgba(210, 180, 140, 0.6)',
          'rgba(222, 184, 135, 0.6)',
          'rgba(245, 245, 220, 0.4)'
        ];
        return {
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4, // Nuts are slightly larger
          speedY: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5
        };
      }
      return null;
    };

    for (let i = 0; i < particleCount; i++) {
      const props = getParticleProps();
      if (!props) break;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        ...props
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move particles
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    if (category === 'Spices' || category === 'Nuts') {
        render();
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [category]);

  if (category === 'All') return null;

  return (
    <div className={`category-effects-wrapper ${category.toLowerCase()}-active`}>
      <canvas
        ref={canvasRef}
        className="category-canvas"
      />
      <div className="category-overlay-gradient" />
      <style>{`
        .category-effects-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
        }

        .category-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          animation: fadeInCanvas 2s ease-in forwards;
        }

        .category-overlay-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: background 1.5s ease-in-out;
        }

        .spices-active .category-overlay-gradient {
          background: radial-gradient(circle at center, rgba(192, 82, 42, 0.05) 0%, transparent 70%);
        }

        .nuts-active .category-overlay-gradient {
          background: radial-gradient(circle at center, rgba(139, 69, 19, 0.05) 0%, transparent 70%);
        }

        @keyframes fadeInCanvas {
          from { opacity: 0; }
          to { opacity: 0.6; } /* Max opacity so it's not too distracting */
        }
      `}</style>
    </div>
  );
}
