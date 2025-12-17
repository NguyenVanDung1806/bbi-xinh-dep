// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sanitize user input to prevent XSS attacks
 * Removes dangerous HTML, scripts, and potential malicious code
 * @param {String} input - User input string
 * @returns {String} Sanitized string
 */
export function sanitizeInput(input) {
    if (!input) return '';

    // Convert to string if not already
    let sanitized = String(input);

    // Remove any script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove any event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol from URLs
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: protocol (can be used for XSS)
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    // Use DOM API to encode HTML entities
    const div = document.createElement('div');
    div.textContent = sanitized;
    sanitized = div.innerHTML;

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
}

/**
 * Sanitize HTML allowing only safe tags
 * @param {String} html - HTML string to sanitize
 * @param {Array} allowedTags - Tags to allow (default: ['b', 'i', 'em', 'strong'])
 * @returns {String} Sanitized HTML
 */
export function sanitizeHTML(html, allowedTags = ['b', 'i', 'em', 'strong']) {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove all tags except allowed ones
    const walker = document.createTreeWalker(
        div,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
    );

    const nodesToRemove = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!allowedTags.includes(node.tagName.toLowerCase())) {
            nodesToRemove.push(node);
        }
    }

    nodesToRemove.forEach(node => {
        const text = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(text, node);
    });

    return div.innerHTML;
}

/**
 * Validate and sanitize email address
 * @param {String} email - Email to validate
 * @returns {String|null} Sanitized email or null if invalid
 */
export function sanitizeEmail(email) {
    if (!email) return null;

    // Remove whitespace
    email = email.trim().toLowerCase();

    // Basic email validation regex
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(email)) {
        return null;
    }

    // Additional sanitization - remove any potential HTML
    email = sanitizeInput(email);

    return email;
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param {String} url - URL to sanitize
 * @returns {String|null} Sanitized URL or null if dangerous
 */
export function sanitizeURL(url) {
    if (!url) return null;

    url = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
    if (dangerousProtocols.test(url)) {
        return null;
    }

    // Only allow http, https, mailto, and relative URLs
    const safeProtocols = /^(https?:|mailto:|\/|\.)/i;
    if (!safeProtocols.test(url)) {
        return null;
    }

    return url;
}

/**
 * Escape HTML special characters
 * @param {String} text - Text to escape
 * @returns {String} Escaped text
 */
export function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };

    return String(text).replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate input length
 * @param {String} input - Input to validate
 * @param {Number} minLength - Minimum length
 * @param {Number} maxLength - Maximum length
 * @returns {Boolean} Whether input is valid length
 */
export function validateLength(input, minLength = 1, maxLength = 1000) {
    if (!input) return false;
    const length = input.trim().length;
    return length >= minLength && length <= maxLength;
}

/**
 * Smooth scroll to a specific section
 * @param {String} sectionId - ID of the section to scroll to
 */
export function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = section.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Add touch feedback to interactive elements
 * @param {String} selector - CSS selector for elements
 */
export function addTouchFeedback(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function () {
            this.style.transform = '';
        }, { passive: true });
    });
}

/**
 * Animate a stat value from 0 to target
 * @param {HTMLElement} element - The element to animate
 */
export function animateStatValue(element) {
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

/**
 * Track events for analytics
 * @param {String} category - Event category
 * @param {String} action - Event action
 * @param {String} label - Event label
 */
export function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

/**
 * Save data to localStorage
 * @param {String} key - Storage key
 * @param {*} data - Data to save
 */
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 * @param {String} key - Storage key
 * @returns {*} Parsed data or null
 */
export function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Generate a random color in HSL format
 * @returns {String} HSL color string
 */
export function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 60%)`;
}

/**
 * Check if user prefers reduced motion
 * @returns {Boolean}
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if device is mobile
 * @returns {Boolean}
 */
export function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Trigger haptic feedback if available
 * @param {Number|Array} pattern - Vibration pattern
 */
export function hapticFeedback(pattern = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}
