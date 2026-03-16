"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { projects, experiences } from "@/data/portfolio";
import Image from "next/image";
import CustomCursor from "./CustomCursor";
import Preloader from "./Preloader";
import MenuOverlay from "./MenuOverlay";
import ProjectModal from "./ProjectModal";

const basePath = "/portofolio_interaktif";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Performance check: simple heuristic for older/low-end devices
    if (typeof window !== "undefined") {
      const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || 
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isLowEnd) {
        document.body.classList.add("low-perf");
      }
    }

    // Initialize Lenis

    // Initialize Lenis with more robust settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Di-disable untuk mobile agar tidak berat
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Tambahkan kelas ke HTML untuk styling scroll
    document.documentElement.classList.add('lenis');

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);


    // Sync scroll progress and skew effects
    lenis.on("scroll", (e) => {
      const progress =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      gsap.to(".scroll-progress-bar", {
        width: `${progress}%`,
        duration: 0.1,
        ease: "none",
        force3D: true,
      });

      const velocity = Math.min(Math.max(e.velocity, -20), 20);
      gsap.to(".hero-center-content, .about-hero-text", {
        skewY: velocity * 0.1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
      });
      gsap.to(".marquee-container", {
        skewX: velocity * 0.8,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      });
    });

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoaded(true);
    initAnimations();
  };

  const initAnimations = () => {
    // opening animation
    const tl = gsap.timeline();
    tl.from(".hi-iam-modern", { y: 20, opacity: 0, duration: 1, ease: "power3.out" })
      .from(".hero-main-title .line", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", stagger: 0.2 }, "-=0.8")
      .from(".hero-main-title .line-italic", { x: -50, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1.2")
      .from(".hero-image-cinematic", { x: 100, opacity: 0, duration: 2, ease: "power2.out" }, "-=1.5")
      .from(".hero-role-modern", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
      .from(".scroll-status", { opacity: 0, duration: 2 }, "-=0.5")
      .from(".scroll-indicator-modern", { y: 20, opacity: 0, duration: 1 }, "-=1");

    // Scroll Trigger Animations
    const transitionTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-cinematic",
        start: "top top",
        end: "bottom+=50% top",
        scrub: 1.2
      }
    });

    transitionTl.to(".hero-main-title .line:nth-child(1)", { x: -1200, y: -600, rotation: -60, scale: 3, filter: "blur(25px)", opacity: 0 }, 0)
      .to(".hero-main-title .line-italic", { x: 1500, y: 500, rotation: 45, scale: 0.2, filter: "blur(25px)", opacity: 0 }, 0.05)
      .to(".hero-image-cinematic", { scale: 0, rotation: -180, filter: "blur(30px)", opacity: 0 }, 0)
      .to(".hi-iam-modern", { y: -700, x: -400, opacity: 0, scale: 2 }, 0)
      .to(".hero-subline", { y: 800, x: 400, opacity: 0 }, 0.1)
      .to(".scroll-indicator-modern", { scale: 5, opacity: 0 }, 0);

    transitionTl.from(".about-line:nth-of-type(1)", { x: 1000, y: 600, rotation: 45, scale: 0.1, opacity: 0, filter: "blur(40px)" }, 0)
      .from(".about-line:nth-of-type(2)", { x: -900, y: 800, rotation: -40, scale: 2, opacity: 0, filter: "blur(40px)" }, 0.05)
      .from(".about-line:nth-of-type(3)", { x: 500, y: 1200, rotation: 30, scale: 0.5, opacity: 0, filter: "blur(40px)" }, 0.1)
      .from(".about-details-minimal", {
        y: 800, scale: 0.3, rotationX: 45, opacity: 0, filter: "blur(20px)", ease: "power2.out"
      }, 0.2)
      .from(".scroll-indicator-data", {
        y: 100, rotation: 10, opacity: 0, filter: "blur(10px)", duration: 1
      }, 0.3);

    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: ".stats-cinema",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 100, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power4.out", filter: "blur(10px)"
    });

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
          yPercent: 20, 
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });

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

    const expTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-cinema",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    expTl.from(".experience-cinema .section-header-minimal", { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
      .from(".exp-item", { x: -50, opacity: 0, stagger: 0.15, duration: 1, ease: "power2.out" }, "-=0.5");

    gsap.from(".contact-center", {
      scrollTrigger: {
        trigger: ".contact-cinema",
        start: "top 80%",
        toggleActions: "play reverse play reverse"
      },
      scale: 0.8, opacity: 0, duration: 2, ease: "power2.out", filter: "blur(30px)"
    });

    ScrollTrigger.refresh();
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
    lenisRef.current?.stop();
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    lenisRef.current?.start();
  };

  const handleProjectClick = (project) => {
    if (project.isConfidential || project.isLocked) return;
    setSelectedProject(project);
    lenisRef.current?.stop();
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    lenisRef.current?.start();
  };

  return (
    <>
      <div className="noise-overlay"></div>
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar"></div>
      </div>

      <CustomCursor />
      
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}

      <header className="header-split">
        <div className="logo-ap">AP — 2026 (c)</div>
        <button className="menu-trigger" onClick={handleMenuClick}>
          <span></span>
          MENU
        </button>
      </header>

      <main>
        <section id="home" className="hero-cinematic">
          <div className="bg-nodes-container">
            <div className="node node-1">PHP</div>
            <div className="node node-2">API</div>
            <div className="node node-3">{`{ }`}</div>
            <div className="node node-4">{`{}`}</div>
          </div>
          <div className="container">
            <div className="hero-center-content">
              <p className="hi-iam-modern">FULL-STACK ENGINEER & DATA ANALYST</p>
              <h1 className="hero-main-title">
                <span className="line">Agung</span>
                <span className="line-italic">Prayogi</span>
              </h1>
              <div className="hero-subline">
                <p className="hero-role-modern">Front-end • Full-stack Developer • Data Analyst</p>
              </div>
            </div>
          </div>
          <div className="hero-image-cinematic">
            <div className="image-mask">
              <Image 
                src={`${basePath}/img/fotogue.png`} 
                alt="Agung Prayogi" 
                width={380} 
                height={500} 
                priority
                style={{ objectFit: "contain", objectPosition: "bottom right" }}
              />
            </div>
            <div className="glow-bg"></div>
          </div>
          <div className="scroll-status">
            <span className="dot"></span>
            <span>Active 2026</span>
          </div>
          <div className="scroll-indicator-modern">
            <div className="mouse-icon">
              <div className="wheel"></div>
            </div>
            <span className="scroll-text">Scroll Down</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        <section id="about" className="about-section-cinema reveal">
          <div className="container">
            <div className="about-hero-text">
              <h2 className="massive-text italic">
                <span className="about-line">Analyzing data</span> <br />
                <span className="about-line">& building systems</span> <br />
                <span className="about-line">that scale.</span>
              </h2>
              <div className="about-details-minimal">
                <p>I am a Software Developer and Data Analyst specializing in bridging the gap between complex data and functional systems. From automating logistics with Java to building high-scale transaction platforms with Laravel 12, I focus on creating tools that solve real-world operational challenges.</p>
                <p style={{ marginTop: "1.5rem" }}>Currently, I am driving digital transformation at the <strong>Ministry of Trade</strong>, analyzing market entities and building secure systems for commodity futures trading. I believe in code that isn't just clean, but creates immediate business value.</p>
              </div>
            </div>
          </div>
          <div className="scroll-indicator-data">
            <span className="indicator-text">EXPLORE BIOGRAPHY</span>
            <div className="node-line">
              <div className="scrolling-bit"></div>
            </div>
          </div>
        </section>

        <section className="about-detailed-section reveal">
          <div className="container">
            <header className="section-header-minimal">
              <span className="num">02 / BIOGRAPHY</span>
              <h2 className="title-serif-lg italic">About Me</h2>
            </header>
            <div className="about-grid">
              <div className="about-text">
                <p>I am a Software Developer and Data Analyst specializing in bridging the gap between complex data and
                    functional systems. From automating logistics with <strong>Java</strong> to building high-scale
                    transaction platforms with <strong>Laravel 12</strong>, I focus on creating tools that solve
                    real-world operational challenges.</p>
                <p>Currently, I am driving digital transformation at the <strong>Ministry of Trade</strong>, analyzing
                    market entities and building secure systems for commodity futures trading. I believe in code that
                    isn't just clean, but creates immediate business value.</p>
              </div>
              <div className="about-skills-card">
                <h3>Technical Arsenal</h3>
                <ul className="skills-list">
                  <li><strong>Languages & Frameworks:</strong> PHP (Laravel 12), Java (Swing/Desktop), Python (Data Sci), SQL</li>
                  <li><strong>Frontend & Viz:</strong> Bootstrap, JavaScript, Chart.js, Looker Studio</li>
                  <li><strong>Domains:</strong> Logistics (SIKARGO), Gov-Tech (Bappebti), Safety Systems (K3)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-cinema">
          <div className="container">
            <header className="section-header-minimal">
              <span className="num">01 / CAREER MILESTONES</span>
              <h2 className="title-serif-lg italic">The Experience</h2>
            </header>
            <div className="exp-timeline">
              {experiences.map((exp, idx) => (
                <div key={idx} className="exp-item">
                  <div className="exp-year">{exp.year}</div>
                  <div className="exp-content">
                    <h3 className="exp-role">{exp.role}</h3>
                    <p className="exp-company">{exp.company} — <span className="loc">{exp.location}</span></p>
                    <p className="exp-details">{exp.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="projects-cinema reveal">
          <div className="container">
            <header className="section-header-minimal">
              <span className="num">02 / SELECTED WORKS</span>
              <h2 className="title-serif-lg italic">The Projects</h2>
            </header>
            <div className="projects-list-vertical">
              {projects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="project-item-cinema"
                  onClick={() => handleProjectClick(project)}
                  style={{ cursor: "none" }}
                  data-confidential={project.isConfidential}
                  data-locked={project.isLocked}
                >
                  <div className="project-image-wrapper">
                    <div className="window-frame">
                      <div className="window-header">
                        <div className="window-controls">
                          <span className="window-dot dot-red"></span>
                          <span className="window-dot dot-yellow"></span>
                          <span className="window-dot dot-green"></span>
                        </div>
                      </div>
                      <div className="screenshot-item">
                        <Image 
                          src={`${basePath}${project.image}`} 
                          alt={project.title} 
                          width={1000} 
                          height={600}
                          className={project.isConfidential ? "is-confidential" : ""} 
                        />
                      </div>
                    </div>
                    <div className="project-view-badge">View Project</div>
                  </div>
                  <div className="project-meta-cinema">
                    <h3 className="project-name-serif italic">{project.title}</h3>
                    <p className="project-brief">{project.description}</p>
                    <div className="project-tags-minimal">
                      {project.techStack.map((tech, tIdx) => (
                        <span key={tIdx}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-cinema reveal">
          <div className="container">
            <div className="contact-center">
              <h2 className="title-serif-lg massive italic">Let's craft <br /> the future.</h2>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=agungprayogi693@gmail.com" target="_blank" className="big-contact-link">
                Get in Touch <span className="arrow">→</span>
              </a>
              <div className="footer-minimal">
                <div className="social-links-minimal">
                  <a href="https://github.com/agungprayogi-ap" target="_blank">GitHub</a>
                  <a href="https://www.linkedin.com/in/agung-prayogi-27505a252/" target="_blank">LinkedIn</a>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=agungprayogi693@gmail.com" target="_blank">Email</a>
                </div>
                <p className="copyright">© 2026 Agung Prayogi — Portfolio</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MenuOverlay isOpen={isMenuOpen} onClose={handleMenuClose} />
      <ProjectModal project={selectedProject} onClose={handleModalClose} />

      <footer>
        <div className="container">
          <p>&copy; 2026 Agung Prayogi. All rights reserved.</p>
          <p className="footer-sub">Crafting Excellence with Code &amp; Data ⚡</p>
        </div>
      </footer>
    </>
  );
}
