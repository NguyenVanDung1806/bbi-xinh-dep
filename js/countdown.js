// ===== COUNTDOWN MODULE =====
import { launchAutoFireworks } from './animations.js';

let celebrationShowed = false;

/**
 * Initialize and start the countdown timer
 */
export function initCountdown() {
    const targetDate = new Date('January 1, 2026 00:00:00').getTime();
    let isInitialCheck = true;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (!celebrationShowed) {
                // Only auto-launch fireworks if the countdown reached zero while the user was already on the page
                // If they load the page after New Year has already started, we just show the message without auto-firing.
                const shouldLaunch = !isInitialCheck;
                showNewYearCelebration(shouldLaunch);
                celebrationShowed = true;
            }
            isInitialCheck = false;
            return;
        }

        isInitialCheck = false;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        // Animate countdown values
        animateCountdownValue('days');
        animateCountdownValue('hours');
        animateCountdownValue('minutes');
        animateCountdownValue('seconds');

        // Update year progress
        updateYearProgress();
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Animate countdown value with a scale effect
 * @param {String} id - Element ID
 */
function animateCountdownValue(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Update the year progress bar
 */
function updateYearProgress() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const totalTime = endOfYear - startOfYear;
    const elapsedTime = now - startOfYear;
    const progress = (elapsedTime / totalTime) * 100;

    const progressBar = document.getElementById('yearProgress');
    const progressText = document.getElementById('progressPercent');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress.toFixed(1)}%`;
}

/**
 * Show New Year celebration when countdown reaches zero
 * @param {Boolean} launchFireworks - Whether to automatically start fireworks
 */
function showNewYearCelebration(launchFireworks = true) {
    const heroTitle = document.querySelector('.hero-title');
    const countdownDisplay = document.querySelector('.countdown-display');

    if (heroTitle) {
        heroTitle.innerHTML = `
            <span class="year-new" style="font-size: 1.2em;">🎉 CHÚC MỪNG NĂM MỚI 2026! 🎉</span>
        `;
    }

    if (countdownDisplay) {
        countdownDisplay.innerHTML = `
            <h2 style="font-size: 3rem; text-align: center; width: 100%;">
                🎊 Chào Năm Mới 2026! 🎊
            </h2>
        `;
    }

    if (launchFireworks) {
        launchAutoFireworks();
    }
}

/**
 * Initialize stats animation with Intersection Observer
 */
export function initStats() {
    const statValues = document.querySelectorAll('.stat-value');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statValues.forEach(stat => {
                    animateStatCounter(stat);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/**
 * Animate a stat counter from 0 to target value
 * @param {HTMLElement} element - Element to animate
 */
function animateStatCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}
