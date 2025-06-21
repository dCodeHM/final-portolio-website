// Performance optimizations and mobile navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements for better performance
    const navLinks = document.querySelectorAll('nav a[data-section], .mobile-nav a[data-section]');
    const sectionButtons = document.querySelectorAll('button[data-section-link]');
    const sections = document.querySelectorAll('main > section.section');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Performance: Use Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Intersection Observer for card animations
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.card-animate').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Mobile Navigation Toggle
    function toggleMobileNav() {
        mobileNav.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        
        if (mobileNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = ''; // Restore scroll
        }
    }
    
    // Close mobile nav when clicking outside
    function closeMobileNav() {
        if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    }
    
    // Event listeners for mobile navigation
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
    
    // Make the first section active by default
    sections[0].classList.add('active');
    navLinks[0].classList.add('active');
    
    // Performance: Debounce function for smooth scrolling
    function debounce(func, wait) {
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
    
    // Set active section with performance optimizations
    const setActiveSection = debounce(function(sectionId) {
        // Update sections visibility
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                // Trigger animation for cards in active section
                setTimeout(() => {
                    section.querySelectorAll('.card-animate').forEach(card => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }, 100);
            } else {
                section.classList.remove('active');
            }
        });
        
        // Update navigation classes
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update URL hash without triggering scroll
        history.replaceState(null, null, `#${sectionId}`);
    }, 50);
    
    // Navigation link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            setActiveSection(targetSection);
        });
    });
    
    // Section button click handlers
    sectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section-link');
            setActiveSection(targetSection);
        });
    });
    
    // Handle direct navigation via URL hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Check if hash corresponds to a valid section
            const validSection = Array.from(sections).find(section => section.id === hash);
            if (validSection) {
                setActiveSection(hash);
            }
        } else {
            // Default to first section if no hash or invalid hash
            setActiveSection(sections[0].id);
        }
    }
    
    // Initial load based on hash
    handleHashChange();
    
    // Listen for hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleHashChange);
    
    // Performance: Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe images for lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Performance: Optimize form handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Performance: Add touch gesture support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    function handleSwipe() {
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (touchEndY < touchStartY && touchStartY - touchEndY > 50) {
            // Swipe up - go to next section
            if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id);
            }
        } else if (touchEndY > touchStartY && touchEndY - touchStartY > 50) {
            // Swipe down - go to previous section
            if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
            }
        }
    }
    
    // Touch event listeners for mobile swipe navigation
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    // Performance: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                }
                break;
            case 'Home':
                e.preventDefault();
                setActiveSection(sections[0].id);
                break;
            case 'End':
                e.preventDefault();
                setActiveSection(sections[sections.length - 1].id);
                break;
        }
    });
    
    // Performance: Add smooth scrolling for better UX
    const smoothScrollTo = (element) => {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    // Performance: Optimize animations for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
    
    // Performance: Add loading states
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Performance: Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate any layout-dependent elements
            if (mobileNav.classList.contains('active')) {
                closeMobileNav();
            }
        }, 250);
    });
    
    // Performance: Add service worker for caching (if supported)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Performance: Add CSS for loading states
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-dark);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .loading::after {
        content: '';
        width: 50px;
        height: 50px;
        border: 3px solid var(--color-teal-light);
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
