# Changelog

All notable changes to the New Year 2026 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-17

### Added - Security & Sanitization 🔒

#### Security Functions
- **Input Sanitization**: Comprehensive XSS protection with `sanitizeInput()`
  - Removes `<script>` tags and content
  - Strips event handlers (onclick, onerror, onload, etc.)
  - Blocks `javascript:` and `data:text/html` protocols
  - HTML entity encoding for special characters
  - Whitespace trimming

- **HTML Sanitization**: Selective tag filtering with `sanitizeHTML()`
  - Whitelist-based approach (allows only safe tags)
  - Removes all attributes from allowed tags
  - Converts disallowed tags to text nodes

- **Email Validation**: RFC-compliant validation with `sanitizeEmail()`
  - Length constraints (5-100 characters)
  - Proper email format checking
  - Consecutive dot prevention
  - Lowercase normalization

- **URL Validation**: Protocol security with `sanitizeURL()`
  - Blocks dangerous protocols (javascript:, data:, vbscript:, file:)
  - Allows only http(s), mailto, and relative URLs
  - XSS prevention for links

- **HTML Escaping**: Entity encoding with `escapeHTML()`
  - Converts &, <, >, ", ', / to HTML entities
  - Prevents HTML injection attacks

- **Length Validation**: DoS protection with `validateLength()`
  - Configurable min/max constraints
  - Prevents buffer overflow attempts
  - Empty/whitespace-only detection

#### Enhanced Validations
- **Wishes System**
  - 3-200 character limit
  - XSS sanitization applied
  - Safe DOM manipulation (no innerHTML)
  - User feedback notifications

- **Contact Form**
  - Name: 2-50 characters, letters/spaces/hyphens/apostrophes only
  - Email: 5-100 characters, RFC-compliant format
  - Message: 10-1000 characters, fully sanitized
  - Real-time validation with visual feedback
  - ARIA announcements for screen readers

#### UI Improvements
- Temporary notification system for user feedback
- Success/error message animations (slideIn/slideOut)
- Enhanced form error display with ARIA support
- Mobile-optimized notification positioning

#### Documentation
- **SECURITY.md**: Complete security implementation guide
  - XSS prevention strategies
  - Attack vector documentation
  - Code examples and test cases
  - Best practices and guidelines
- Updated **README.md** with security section
- Updated **docs/MODULES.md** with security functions
- Updated **docs/IMPLEMENTATION-SUMMARY.md** with security details

### Changed
- Enhanced `utils.js` with 6 security functions (now 6.5KB)
- Improved `interactions.js` validation logic (now 14KB)
- Updated all user input handling to use safe DOM manipulation
- Strengthened form validation with enhanced regex patterns
- Improved error messages with sanitization

### Security
- All user inputs now sanitized against XSS attacks
- Multiple layers of validation (client-side)
- Safe DOM API usage throughout (textContent over innerHTML)
- Protocol validation for URLs
- Event handler stripping from all inputs
- HTML entity encoding for all displayed user content

---

## [1.5.0] - 2025-12-17

### Added - Modular Architecture 📦

#### Code Organization
- Split monolithic `script.js` (883 lines) into 4 focused modules
- Created `js/` directory for modular JavaScript files
- Implemented ES6 module system with import/export

#### New Modules
- **js/utils.js** (4.5KB)
  - Utility functions and helpers
  - Performance optimization tools
  - Storage management
  - Analytics ready

- **js/animations.js** (10.4KB)
  - Particle system (adaptive count: 50 desktop, 25 mobile)
  - Fireworks canvas engine
  - Confetti effects
  - Celebration animations

- **js/countdown.js** (4.8KB)
  - New Year countdown timer
  - Year progress tracker
  - Animated value updates
  - Statistics counter

- **js/interactions.js** (12KB)
  - Wishes submission system
  - Resolution tracker
  - Quotes carousel with swipe
  - Contact form handling
  - Back to top button

#### Documentation
- **docs/MODULES.md**: Complete module reference
- **docs/IMPLEMENTATION-SUMMARY.md**: Implementation details
- **README.md**: Project overview and structure
- JSDoc comments for all functions

### Changed
- Converted `script.js` to ES6 module entry point (4.8KB)
- Updated `index.html` to use `<script type="module">`
- Improved code organization and maintainability
- Enhanced function reusability across modules

### Improved
- Better code separation of concerns
- Easier debugging (issues isolated to modules)
- Tree-shaking ready for production builds
- Professional project structure

---

## [1.4.0] - 2025-12-17

### Added - Navigation Enhancement ⬆️

#### Back to Top Button
- Floating button with glassmorphism design
- Appears after 500px scroll
- Smooth scroll to top animation
- Haptic feedback on click
- Premium hover effects with gradient
- Pulsing animation when visible
- Bouncing arrow icon
- Mobile optimized (52px on mobile, 56px on desktop)

#### Accessibility
- ARIA label for screen readers
- Keyboard accessible
- Touch-optimized for mobile devices
- Debounced scroll event for performance

