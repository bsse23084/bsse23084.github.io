document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // 0. GSAP SCROLL HERO ANIMATION
    // =========================================
    const heroSection = document.querySelector('.hero-gsap');
    
    if (heroSection) {
        const initialContent = heroSection.querySelector('.hero-initial-content');
        const finalContent = heroSection.querySelector('.hero-final-content');
        const bgImage = heroSection.querySelector('.hero-bg-image');
        const title = heroSection.querySelector('.hero-animated-title');
        const subtitle = heroSection.querySelector('.hero-animated-subtitle');
        const cards = heroSection.querySelectorAll('.hero-animated-card');
        
        // Set initial states
        gsap.set([title, subtitle], { opacity: 0, y: 30 });
        
        // Check if mobile or tablet for initial card positions
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        if (isMobile) {
            gsap.set(cards, { opacity: 0, scale: 0.8, x: 100, y: 60 });
        } else if (isTablet) {
            gsap.set(cards, { opacity: 0, scale: 0.85, x: 80, y: 40 });
        } else {
            gsap.set(cards, { opacity: 0, scale: 0.8, y: 60 });
        }
        
        // Create the main timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: () => {
                    // Shorter scroll distance on mobile/tablet for better UX
                    if (window.innerWidth <= 768) {
                        return '+=150%';
                    } else if (window.innerWidth <= 1024) {
                        return '+=200%';
                    }
                    return '+=300%';
                },
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onEnter: () => {
                    // Ensure navbar doesn't overlap
                    document.querySelector('.navbar').style.zIndex = '1000';
                },
                onLeave: () => {
                    document.querySelector('.navbar').style.zIndex = '';
                }
            }
        });
        
        // Phase 1: Fade out initial content
        tl.to(initialContent, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: 'power2.inOut'
        })
        .to(bgImage, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, '<')
        .to('.hero-gsap .hero-bg-image.mirrored', {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, '<');
        
        // Phase 2: Reveal final content with black background
        tl.to(finalContent, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5,
            ease: 'power2.out'
        })
        .to('.hero-gsap .hero-bg-solid', {
            background: 'linear-gradient(180deg, #000000 0%, #000000 100%)',
            duration: 1,
            ease: 'power2.inOut'
        }, '-=0.5')
        .to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');
        
        // Phase 3: Animate cards - use responsive check
        const checkMobile = () => window.innerWidth <= 768;
        const checkTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
        
        if (checkMobile()) {
            // Mobile: cards slide in one by one from right
            cards.forEach((card, index) => {
                tl.to(card, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, `-=${index > 0 ? 0.5 : 0}`);
            });
        } else if (checkTablet()) {
            // Tablet: cards animate with slight horizontal offset
            const centerIndex = Math.floor(cards.length / 2);
            
            tl.to(cards[centerIndex], {
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.2');
            
            cards.forEach((card, index) => {
                if (index !== centerIndex) {
                    tl.to(card, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: 0,
                        duration: 0.6,
                        ease: 'power3.out'
                    }, '-=0.4');
                }
            });
        } else {
            // Desktop: cards animate in with stagger from center
            const centerIndex = Math.floor(cards.length / 2);
            
            // First animate center card
            tl.to(cards[centerIndex], {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3');
            
            // Then animate left and right cards
            const leftCards = [];
            const rightCards = [];
            for (let i = centerIndex - 1; i >= 0; i--) {
                leftCards.push(cards[i]);
            }
            for (let i = centerIndex + 1; i < cards.length; i++) {
                rightCards.push(cards[i]);
            }
            
            // Animate left cards
            leftCards.forEach((card, index) => {
                tl.to(card, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                }, '-=0.4');
            });
            
            // Animate right cards  
            rightCards.forEach((card, index) => {
                tl.to(card, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                }, '-=0.4');
            });
            
            // Phase 4: Horizontal scroll/caroussel effect
            tl.to(cards, {
                x: (index) => {
                    const offset = (index - centerIndex) * -80;
                    return offset;
                },
                duration: 1,
                ease: 'power2.inOut'
            }, '+=0.3');
        }
        
        // Refresh ScrollTrigger after animation setup
        ScrollTrigger.refresh();
        
        // Handle resize - refresh ScrollTrigger
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        });
    }

    // =========================================
    // 1. PAGE LOAD ANIMATION SEQUENCE
    // =========================================
    const body = document.body;
    body.classList.add('page-loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('page-loading');
            body.classList.add('page-loaded');
            animateHeroEntrance();
        }, 100);
    });

    function animateHeroEntrance() {
        // Target the new hero structure
        const heroTitle = document.querySelector('.hero-gsap .hero-title, .hero .hero-title');
        const heroSubtitle = document.querySelector('.hero-gsap .hero-subtitle, .hero .hero-subtitle');
        const heroCtas = document.querySelector('.hero-gsap .hero-cta-group, .hero .hero-cta-group');
        const heroVisual = document.querySelector('.hero-gsap .hero-text-content, .hero .hero-visual');

        const elements = [heroTitle, heroSubtitle, heroCtas, heroVisual].filter(Boolean);
        elements.forEach((el, i) => {
            el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // Set initial state for hero elements
    const heroSelectors = '.hero-gsap .hero-title, .hero-gsap .hero-subtitle, .hero-gsap .hero-cta-group, .hero-gsap .hero-text-content, .hero .hero-title, .hero .hero-subtitle, .hero .hero-cta-group, .hero .hero-visual';
    const heroEls = document.querySelectorAll(heroSelectors);
    heroEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
    });

    // =========================================
    // 2. CUSTOM CURSOR GLOW
    // =========================================
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.08;
        cursorY += (mouseY - cursorY) * 0.08;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor states
    const interactiveEls = document.querySelectorAll('a, button, .carousel-card, .bento-card, .case-card, .article-card, .case-study-card, .feature-card');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-dot-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-dot-hover');
        });
    });

    // =========================================
    // 3. NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =========================================
    // 4. SMOOTH SCROLLING
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // =========================================
    // 5. SCROLL REVEAL — STAGGERED ANIMATIONS
    // =========================================
    const revealSets = [
        { selector: '.section-title, .section-subtitle, .hero-title', delay: 0 },
        { selector: '.feature-card', delay: 0, stagger: true },
        { selector: '.bento-item, .bento-card', delay: 0, stagger: true },
        { selector: '.case-card', delay: 0, stagger: true },
        { selector: '.article-card', delay: 0, stagger: true },
        { selector: '.step-card', delay: 0, stagger: true },
        { selector: '.side-card', delay: 0, stagger: true },
        { selector: '.carousel-card', delay: 0, stagger: true },
        { selector: '.section-body, .split-left, .split-right', delay: 0 },
        { selector: '.testimonial-card', delay: 0 },
        { selector: '.ticker-title', delay: 0 },
        { selector: '.cta-container', delay: 0 },
    ];

    const revealElements = new Set();

    revealSets.forEach(({ selector, stagger }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!revealElements.has(el)) {
                revealElements.add(el);
                el.style.opacity = '0';
                el.style.transform = 'translateY(32px)';
                el.style.transition = `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)`;
                el.dataset.revealDelay = stagger ? i * 0.1 : 0;
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.revealDelay || 0);
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay * 1000);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // 6. COUNT-UP ANIMATION FOR STATS
    // =========================================
    function animateCountUp(el, target, suffix = '', prefix = '') {
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = startVal + (target - startVal) * eased;

            let display;
            if (target % 1 !== 0) {
                display = prefix + current.toFixed(2) + suffix;
            } else {
                display = prefix + Math.round(current) + suffix;
            }
            el.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Find metric values and counter elements
    const counterEls = [
        { selector: '.metric-value', parse: true },
        { selector: '.card-value', parse: true },
    ];

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const el = entry.target;
                const text = el.textContent.trim();

                // Parse the number
                const numMatch = text.match(/[\d.,]+/);
                if (numMatch) {
                    const rawNum = numMatch[0].replace(',', '.');
                    const num = parseFloat(rawNum);
                    const prefix = text.match(/^[^0-9]*/)?.[0] || '';
                    const suffix = text.match(/[^0-9.,]+$/)?.[0] || '';

                    if (!isNaN(num) && num > 0) {
                        animateCountUp(el, num, suffix, prefix);
                    }
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value').forEach(el => {
        // Store original text to parse suffix/prefix
        el.dataset.originalText = el.textContent;
        counterObserver.observe(el);
    });

    // =========================================
    // 7. 3D TILT EFFECT ON CARDS
    // =========================================
    function addTilt(selector, strength = 15) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * strength;
                const rotY = ((cx - x) / cx) * strength;

                card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease';

                // Shine effect
                const shine = card.querySelector('.card-shine');
                if (shine) {
                    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
                    shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.08) 0%, transparent 60%)`;
                    shine.style.opacity = '1';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                const shine = card.querySelector('.card-shine');
                if (shine) shine.style.opacity = '0';
            });

            // Add shine overlay
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(shine);
        });
    }

    addTilt('.bento-card', 8);
    addTilt('.case-card', 8);
    addTilt('.article-card', 8);
    addTilt('.carousel-card', 10);
    addTilt('.side-card', 8);
    addTilt('.testimonial-card', 5);

    // =========================================
    // 8. MAGNETIC BUTTON EFFECT
    // =========================================
    function addMagnetic(selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
                btn.style.transition = 'transform 0.2s ease';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    addMagnetic('.btn-primary, .btn-secondary');

    // =========================================
    // 9. IPHONE 3D PARALLAX
    // =========================================
    const iphoneContainer = document.querySelector('.iphone-3d-container');
    const iphoneMockup = document.querySelector('.iphone-mockup');

    if (iphoneContainer && iphoneMockup) {
        iphoneContainer.addEventListener('mousemove', (e) => {
            const rect = iphoneContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            iphoneMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            iphoneMockup.style.transition = 'transform 0.1s ease';
        });

        iphoneContainer.addEventListener('mouseleave', () => {
            iphoneMockup.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            iphoneMockup.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    // =========================================
    // 10. ANIMATED GRADIENT BG MESH (Hero) - Only for non-GSAP hero
    // =========================================
    const heroSectionOld = document.querySelector('.hero:not(.hero-gsap)');
    if (heroSectionOld) {
        const mesh = document.createElement('div');
        mesh.className = 'hero-mesh-bg';
        heroSectionOld.prepend(mesh);
    }

    // =========================================
    // 11. HOVER GLOW EFFECT ON FEATURE CARDS
    // =========================================
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--glow-x', `${x}px`);
            card.style.setProperty('--glow-y', `${y}px`);
        });
    });

    // =========================================
    // 13. SMOOTH PROGRESS BAR ANIMATION
    // =========================================
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    bar.style.width = '60%';
                }, 300);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });

    // =========================================
    // 14. TEXT SHIMMER ON HERO TITLE
    // =========================================
    const shimmerTitles = document.querySelectorAll('.hero-gsap .hero-title, .hero:not(.hero-gsap) .hero-title');
    shimmerTitles.forEach(title => {
        title.classList.add('shimmer-text');
    });

    // =========================================
    // 15. TICKER PAUSE ON HOVER
    // =========================================
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        tickerTrack.addEventListener('mouseenter', () => {
            tickerTrack.style.animationPlayState = 'paused';
        });
        tickerTrack.addEventListener('mouseleave', () => {
            tickerTrack.style.animationPlayState = 'running';
        });
    }

    // =========================================
    // 16. SECTION TITLE WORD SPLIT ANIMATION
    // =========================================
    function splitTextAnimation(selector) {
        document.querySelectorAll(selector).forEach(el => {
            // Skip already processed
            if (el.dataset.split) return;
            el.dataset.split = 'true';

            // Only animate section titles in non-hero sections
            if (el.closest('.hero')) return;

            const words = el.innerHTML.split(/(\s+|<br>)/);
            // skip complex HTML
            if (el.querySelectorAll('*').length > 2) return;

            el.classList.add('words-ready');
        });
    }

    splitTextAnimation('.section-title');

    // =========================================
    // 17. FEATURE CARD SPOTLIGHT EFFECT
    // =========================================
    document.querySelectorAll('.feature-card').forEach(card => {
        const spotLight = document.createElement('div');
        spotLight.className = 'feature-spotlight';
        card.appendChild(spotLight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            spotLight.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(248,96,17,0.06), transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            spotLight.style.background = 'transparent';
        });
    });

    // =========================================
    // 18. BENTO GRID MOUSE SPOTLIGHT
    // =========================================
    document.querySelectorAll('.bento-card, .bento-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.classList.add('mouse-over');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('mouse-over');
        });
    });

    // =========================================
    // 19. SECTION EASE-IN ANIMATIONS
    // Premium GSAP scroll-triggered reveals
    // =========================================
    
    // Helper function for section reveal animation
    function createSectionReveal(element, options = {}) {
        const {
            trigger = element,
            start = 'top 80%',
            y = 60,
            duration = 1,
            delay = 0,
            stagger = 0.1
        } = options;
        
        const children = element.querySelectorAll('.split-left, .split-right, .section-image, .text-pl, .section-title, .section-body, .revolut-list, .btn');
        
        if (children.length > 0) {
            gsap.set(children, {
                opacity: 0,
                y: y,
                scale: 0.98
            });
            
            gsap.to(children, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: trigger,
                    start: start,
                    toggleActions: 'play none none reverse'
                }
            });
        } else {
            gsap.set(element, {
                opacity: 0,
                y: y
            });
            
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: duration,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: trigger,
                    start: start,
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }
    
    // Meer dan alleen de basis - premium reveal
    const meerDanBasis = document.querySelector('.more-essentials');
    if (meerDanBasis) {
        createSectionReveal(meerDanBasis, {
            y: 50,
            duration: 0.9,
            stagger: 0.15
        });
    }
    
    // Storytelling section - already has auto-advance, no need for scroll reveal
    
    // Success stories section reveal
    const successStories = document.querySelector('.success-stories');
    if (successStories) {
        createSectionReveal(successStories, {
            y: 40,
            duration: 0.8,
            stagger: 0.1
        });
    }
    
    // Automate your spend section
    const automateSpend = document.querySelector('.automate-spend');
    if (automateSpend) {
        createSectionReveal(automateSpend, {
            y: 50,
            duration: 0.9,
            stagger: 0.12
        });
    }
    
    // Unique service section - light themed
    const uniqueService = document.querySelector('.unique-service');
    if (uniqueService) {
        createSectionReveal(uniqueService, {
            y: 40,
            duration: 0.9,
            stagger: 0.15
        });
    }
    
    // Features section
    const features = document.querySelector('.features');
    if (features) {
        createSectionReveal(features, {
            y: 50,
            duration: 0.9,
            stagger: 0.15
        });
    }
    
    // Bento values section
    const bentoValues = document.querySelector('.bento-values');
    if (bentoValues) {
        const bentoItems = bentoValues.querySelectorAll('.bento-item');
        
        gsap.set(bentoItems, {
            opacity: 0,
            y: 50,
            scale: 0.95
        });
        
        gsap.to(bentoItems, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bentoValues,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Testimonial hero
    const testimonialHero = document.querySelector('.testimonial-hero');
    if (testimonialHero) {
        createSectionReveal(testimonialHero, {
            y: 30,
            duration: 0.8,
            stagger: 0.1
        });
    }
    
    // How we work
    const howWeWork = document.querySelector('.how-we-work');
    if (howWeWork) {
        createSectionReveal(howWeWork, {
            y: 50,
            duration: 0.9,
            stagger: 0.12
        });
    }
    
    // Cases section
    const cases = document.querySelector('.cases');
    if (cases) {
        createSectionReveal(cases, {
            y: 40,
            duration: 0.8,
            stagger: 0.1
        });
    }
    
    // Articles section
    const articles = document.querySelector('.articles');
    if (articles) {
        createSectionReveal(articles, {
            y: 40,
            duration: 0.8,
            stagger: 0.1
        });
    }
    
    // CTA section
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        createSectionReveal(ctaSection, {
            y: 30,
            duration: 0.8,
            stagger: 0.1
        });
    }
    
    // Ticker section
    const tickerSection = document.querySelector('.ticker-section');
    if (tickerSection) {
        gsap.from(tickerSection.querySelectorAll('.ticker-item'), {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: tickerSection,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    // =========================================
    // 19. REVOLUT-STYLE STORYTELLING SECTION
    // Auto-advancing panels (no scroll, timer + indicators)
    // =========================================
    const storySection = document.querySelector('.storytelling-section');
    const storyPanels = document.querySelectorAll('.story-panel');
    const storyIndicators = document.querySelectorAll('.story-progress-indicator');
    
    // GSAP Scroll-triggered entrance animation
    if (storySection) {
        gsap.set(storySection, { opacity: 0 });
        gsap.to(storySection, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: storySection,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate progress indicators on scroll
        gsap.set('.story-progress-indicator', { scale: 0.8, opacity: 0 });
        gsap.to('.story-progress-indicator', {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: storySection,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    if (storySection && storyPanels.length > 0) {
        let currentPanel = 0;
        let autoAdvanceTimer = null;
        const totalPanels = storyPanels.length;
        const AUTO_ADVANCE_DELAY = 5000; // 5 seconds
        
        // Initialize: show first panel (no hiding needed)
        gsap.set(storyPanels, { opacity: 1, scale: 1 });
        gsap.set(storyPanels, { 
            opacity: (i) => i === 0 ? 1 : 0,
            scale: (i) => i === 0 ? 1 : 1.02,
            zIndex: (i) => i === 0 ? 1 : 0
        });
        
        // Initial content animation for first panel
        const firstPanel = storyPanels[0];
        const firstContent = firstPanel.querySelector('.story-panel-content');
        gsap.set(firstContent.children, { y: 30, opacity: 0 });
        gsap.to(firstContent.children, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            delay: 0.2
        });
        
        // Function to go to specific panel
        function goToPanel(index, animate = true) {
            // Validate index
            if (index < 0) index = totalPanels - 1;
            if (index >= totalPanels) index = 0;
            
            const targetPanel = storyPanels[index];
            const currentEl = storyPanels[currentPanel];
            
            if (animate) {
                // Animate out current panel content with seamless fade
                const currentContent = currentEl.querySelector('.story-panel-content');
                gsap.to(currentContent.children, {
                    y: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.04,
                    ease: 'power2.in'
                });
                
                // Seamless crossfade
                gsap.to(currentEl, {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
                
                gsap.set(targetPanel, { opacity: 0 });
                
                // Animate target panel in
                gsap.to(targetPanel, {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => {
                        // Animate in new panel content with stagger
                        const targetContent = targetPanel.querySelector('.story-panel-content');
                        gsap.fromTo(targetContent.children, 
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
                        );
                    }
                });
                
                // Swap z-index for proper layering
                gsap.set(targetPanel, { zIndex: 1 });
                gsap.set(currentEl, { zIndex: 0 });
            } else {
                gsap.set(storyPanels, { opacity: 0, zIndex: 0 });
                gsap.set(targetPanel, { opacity: 1, zIndex: 1 });
            }
            
            // Update indicators
            storyIndicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            currentPanel = index;
            
            // Reset auto-advance timer
            resetAutoAdvance();
        }
        
        // Function to go to next panel
        function nextPanel() {
            goToPanel(currentPanel + 1);
        }
        
        // Function to go to previous panel
        function prevPanel() {
            goToPanel(currentPanel - 1);
        }
        
        // Auto-advance functions
        function startAutoAdvance() {
            stopAutoAdvance();
            autoAdvanceTimer = setInterval(() => {
                nextPanel();
            }, AUTO_ADVANCE_DELAY);
        }
        
        function stopAutoAdvance() {
            if (autoAdvanceTimer) {
                clearInterval(autoAdvanceTimer);
                autoAdvanceTimer = null;
            }
        }
        
        function resetAutoAdvance() {
            startAutoAdvance();
        }
        
        // Indicator click handlers
        storyIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToPanel(index);
            });
        });
        
        // Pause auto-advance on hover/focus
        storySection.addEventListener('mouseenter', stopAutoAdvance);
        storySection.addEventListener('mouseleave', startAutoAdvance);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only handle if section is visible in viewport
            const rect = storySection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible) return;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextPanel();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                prevPanel();
            }
        });
        
        // Start auto-advance
        startAutoAdvance();
        
        // Handle visibility change - pause when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoAdvance();
            } else {
                startAutoAdvance();
            }
        });
    }

    // =========================================
    // 20. ENTRANCE ANIMATIONS FOR SPECIFIC SECTIONS
    // =========================================
    
    // Testimonial Hero Section - Solution Afbouw Group
    const testimonialCard = document.querySelector('.testimonial-card');
    if (testimonialCard) {
        const testLogo = testimonialCard.querySelector('.test-logo');
        const testAuthor = testimonialCard.querySelector('.test-author');
        const testQuote = testimonialCard.querySelector('.test-quote');
        const testLink = testimonialCard.querySelector('.link-arrow');
        
        gsap.set([testLogo, testAuthor, testQuote, testLink], {
            opacity: 0,
            y: 40,
            scale: 0.95
        });
        
        gsap.to([testLogo, testAuthor, testQuote, testLink], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: testimonialCard,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Articles Section - Staggered entrance
    const articlesSection = document.querySelector('.articles');
    if (articlesSection) {
        const sectionHeader = articlesSection.querySelector('.section-header');
        const articleCards = articlesSection.querySelectorAll('.article-card');
        
        if (sectionHeader) {
            gsap.set(sectionHeader, { opacity: 0, y: 30 });
            gsap.to(sectionHeader, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: articlesSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
        
        gsap.set(articleCards, { opacity: 0, y: 50, scale: 0.92 });
        gsap.to(articleCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: articlesSection,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });
        
        articleCards.forEach((card) => {
            const tag = card.querySelector('.article-tag');
            const title = card.querySelector('h4');
            gsap.set([tag, title], { opacity: 0, x: -20 });
            gsap.to([tag, title], {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
    
    // CTA Section - Klaar om te groeien
    const ctaSectionEl = document.querySelector('.cta-section');
    if (ctaSectionEl) {
        const ctaTitle = ctaSectionEl.querySelector('h2');
        const ctaText = ctaSectionEl.querySelector('p');
        const ctaButtons = ctaSectionEl.querySelector('.cta-buttons');
        const ctaBtns = ctaSectionEl.querySelectorAll('.btn');
        
        gsap.set([ctaTitle, ctaText, ctaButtons], { opacity: 0, y: 30 });
        gsap.to([ctaTitle, ctaText, ctaButtons], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ctaSectionEl,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });
        
        gsap.set(ctaBtns, { opacity: 0, scale: 0.85, y: 15 });
        gsap.to(ctaBtns, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: ctaSectionEl,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Storytelling - Autolease panel enhancement
    const storyPanelsAll = document.querySelectorAll('.story-panel');
    if (storyPanelsAll[2]) {
        const autoleasePanel = storyPanelsAll[2];
        const category = autoleasePanel.querySelector('.story-panel-category');
        const title = autoleasePanel.querySelector('.story-panel-title');
        const text = autoleasePanel.querySelector('.story-panel-text');
        const cta = autoleasePanel.querySelector('.story-panel-cta');
        
        gsap.set([category, title, text, cta], { opacity: 0, y: 25 });
        gsap.to([category, title, text, cta], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: autoleasePanel,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });
    }

});
