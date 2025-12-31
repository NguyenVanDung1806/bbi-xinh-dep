// ===== INTERACTIONS MODULE =====
import { sanitizeInput, trackEvent, hapticFeedback, scrollToSection, addTouchFeedback } from './utils.js';
import { createConfetti, createResolutionCelebration } from './animations.js';

/**
 * Initialize wishes system
 */
export function initWishes() {
    const submitBtn = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    if (!submitBtn || !wishInput) return;

    submitBtn.addEventListener('click', () => {
        const wishText = wishInput.value.trim();
        if (wishText) {
            addWish(wishText);
            wishInput.value = '';
            wishInput.focus();
            trackEvent('Engagement', 'wish_submitted', 'New Year Wish');
        }
    });

    wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

/**
 * Add a wish to the display
 * @param {String} wishText - The wish text
 */
function addWish(wishText) {
    const wishesDisplay = document.getElementById('wishesDisplay');
    if (!wishesDisplay) return;

    // Validate length (min 3, max 200 characters)
    if (!wishText || wishText.trim().length < 3) {
        showTempMessage('Vui lòng nhập ít nhất 3 ký tự', 'error');
        return;
    }

    if (wishText.length > 200) {
        showTempMessage('Lời chúc quá dài (tối đa 200 ký tự)', 'error');
        return;
    }

    const wishCard = document.createElement('div');
    wishCard.className = 'wish-card';

    const emojis = ['✨', '🌟', '⭐', '💫', '🎊', '🎉'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Sanitize input to prevent XSS
    const sanitized = sanitizeInput(wishText);

    // Create safe HTML
    const emojiSpan = document.createElement('span');
    emojiSpan.textContent = randomEmoji + ' ';

    const textSpan = document.createElement('span');
    textSpan.textContent = sanitized;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'wish-content';
    contentDiv.appendChild(emojiSpan);
    contentDiv.appendChild(textSpan);

    wishCard.appendChild(contentDiv);
    wishesDisplay.insertBefore(wishCard, wishesDisplay.firstChild);

    // Add celebration effect
    createConfetti(wishCard);
    hapticFeedback(20);

    // Success message
    showTempMessage('Đã gửi lời chúc! 🌟', 'success');
}

/**
 * Show temporary message to user
 * @param {String} message - Message to show
 * @param {String} type - Message type (success, error)
 */
function showTempMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `temp-message temp-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ff6b6b' : '#4ade80'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

/**
 * Initialize resolution trackers
 */
export function initResolutionTrackers() {
    const resolutionCards = document.querySelectorAll('.resolution-card');

    resolutionCards.forEach(card => {
        card.addEventListener('click', () => {
            const progressBar = card.querySelector('.progress-bar-fill');
            const progressText = card.querySelector('.progress-text');

            if (!progressBar || !progressText) return;

            let currentProgress = parseInt(progressBar.style.width) || 0;
            currentProgress += 10;

            if (currentProgress > 100) currentProgress = 0;

            progressBar.style.width = `${currentProgress}%`;
            progressText.textContent = `${currentProgress}% Hoàn thành`;

            // Add celebration effect at 100%
            if (currentProgress === 100) {
                createResolutionCelebration(card);
                hapticFeedback([100, 50, 100]);
                trackEvent('Achievement', 'resolution_completed', 'Resolution 100%');
            } else {
                hapticFeedback(10);
            }
        });
    });
}

/**
 * Initialize quotes carousel
 */
let currentQuoteIndex = 0;
let quoteAutoPlayInterval;

export function initQuotesCarousel() {
    const quotes = document.querySelectorAll('.quote-card');
    const dotsContainer = document.getElementById('quoteDots');

    if (!quotes.length || !dotsContainer) return;

    // Create dots
    quotes.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showQuote(index));
        dotsContainer.appendChild(dot);
    });

    // Auto-play
    startQuoteAutoPlay();

    // Pause on hover
    const carousel = document.querySelector('.quotes-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopQuoteAutoPlay);
        carousel.addEventListener('mouseleave', startQuoteAutoPlay);

        // Add touch swipe support for mobile
        addSwipeSupport(carousel);
    }
}

/**
 * Add swipe support for carousel
 * @param {HTMLElement} element - Element to add swipe support to
 */
function addSwipeSupport(element) {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only trigger if horizontal swipe is dominant
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous quote
                changeQuote(-1);
            } else {
                // Swipe left - next quote
                changeQuote(1);
            }
        }
    }, { passive: true });
}

/**
 * Show a specific quote
 * @param {Number} index - Quote index
 */
function showQuote(index) {
    const quotes = document.querySelectorAll('.quote-card');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!quotes.length) return;

    // Wrap around
    if (index >= quotes.length) index = 0;
    if (index < 0) index = quotes.length - 1;

    currentQuoteIndex = index;

    // Update quotes
    quotes.forEach((quote, i) => {
        quote.classList.toggle('active', i === index);
    });

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

/**
 * Change quote by direction
 * @param {Number} direction - Direction to change (-1 or 1)
 */
export function changeQuote(direction) {
    showQuote(currentQuoteIndex + direction);
    stopQuoteAutoPlay();
    startQuoteAutoPlay();
}

/**
 * Start quote auto-play
 */
function startQuoteAutoPlay() {
    stopQuoteAutoPlay();
    quoteAutoPlayInterval = setInterval(() => {
        showQuote(currentQuoteIndex + 1);
    }, 5000);
}

/**
 * Stop quote auto-play
 */
function stopQuoteAutoPlay() {
    if (quoteAutoPlayInterval) {
        clearInterval(quoteAutoPlayInterval);
    }
}

/**
 * Initialize contact form
 */
export function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError('nameError', 'Vui lòng nhập tên hợp lệ (ít nhất 2 ký tự)');
            isValid = false;
        }

        if (!validateEmail(emailInput.value) && emailInput.value) {
             // Email is optional in HTML but updated js logic should reflect that or stick to strict if required.
             // The translated HTML said "không bắt buộc" (optional). 
             // But the original JS enforced it if not empty? 
             // Original: if (!validateEmail(emailInput.value)) { showError... } implies required if it fails regex.
             // But validateEmail returns false if empty?
             // Let's check validateEmail implementation.
             // It returns false if !email. So it was required.
             // I changed placeholder to optional, so I should allow empty.
        }
        // Let's keep it simple: strict validation as per original for now, 
        // OR better, if I said optional in HTML, I should respect it.
        // The HTML I wrote: <input type="email" ... placeholder="Nhập email nếu thích">
        // So I'll modify logic: only validate if value is present.
        if (emailInput.value && !validateEmail(emailInput.value)) {
             showError('emailError', 'Vui lòng nhập email hợp lệ');
             isValid = false;
        }


        if (!validateMessage(messageInput.value)) {
            showError('messageError', 'Vui lòng nhập tin nhắn (ít nhất 10 ký tự)');
            isValid = false;
        }

        if (isValid) {
            submitContactForm(form);
        }
    });

    // Real-time validation
    nameInput.addEventListener('blur', () => {
        if (nameInput.value && !validateName(nameInput.value)) {
            showError('nameError', 'Vui lòng nhập tên hợp lệ');
        } else {
            clearError('nameError');
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError('emailError', 'Vui lòng nhập email hợp lệ');
        } else {
            clearError('emailError');
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value && !validateMessage(messageInput.value)) {
            showError('messageError', 'Tin nhắn phải có ít nhất 10 ký tự');
        } else {
            clearError('messageError');
        }
    });
}

/**
 * Validate name input
 * @param {String} name - Name to validate
 * @returns {Boolean}
 */
function validateName(name) {
    if (!name || typeof name !== 'string') return false;

    const trimmed = name.trim();

    // Check length (2-50 characters)
    if (trimmed.length < 2 || trimmed.length > 50) return false;

    // Only allow letters, spaces, hyphens, and apostrophes
    // Allow Vietnamese characters too!
    // Simple regex update or just relax it. 
    // Let's relax it to length check mainly for simplicity in Vietnamese names
    return true; 
}

/**
 * Validate email with enhanced security
 * @param {String} email - Email to validate
 * @returns {Boolean}
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;

    const trimmed = email.trim();

    // Check length (5-100 characters)
    if (trimmed.length < 5 || trimmed.length > 100) return false;

    // Enhanced email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmed)) return false;

    // Check for consecutive dots
    if (trimmed.includes('..')) return false;

    return true;
}

/**
 * Validate message with length constraints
 * @param {String} message - Message to validate
 * @returns {Boolean}
 */
function validateMessage(message) {
    if (!message || typeof message !== 'string') return false;

    const trimmed = message.trim();

    // Check length (10-1000 characters)
    if (trimmed.length < 10 || trimmed.length > 1000) return false;

    return true;
}

/**
 * Show error message with enhanced styling
 * @param {String} errorId - Error element ID
 * @param {String} message - Error message
 */
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        // Sanitize error message (should already be safe, but extra layer)
        errorElement.textContent = sanitizeInput(message);
        errorElement.classList.add('show');

        // Add ARIA announcement for screen readers
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
    }
}

/**
 * Clear error message
 * @param {String} errorId - Error element ID
 */
function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        errorElement.removeAttribute('role');
        errorElement.removeAttribute('aria-live');
    }
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    ['nameError', 'emailError', 'messageError'].forEach(clearError);
}

/**
 * Submit contact form with sanitization
 * @param {HTMLFormElement} form - Form element
 */
/**
 * Submit contact form with sanitization
 * @param {HTMLFormElement} form - Form element
 */
function submitContactForm(form) {
    const submitButton = form.querySelector('.form-submit');
    const successMessage = document.getElementById('formSuccess');

    if (!submitButton || !successMessage) return;

    // Get form values
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    // Sanitize all inputs before processing
    // Note: We still sanitize for safety, though mailto is safer by default as it's just a string.
    const sanitizedData = {
        name: sanitizeInput(nameInput.value.trim()),
        email: sanitizeInput(emailInput.value.trim().toLowerCase()),
        message: sanitizeInput(messageInput.value.trim())
    };

    // Additional validation after sanitization
    if (sanitizedData.name.length < 2 || sanitizedData.name.length > 50) {
        showError('nameError', 'Tên phải từ 2 đến 50 ký tự');
        return;
    }

    if (sanitizedData.message.length < 10 || sanitizedData.message.length > 1000) {
        showError('messageError', 'Tin nhắn phải từ 10 đến 1000 ký tự');
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Đang mở Email...</span>';

    // Construct Mailto Link
    const subject = `Lời nhắn năm mới từ ${sanitizedData.name}`;
    const body = `Chào Dũng,\n\nTôi là: ${sanitizedData.name}\nEmail: ${sanitizedData.email || 'Không cung cấp'}\n\nLời nhắn:\n${sanitizedData.message}\n\n----------------\nGửi từ website Chào Xuân 2026`;
    
    const mailtoLink = `mailto:dungvann1806@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Email Client
    window.location.href = mailtoLink;

    // Show visual confirmation on the site too, assuming they will send it.
    setTimeout(() => {
        // Show success message
        successMessage.classList.add('show');

        // Reset form
        form.reset();

        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = `
            <span>Gửi Tin Nhắn</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        // Haptic feedback
        hapticFeedback([100, 50, 100]);
    }, 1000); // Small delay to allow mail client to open first
}

/**
 * Initialize back to top button
 */
export function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        hapticFeedback(20);
    };

    // Event listeners
    backToTopButton.addEventListener('click', scrollToTop);

    // Use debounce from utils (imported)
    window.addEventListener('scroll', () => {
        toggleBackToTop();
    });

    // Initial check
    toggleBackToTop();
}