#### Styling
- Glassmorphism effect with backdrop blur
- Gradient hover state
- Smooth entrance/exit animations
- Fixed positioning (bottom: 80px, right: 20px)
- Responsive sizing for mobile devices

---

## [1.3.0] - 2025-12-16

### Added - Content Expansion 📅

#### Timeline Section
- 2026 Year Timeline with 4 milestones
- Vertical timeline design with dots
- Gradient date badges
- Hover animations
- Mobile-responsive layout

#### Memories Gallery
- Memories of 2025 section
- 5 featured months (Jan, Mar, Jun, Sep, Dec)
- Staggered animations
- Emoji-based visual indicators
- Card hover effects

#### Quotes Carousel
- 4 Inspirational quotes
- Auto-rotation (5 second intervals)
- Navigation buttons (prev/next)
- Pagination dots
- Swipe gesture support for mobile
- Pause on hover
- Smooth transitions

#### Resolutions Tracker
- 6 Resolution categories:
  - Health & Fitness 💪
  - Learn & Grow 📚
  - Career Goals 💼
  - Relationships ❤️
  - Financial Freedom 💰
  - Travel & Adventure 🌍
- Click to update progress (increments by 10%)
- Visual progress bars
- 100% completion celebration effect
- Progress persistence

### Changed
- Enhanced mobile navigation with horizontal scroll
- Improved touch feedback on all interactive cards
- Added watermark with creator attribution

---

## [1.2.0] - 2025-12-16

### Added - Interactive Features 🎯

#### Wishes System
- User wish submission
- Real-time display of wishes
- Confetti animation on submission
- Random emoji selection (6 variations)
- localStorage integration ready
- Wish cards with glassmorphism

#### Contact Form
- Full contact form with validation
- Name, email, and message fields
- Real-time field validation
- Error display system
- Success message animation
- Form reset on successful submission
- Simulated backend submission

#### Statistics
- Animated statistics counters
- 365 Days of Opportunity
- 8,760 Hours to Excel
- 525,600 Minutes to Shine
- Intersection Observer for scroll-triggered animation
- Count-up animation effect

---

## [1.1.0] - 2025-12-16

### Added - Visual Effects ✨

#### Particle System
- Background particle animation
- 50 floating particles with varied speeds
- Random colors from theme palette
- Smooth animations with GPU acceleration

#### Fireworks
- Canvas-based fireworks animation
- Click-to-launch functionality
- Particle physics (gravity, air resistance)
- Trail effects
- Color variations
- Auto-stops after 30 seconds
- Responsive canvas sizing

#### Goals & Dreams Section
- 3 Feature cards (Set Goals, Take Action, Achieve Success)
- Hover animations with shine effect
- Glassmorphism card design
- Icon with bounce animation

### Improved
- Performance optimization for animations
- Mobile-friendly particle count
- GPU-accelerated transforms

---

## [1.0.0] - 2025-12-16

### Added - Initial Release 🎉

#### Core Features
- **Hero Section**
  - Animated year transition (2025 → 2026)
  - Gradient text effects
  - Floating celebration elements
  - CTA buttons with effects

- **Countdown Timer**
  - Live countdown to January 1, 2026
  - Days, hours, minutes, seconds display
  - Animated value changes
  - Progress bar showing year completion
  - Glass-morphism card design

- **Navigation**
  - Fixed navigation bar
  - Active link highlighting
  - Smooth scroll to sections
  - Glassmorphism effect

- **Footer**
  - Social media icons
  - Copyright information
  - Animated social icons

#### Design System
- **Color Palette**
  - Primary: Purple gradient (#667eea → #764ba2)
  - Secondary: Pink gradient (#f093fb → #f5576c)
  - Accent: Blue gradient (#4facfe → #00f2fe)
  - Gold: Orange gradient (#f6d365 → #fda085)
  - Dark background: #0a0a0f

- **Typography**
  - Primary font: Outfit (Google Fonts)
  - Display font: Playfair Display (Google Fonts)
  - Responsive font sizing with clamp()

- **Effects**
  - Glassmorphism throughout
  - Smooth animations
  - Gradient backgrounds
  - Box shadows with glow
  - Hover effects

#### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-optimized buttons (min 48px)
- Flexible grid layouts
- Scaled typography

#### Accessibility
- Semantic HTML5
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Reduced motion support
- Screen reader friendly

#### Performance
- Debounced scroll events
- RequestAnimationFrame for animations
- CSS containment
- Optimized asset loading
- Efficient selectors

---

## [0.1.0] - 2025-12-16

### Development Setup
- Project structure initialized
- Git repository created
- Initial HTML structure
- Base CSS setup
- JavaScript foundation
- Google Fonts integration

---

## Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

## Links

- **Repository**: [github.com/Srijan-XI/wishto2026](https://github.com/Srijan-XI/wishto2026)
- **Documentation**: See README.md, SECURITY.md, and docs/
- **Issues**: Report bugs on GitHub Issues
- **Author**: srijan-xi

---

**Note**: This changelog follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New features (backward compatible)
- **PATCH** version (0.0.X): Bug fixes (backward compatible)
