'use client';
import { useEffect, useRef, useState } from 'react';

export default function ParticleHero() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: Math.random() * -0.3 - 0.1,
            opacity: Math.random() * 0.3 + 0.05,
            life: Math.random(),
            symbol: ['·', '✦', '·'][Math.floor(Math.random() * 3)],
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.life += 0.001;

                if (p.y < -20) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                    p.life = 0;
                }

                const fade = Math.sin(p.life * Math.PI) * p.opacity;

                ctx.save();
                ctx.globalAlpha = Math.max(0, fade);
                ctx.fillStyle = `#D9A05B88`; // Saffron with opacity

                if (p.size > 1.5) {
                    ctx.font = `${p.size * 4}px serif`;
                    ctx.fillText(p.symbol, p.x, p.y);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
}
