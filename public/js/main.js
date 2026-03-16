document.addEventListener('DOMContentLoaded', () => {

    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');

    const preloaderTl = gsap.timeline();
    preloaderTl.to(loaderBar, { width: "100%", duration: 1.5, ease: "power2.inOut" })
        .to(preloader, { y: "-100%", duration: 1, ease: "power4.inOut", delay: 0.2 })
        .call(() => {
            startHeroReveal(() => {
                initScrollAnimations();
            });
        });

    // 1. Initialize Lenis (Smooth Momentum Scroll)
    const lenis = new Lenis({
        duration: 2.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.7,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Bridge Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Additional UI
    lenis.on('scroll', (e) => {
        // Update Scroll Progress Bar
        const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        gsap.to(".scroll-progress-bar", { width: `${progress}%`, duration: 0.1, ease: "none" });

        // Dynamic Skew Effect (Scoped to prevent fighting with reveal animations)
        const velocity = Math.min(Math.max(e.velocity, -20), 20);
        gsap.to(".hero-center-content, .about-hero-text", {
            skewY: velocity * 0.1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
        });
        gsap.to(".marquee-container", {
            skewX: velocity * 0.8,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto"
        });
    });

    // 1.5 Sync Current Year
    const currentYear = new Date().getFullYear();
    const scrollYear = document.querySelector('.scroll-status span:last-child');
    const footerYear = document.querySelector('.copyright');

    if (scrollYear) scrollYear.textContent = `Active ${currentYear}`;
    if (footerYear) footerYear.textContent = `© ${currentYear} Agung Prayogi — Portfolio`;

    // 2. Optimized Mouse Interaction System
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorVisual = document.createElement('div');
    cursorVisual.className = 'cursor-visual';
    const cursorInternal = document.createElement('div');
    cursorInternal.className = 'cursor-internal';
    
    cursor.appendChild(cursorVisual);
    cursorVisual.appendChild(cursorInternal);
    document.body.appendChild(cursor);

    const mouse = { x: 0, y: 0 };
    const elements = {
        title: document.querySelector('.hero-main-title'),
        nodes: gsap.utils.toArray('.node'),
        trigger: document.querySelector('.menu-trigger'),
        heroImg: document.querySelector('.hero-image-cinematic'),
        imgMask: document.querySelector('.hero-image-cinematic .image-mask'),
        glow: document.querySelector('.hero-image-cinematic .glow-bg')
    };

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        const xPercent = (mouse.x / window.innerWidth - 0.5);
        const yPercent = (mouse.y / window.innerHeight - 0.5);

        // 1. Cursor Follow (Using quickTo for robustness)
        xTo(mouse.x);
        yTo(mouse.y);

        // 1.1 Velocity-based Stretching (Cinematic Feel)
        const velX = e.movementX || 0;
        const velY = e.movementY || 0;
        const speed = Math.sqrt(velX * velX + velY * velY);
        const angle = Math.atan2(velY, velX) * 180 / Math.PI;

        if (speed > 2) {
            gsap.to(cursorVisual, {
                scaleX: 1 + Math.min(speed * 0.05, 0.8),
                scaleY: 1 - Math.min(speed * 0.03, 0.4),
                rotation: angle,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
            });
        } else {
            gsap.to(cursorVisual, {
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto"
            });
        }

        // 2. Hero Image Parallax (Multi-layer)
        if (elements.heroImg) {
            const xPos = xPercent * 150;
            const yPos = yPercent * 100;

            gsap.to(elements.heroImg, {
                x: xPos * 0.5,
                y: yPos * 0.5,
                yPercent: -50,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true
            });
            gsap.to(elements.imgMask, {
                x: xPos * 0.8,
                y: yPos * 0.8,
                rotateX: yPercent * -25,
                rotateY: xPercent * 25,
                transformPerspective: 1200,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true
            });
            gsap.to(elements.glow, {
                x: xPos * 2.5,
                y: yPos * 2.5,
                duration: 2,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true
            });
        }

        // 3. Magnetic Menu
        if (elements.trigger) {
            const bound = elements.trigger.getBoundingClientRect();
            const centerX = bound.left + bound.width / 2;
            const centerY = bound.top + bound.height / 2;
            const dist = Math.sqrt(Math.pow(mouse.x - centerX, 2) + Math.pow(mouse.y - centerY, 2));

            if (dist < 80) {
                gsap.to(elements.trigger, { x: (mouse.x - centerX) * 0.3, y: (mouse.y - centerY) * 0.3, duration: 0.3, overwrite: "auto" });
            } else {
                gsap.to(elements.trigger, { x: 0, y: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
            }
        }

        // 4. Hero Title Tilt
        if (elements.title) {
            gsap.to(elements.title, { rotateY: xPercent * 10, rotateX: yPercent * -10, transformPerspective: 800, duration: 0.8, overwrite: "auto" });
        }

        // 5. Tech Nodes
        elements.nodes.forEach((node, i) => {
            gsap.to(node, { x: xPercent * (15 + i * 5), y: yPercent * (15 + i * 5), duration: 1.5, ease: "power1.out", overwrite: "auto" });
        });
    });

    // Cursor Hover Effects (Links & Buttons)
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-large');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-large');
        });
    });

    const lockSVG = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 11V7C18 3.68629 15.3137 1 12 1C8.68629 1 6 3.68629 6 7V11H3V23H21V11H18ZM12 18.5C11.1716 18.5 10.5 17.8284 10.5 17C10.5 16.1716 11.1716 15.5 12 15.5C12.8284 15.5 13.5 16.1716 13.5 17C13.5 17.8284 12.8284 18.5 12 18.5ZM8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11H8Z"/>
    </svg>`;

    // 3. Cinematic Opening Animation
    function startHeroReveal(onCompleteCallback) {
        const tl = gsap.timeline({
            onComplete: onCompleteCallback
        });
        tl.from(".hi-iam-modern", { y: 20, opacity: 0, duration: 1, ease: "power3.out" })
            .from(".hero-main-title .line", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", stagger: 0.2 }, "-=0.8")
            .from(".hero-main-title .line-italic", { x: -50, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1.2")
            .from(".hero-image-cinematic", { x: 100, opacity: 0, duration: 2, ease: "power2.out" }, "-=1.5")
            .from(".hero-role-modern", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
            .from(".scroll-status", { opacity: 0, duration: 2 }, "-=0.5")
            .from(".scroll-indicator-modern", { y: 20, opacity: 0, duration: 1 }, "-=1");
    }





    function initScrollAnimations() {
        // 8. The "Unified Collision" Transition (Hero Exit + About Entrance)
        const transitionTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-cinematic",
                start: "top top",
                end: "bottom+=50% top",
                scrub: 1.2
            }
        });

        // --- PAGE 1: Chaotic Escape (Explosion) ---
        transitionTl.to(".hero-main-title .line:nth-child(1)", { x: -1200, y: -600, rotation: -60, scale: 3, filter: "blur(25px)", opacity: 0 }, 0)
            .to(".hero-main-title .line-italic", { x: 1500, y: 500, rotation: 45, scale: 0.2, filter: "blur(25px)", opacity: 0 }, 0.05)
            .to(".hero-image-cinematic", { scale: 0, rotation: -180, filter: "blur(30px)", opacity: 0 }, 0)
            .to(".hi-iam-modern", { y: -700, x: -400, opacity: 0, scale: 2 }, 0)
            .to(".hero-subline", { y: 800, x: 400, opacity: 0 }, 0.1)
            .to(".scroll-indicator-modern", { scale: 5, opacity: 0 }, 0);

        // --- PAGE 2: Messy Entrance (Simultaneous) ---
        transitionTl.from(".about-line:nth-of-type(1)", { x: 1000, y: 600, rotation: 45, scale: 0.1, opacity: 0, filter: "blur(40px)" }, 0)
            .from(".about-line:nth-of-type(2)", { x: -900, y: 800, rotation: -40, scale: 2, opacity: 0, filter: "blur(40px)" }, 0.05)
            .from(".about-line:nth-of-type(3)", { x: 500, y: 1200, rotation: 30, scale: 0.5, opacity: 0, filter: "blur(40px)" }, 0.1)
            .from(".about-details-minimal", {
                y: 800, scale: 0.3, rotationX: 45, opacity: 0, filter: "blur(20px)", ease: "power2.out"
            }, 0.2)
            .from(".scroll-indicator-data", {
                y: 100, rotation: 10, opacity: 0, filter: "blur(10px)", duration: 1
            }, 0.3);

        // --- CONTINUOUS PAGE ANIMATIONS ---

        // A. Stats Counter & Reveal
        gsap.from(".stat-item", {
            scrollTrigger: {
                trigger: ".stats-cinema",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power4.out", filter: "blur(10px)"
        });

        // B. Bio Reveal
        const bioTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-detailed-section",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
        bioTl.from(".about-detailed-section .section-header-minimal", { x: -100, opacity: 0, duration: 1 })
            .from(".about-text p", { y: 50, opacity: 0, stagger: 0.3, duration: 1 }, "-=0.5")
            .from(".about-skills-card", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.8");

        // C. Projects Reveal & Parallax
        gsap.utils.toArray('.project-item-cinema').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 150, rotation: i % 2 === 0 ? -2 : 2, opacity: 0, duration: 1.5, ease: "power3.out", filter: "blur(20px)"
            });

            const img = item.querySelector('img');
            if (img) {
                gsap.to(img, {
                    yPercent: 20, ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        });

        // D. Generic section reveal
        gsap.utils.toArray('.reveal').forEach((section) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                y: 50, opacity: 0, duration: 1, ease: "power2.out"
            });
        });

        // E. Experience Header & Item Stagger
        const expTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".experience-cinema",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        expTl.from(".experience-cinema .section-header-minimal", { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
            .from(".exp-item", { x: -50, opacity: 0, stagger: 0.15, duration: 1, ease: "power2.out" }, "-=0.5");

        // F. Contact Reveal
        gsap.from(".contact-center", {
            scrollTrigger: {
                trigger: ".contact-cinema",
                start: "top 80%",
                toggleActions: "play reverse play reverse"
            },
            scale: 0.8, opacity: 0, duration: 2, ease: "power2.out", filter: "blur(30px)"
        });

        // Forced Refresh to ensure start positions are captured correctly
        ScrollTrigger.refresh();
    }

    // ============================
    // CREATIVE EXTRAS (The Innovation)
    // ============================

    // Reset Hero Tilt when mouse leaves window
    document.addEventListener('mouseleave', () => {
        if (elements.title) {
            gsap.to(elements.title, { rotateY: 0, rotateX: 0, duration: 1, ease: "power2.out" });
        }
    });

    console.log('%c🎭 Fiqri-Inspired 90% Similarity Engine Loaded + Creative Extras', 'color: #9EB384; font-weight: bold;');

    // ============================
    // MENU OVERLAY LOGIC
    // ============================
    const menuTrigger = document.querySelector('.menu-trigger');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-links a');

    if (menuTrigger && closeMenuBtn && menuOverlay) {
        menuTrigger.addEventListener('click', () => {
            // Open Menu
            menuOverlay.classList.add('active');
            lenis.stop(); // Stop scrolling when menu is open

            // Stagger animate links in
            gsap.fromTo(menuLinks,
                { y: 50, opacity: 0, skewY: 10 },
                { y: 0, opacity: 1, skewY: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.2 }
            );
        });

        const closeMenu = () => {
            menuOverlay.classList.remove('active');
            lenis.start(); // Resume scrolling
        };

        closeMenuBtn.addEventListener('click', closeMenu);

        // Handle inner links click (Smooth scroll via Lenis)
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target.startsWith('#')) {
                    e.preventDefault();
                    closeMenu();
                    // Slight delay to let menu close animation start
                    setTimeout(() => {
                        lenis.scrollTo(target, { offset: -100, duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    }, 400);
                }
            });
        });
    }

    // ============================
    // PROJECT MODAL LOGIC (New)
    // ============================
    const projectModal = document.getElementById('projectModal');
    const modalClose = projectModal?.querySelector('.modal-close');
    const modalGallery = projectModal?.querySelector('.screenshot-gallery');
    const modalTitle = projectModal?.querySelector('.modal-project-title');
    const modalDesc = projectModal?.querySelector('.modal-project-desc');

    if (projectModal && modalClose) {
        document.querySelectorAll('.project-item-cinema').forEach(item => {
            const isConfidential = item.getAttribute('data-confidential') === "true";
            const isLocked = item.getAttribute('data-locked') === "true";
            const preventAccess = isConfidential || isLocked;

            // Add hover effect for cursor
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-large');
                if (preventAccess) {
                    cursor.classList.add('cursor-locked');
                    cursorInternal.innerHTML = lockSVG;
                    // Initial lock entrance (Standard GSAP)
                    gsap.from(cursorInternal, { 
                        scale: 0,
                        rotation: -45,
                        opacity: 0,
                        duration: 0.4, 
                        ease: "back.out(1.7)" 
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-large');
                cursor.classList.remove('cursor-locked');
                cursorInternal.innerHTML = '';
                
                // Kill any active rejection animations
                gsap.killTweensOf([cursorVisual, cursorInternal]);
                // Force reset visuals to CSS defaults
                gsap.set(cursorVisual, { clearProps: "all" });
                gsap.set(cursorInternal, { clearProps: "all" });
            });

            item.addEventListener('click', (e) => {
                if (preventAccess) {
                    const badge = item.querySelector('.project-view-badge');
                    
                    // 1. Shaking everything (The "NO" Feel)
                    gsap.fromTo(item, { x: -8 }, { x: 8, repeat: 7, yoyo: true, duration: 0.04, ease: "none", clearProps: "x" });
                    
                    if (badge) {
                        gsap.fromTo(badge, { x: -6, backgroundColor: "#ff5f56", color: "#fff" }, { 
                            x: 6, 
                            repeat: 7, 
                            yoyo: true, 
                            duration: 0.04,
                            onComplete: () => {
                                gsap.to(badge, { backgroundColor: "#333", color: "var(--accent-color)", duration: 0.5, clearProps: "x" });
                            }
                        });
                    }

                    // 2. Reject animation (Isolated to visual wrapper)
                    gsap.fromTo(cursorVisual, 
                        { backgroundColor: "#000", scale: 1 },
                        { 
                            backgroundColor: "#ff5f56", 
                            boxShadow: "0 0 50px rgba(255, 95, 86, 0.9)",
                            scale: 1.8,
                            duration: 0.1,
                            yoyo: true,
                            repeat: 1,
                            clearProps: "all"
                        }
                    );

                    gsap.fromTo(cursorInternal, 
                        { rotation: -25 },
                        { 
                            rotation: 25, 
                            repeat: 9, 
                            yoyo: true, 
                            duration: 0.035, 
                            ease: "power1.inOut",
                            clearProps: "rotation"
                        }
                    );
                    
                    return;
                }
                const title = item.querySelector('.project-name-serif')?.textContent || "Project";
                const desc = item.querySelector('.project-brief')?.textContent || "";
                const screenshotsAttr = item.getAttribute('data-screenshots');
                const confFlag = isConfidential ? 'is-confidential' : '';

                if (!screenshotsAttr) {
                    console.warn("No screenshots found for this project");
                    return;
                }

                const screenshots = screenshotsAttr.split(',');

                // Populate Modal
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalGallery.innerHTML = ''; // Clear previous

                const modalBody = projectModal.querySelector('.modal-body');
                if (modalBody) modalBody.scrollTop = 0;

                screenshots.forEach(src => {
                    if (src.trim() === "") return;
                    const frame = document.createElement('div');
                    frame.className = 'window-frame';
                    frame.innerHTML = `
                        <div class="window-header">
                            <div class="window-controls">
                                <span class="window-dot dot-red"></span>
                                <span class="window-dot dot-yellow"></span>
                                <span class="window-dot dot-green"></span>
                            </div>
                        </div>
                        <div class="screenshot-item">
                            <img src="${src}" alt="${title} screen" loading="lazy" class="${confFlag}">
                        </div>
                    `;
                    modalGallery.appendChild(frame);
                });

                // Open Animation
                projectModal.classList.add('active');
                lenis.stop();

                // GSAP Reset and Play
                gsap.set(".modal-content-wrapper", { y: 100, opacity: 0 });
                gsap.to(".modal-content-wrapper", {
                    y: 0, opacity: 1, duration: 0.8, ease: "power4.out"
                });

                gsap.fromTo(".window-frame",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.3 }
                );
            });
        });

        const closeModal = () => {
            projectModal.classList.remove('active');
            lenis.start();
        };

        modalClose.addEventListener('click', closeModal);
        projectModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }

});
