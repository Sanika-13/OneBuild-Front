import React, { useEffect, useRef } from 'react';

const SplashCursor = () => {
    const canvasRef = useRef(null);
    const pointers = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        const pointer = {
            x: width / 2,
            y: height / 2,
            mx: 0,
            my: 0,
            hasMoved: false
        };

        const handleMouseMove = (e) => {
            pointer.hasMoved = true;
            pointer.mx = e.clientX;
            pointer.my = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const colors = [
            "255, 255, 255", // White
            "255, 215, 0",   // Gold
            "255, 105, 180", // Hot Pink
            "0, 255, 255"    // Cyan
        ];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2; // Tiny particles (0-2px)
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.life = 1;
                this.decay = Math.random() * 0.05 + 0.02; // Very fast fade
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size -= 0.05;
                this.life -= this.decay;
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
                ctx.shadowBlur = 2; // Subtle glow
                ctx.shadowColor = `rgb(${this.color})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        let particles = [];
        let isAdding = false;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            if (pointer.hasMoved) {
                // Minimum particles
                for (let i = 0; i < 1; i++) {
                    particles.push(new Particle(pointer.mx, pointer.my));
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                if (particles[i].life <= 0 || particles[i].size <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default SplashCursor;
