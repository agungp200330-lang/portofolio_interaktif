"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MenuOverlay({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        linksRef.current,
        { y: 50, opacity: 0, skewY: 10 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, [isOpen]);

  const handleLinkClick = (e, target) => {
    if (target.startsWith("#")) {
      e.preventDefault();
      onClose();
      
      setTimeout(() => {
        const element = document.querySelector(target);
        if (element) {
            // Scroll menggunakan window.scrollTo yang dideteksi Lenis
            const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offset,
                behavior: "smooth"
            });
        }
      }, 400);
    }
  };



  return (
    <div className={`menu-overlay ${isOpen ? "active" : ""}`} ref={overlayRef} data-lenis-prevent="true">
      <button className="close-menu" onClick={onClose}>
        CLOSE (X)
      </button>
      <nav className="menu-links">
        {["Home", "About", "Experience", "Work", "Contact"].map((label, idx) => (
          <a
            key={idx}
            href={`#${label.toLowerCase().replace("work", "projects")}`}
            ref={(el) => (linksRef.current[idx] = el)}
            onClick={(e) => handleLinkClick(e, `#${label.toLowerCase().replace("work", "projects")}`)}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
