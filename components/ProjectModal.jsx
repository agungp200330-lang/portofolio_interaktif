"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import Image from "next/image";


export default function ProjectModal({ project, onClose }) {
  const modalRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (project) {
      gsap.set(wrapperRef.current, { y: 100, opacity: 0 });
      gsap.to(wrapperRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
      });

      gsap.fromTo(
        ".window-frame-modal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }
  }, [project]);

  if (!project) return null;

  return (
    <div className={`project-modal active`} ref={modalRef}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content-wrapper" ref={wrapperRef}>
        <button className="modal-close" onClick={onClose}>
          CLOSE (X)
        </button>
        <div className="modal-body" data-lenis-prevent="true">
          <div className="modal-header-text">
            <h2 className="modal-project-title italic">{project.title}</h2>
            <p className="modal-project-desc">{project.description}</p>
          </div>
          <div className="screenshot-gallery">
            {project.screenshots && project.screenshots.map((src, idx) => (
              <div key={idx} className="window-frame window-frame-modal">
                <div className="window-header">
                  <div className="window-controls">
                    <span className="window-dot dot-red"></span>
                    <span className="window-dot dot-yellow"></span>
                    <span className="window-dot dot-green"></span>
                  </div>
                </div>
                <div className="screenshot-item">
                  <Image
                    src={src}
                    alt={`${project.title} screen ${idx + 1}`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className={project.isConfidential ? "is-confidential" : ""}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
