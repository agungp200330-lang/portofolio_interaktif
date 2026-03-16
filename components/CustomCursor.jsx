"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const visualRef = useRef(null);
  const internalRef = useRef(null);

  const lockSVG = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 11V7C18 3.68629 15.3137 1 12 1C8.68629 1 6 3.68629 6 7V11H3V23H21V11H18ZM12 18.5C11.1716 18.5 10.5 17.8284 10.5 17C10.5 16.1716 11.1716 15.5 12 15.5C12.8284 15.5 13.5 16.1716 13.5 17C13.5 17.8284 12.8284 18.5 12 18.5ZM8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11H8Z"/>
    </svg>`;

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorVisual = visualRef.current;
    const cursorInternal = internalRef.current;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      xTo(mouseX);
      yTo(mouseY);

      const xPercent = mouseX / window.innerWidth - 0.5;
      const yPercent = mouseY / window.innerHeight - 0.5;

      // Velocity-based stretching
      const velX = e.movementX || 0;
      const velY = e.movementY || 0;
      const speed = Math.sqrt(velX * velX + velY * velY);
      const angle = (Math.atan2(velY, velX) * 180) / Math.PI;

      if (speed > 2) {
        gsap.to(cursorVisual, {
          scaleX: 1 + Math.min(speed * 0.05, 0.8),
          scaleY: 1 - Math.min(speed * 0.03, 0.4),
          rotation: angle,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(cursorVisual, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      // Parallax effects
      const heroImg = document.querySelector(".hero-image-cinematic");
      const imgMask = document.querySelector(".hero-image-cinematic .image-mask");
      const glow = document.querySelector(".hero-image-cinematic .glow-bg");
      const title = document.querySelector(".hero-main-title");
      const trigger = document.querySelector(".menu-trigger");
      const nodes = gsap.utils.toArray(".node");

      if (heroImg) {
        const xPos = xPercent * 150;
        const yPos = yPercent * 100;

        gsap.to(heroImg, {
          x: xPos * 0.5,
          y: yPos * 0.5,
          yPercent: -50,
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
        if (imgMask) {
          gsap.to(imgMask, {
            x: xPos * 0.8,
            y: yPos * 0.8,
            rotateX: yPercent * -25,
            rotateY: xPercent * 25,
            transformPerspective: 1200,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
            force3D: true,
          });
        }
        if (glow) {
          gsap.to(glow, {
            x: xPos * 2.5,
            y: yPos * 2.5,
            duration: 2,
            ease: "power2.out",
            overwrite: "auto",
            force3D: true,
          });
        }

      }

      if (trigger) {
        const bound = trigger.getBoundingClientRect();
        const centerX = bound.left + bound.width / 2;
        const centerY = bound.top + bound.height / 2;
        const dist = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

        if (dist < 80) {
          gsap.to(trigger, { x: (mouseX - centerX) * 0.3, y: (mouseY - centerY) * 0.3, duration: 0.3, overwrite: "auto" });
        } else {
          gsap.to(trigger, { x: 0, y: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        }
      }

      if (title) {
        gsap.to(title, { 
          rotateY: xPercent * 10, 
          rotateX: yPercent * -10, 
          transformPerspective: 800, 
          duration: 0.8, 
          overwrite: "auto",
          force3D: true
        });
      }

      nodes.forEach((node, i) => {
        gsap.to(node, { 
          x: xPercent * (15 + i * 5), 
          y: yPercent * (15 + i * 5), 
          duration: 1.5, 
          ease: "power1.out", 
          overwrite: "auto",
          force3D: true
        });
      });

    };

    const onMouseLeave = () => {
      const title = document.querySelector(".hero-main-title");
      if (title) {
        gsap.to(title, { rotateY: 0, rotateX: 0, duration: 1, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Hover effects
    const hoverElements = document.querySelectorAll("a, button, .project-item-cinema");
    
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-large");
        if (el.classList.contains("project-item-cinema")) {
          const isConfidential = el.getAttribute("data-confidential") === "true";
          const isLocked = el.getAttribute("data-locked") === "true";
          if (isConfidential || isLocked) {
            cursor.classList.add("cursor-locked");
            cursorInternal.innerHTML = lockSVG;
            gsap.from(cursorInternal, {
              scale: 0,
              rotation: -45,
              opacity: 0,
              duration: 0.4,
              ease: "back.out(1.7)",
            });
          }
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-large");
        cursor.classList.remove("cursor-locked");
        cursorInternal.innerHTML = "";
        gsap.killTweensOf([cursorVisual, cursorInternal]);
        gsap.set(cursorVisual, { clearProps: "all" });
        gsap.set(cursorInternal, { clearProps: "all" });
      });
      
      // Handle project click rejection animation
      if (el.classList.contains("project-item-cinema")) {
          el.addEventListener("click", () => {
              const isConfidential = el.getAttribute("data-confidential") === "true";
              const isLocked = el.getAttribute("data-locked") === "true";
              if (isConfidential || isLocked) {
                  // NO animation
                  gsap.fromTo(el, { x: -8 }, { x: 8, repeat: 7, yoyo: true, duration: 0.04, ease: "none", clearProps: "x" });
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
              }
          });
      }
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef}>
      <div className="cursor-visual" ref={visualRef}>
        <div className="cursor-internal" ref={internalRef}></div>
      </div>
    </div>
  );
}
