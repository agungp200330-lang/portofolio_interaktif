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
      // Use lenis to scroll if window.lenis exists or via props
      // For now, standard smooth scroll or handle via window global if we set it
      setTimeout(() => {
        const element = document.querySelector(target);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
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
