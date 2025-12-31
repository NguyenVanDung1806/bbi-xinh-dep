// ===== ANIMATION MODULES =====
import { getRandomColor, isMobile, prefersReducedMotion } from './utils.js';

let fireworksActive = false;
let animationFrameId = null;

/**
 * Initialize particle system
 */
export function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = isMobile() ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 15;
        const randomDuration = 10 + Math.random() * 10;

        particle.style.left = `${randomX}%`;
        particle.style.animationDelay = `${randomDelay}s`;
        particle.style.animationDuration = `${randomDuration}s`;

        const colors = ['#667eea', '#764ba2', '#00f2fe', '#f6d365'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }
}

/**
 * Initialize fireworks canvas
 */
export function initFireworks() {
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/**
 * Start celebration with fireworks
 */
export function startCelebration() {
    if (fireworksActive) {
        stopFireworks();
    } else {
        launchFireworks();
        showStopButton();
    }
}

function showStopButton() {
    let btn = document.getElementById('stopFireworksBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'stopFireworksBtn';
        btn.className = 'fireworks-stop-btn';
        btn.textContent = '❌ Dừng Pháo Hoa';
        btn.onclick = stopFireworks;
        document.body.appendChild(btn);
    }
    btn.style.display = 'block';
}

/**
 * Launch fireworks animation
 */
/**
 * Launch fireworks animation
 */
export function launchFireworks() {
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    fireworksActive = true;

    const fireworks = [];
    const particles = [];

    // Romantic palette
    const colors = ['#ff9a9e', '#fecfef', '#ff416c', '#ff4b2b', '#fa709a', '#fee140', '#ffffff'];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1; // Higher explosions
            this.speed = 8 + Math.random() * 5; // Faster launch
            this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.2; // Slight spread
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.trail = [];
            this.brightness = Math.random() * 50 + 50;
        }

        update() {
            // Add trail effect
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 5) this.trail.shift();

            // Gravity/Friction
            this.vy += 0.05;
            this.x += this.vx;
            this.y += this.vy;

            // Fade out trail
            return this.vy >= 0 || this.y <= this.targetY;
        }

        draw() {
            // Draw trail
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            if (this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let point of this.trail) {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw head
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    }

    class Particle {
        constructor(x, y, color, type = 'circle') {
            this.x = x;
            this.y = y;
            this.color = color;
            this.type = type;
            
            // Physics
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1; // Different speeds
            
            // Heart shape math if applicable, otherwise random circle
            if (this.type === 'heart') {
                // We'll calculate velocity based on heart shape in createParticles
                this.vx = 0; 
                this.vy = 0;
            } else {
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
            }

            this.alpha = 1;
            this.friction = 0.98; // Air resistance
            this.gravity = 0.05;
            this.decay = 0.008 + Math.random() * 0.01; // Slower fade
            this.size = Math.random() * 3 + 1;
            this.flicker = Math.random() < 0.5;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            
            // Sparkle effect
            if (this.flicker && Math.random() > 0.8) {
                ctx.shadowBlur = 20;
                ctx.fillStyle = '#fff';
            } else {
                ctx.shadowBlur = 5;
            }
            
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function createParticles(x, y, color) {
        const isMobileDevice = isMobile();
        const particleCount = isMobileDevice ? 50 : 150; // Drastically reduce on mobile
        const isHeart = !isMobileDevice && Math.random() < 0.5; // Disable complex heart shape on mobile

        if (isHeart) {
             for (let i = 0; i < particleCount; i++) {
                const p = new Particle(x, y, color, 'heart');
                const angle = (Math.PI * 2 * i) / particleCount;
                
                // Heart formula
                // x = 16sin^3(t)
                // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
                // Invert Y for canvas
                
                const r = 2 + Math.random() * 2; // Radius/Scale spread
                
                const hx = 16 * Math.pow(Math.sin(angle), 3);
                const hy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
                
                p.vx = hx * (r / 20); // Scale down 
                p.vy = hy * (r / 20);
                
                particles.push(p);
             }
        } else {
            // Standard explosion
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(x, y, color, 'circle'));
            }
        }
    }

    function animate() {
        if (!fireworksActive) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        // Smoother trails
        ctx.fillStyle = 'rgba(18, 5, 11, 0.2)'; // Dark romantic background fade
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.05) { // Launch frequency
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            if (fireworks[i].update()) {
                createParticles(fireworks[i].x, fireworks[i].y, fireworks[i].color);
                fireworks.splice(i, 1);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Stop fireworks animation
 */
export function stopFireworks() {
    fireworksActive = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Hide stop button
    const btn = document.getElementById('stopFireworksBtn');
    if (btn) btn.style.display = 'none';

    // Clear canvas
    const canvas = document.getElementById('fireworks');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Launch auto fireworks for celebration
 */
export function launchAutoFireworks() {
    launchFireworks();
    setTimeout(stopFireworks, 30000); // Stop after 30 seconds
}

/**
 * Create confetti effect at element position
 * @param {HTMLElement} element - Element to create confetti at
 */
export function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const confettiCount = 20;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = `${rect.left + rect.width / 2}px`;
        confetti.style.top = `${rect.top}px`;
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;

        animateConfetti(confetti, vx, vy);
    }
}

/**
 * Animate confetti particle
 * @param {HTMLElement} element - Confetti element
 * @param {Number} vx - X velocity
 * @param {Number} vy - Y velocity
 */
function animateConfetti(element, vx, vy) {
    let x = parseFloat(element.style.left);
    let y = parseFloat(element.style.top);
    let opacity = 1;

    function update() {
        vy += 0.5;
        x += vx;
        y += vy;
        opacity -= 0.02;

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(update);
        } else {
            element.remove();
        }
    }

    update();
}

/**
 * Create celebration particles for resolution completion
 * @param {HTMLElement} element - Element to create celebration at
 */
export function createResolutionCelebration(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = getRandomColor();
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.borderRadius = '50%';
        particle.textContent = ['🎉', '⭐', '✨', '🎊'][Math.floor(Math.random() * 4)];
        particle.style.fontSize = '16px';

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 8 + Math.random() * 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 3;

        animateCelebrationParticle(particle, vx, vy);
    }
}

/**
 * Animate celebration particle
 * @param {HTMLElement} element - Particle element
 * @param {Number} vx - X velocity
 * @param {Number} vy - Y velocity
 */
function animateCelebrationParticle(element, vx, vy) {
    let x = parseFloat(element.style.left);
    let y = parseFloat(element.style.top);
    let opacity = 1;
    let rotation = 0;

    function update() {
        vy += 0.5;
        x += vx;
        y += vy;
        opacity -= 0.02;
        rotation += 10;

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = opacity;
        element.style.transform = `rotate(${rotation}deg)`;

        if (opacity > 0) {
            requestAnimationFrame(update);
        } else {
            element.remove();
        }
    }

    update();
}
