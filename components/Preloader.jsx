"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const loaderBarRef = useRef(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const loaderBar = loaderBarRef.current;

    const tl = gsap.timeline();
    tl.to(loaderBar, { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(preloader, { y: "-100%", duration: 1, ease: "power4.inOut", delay: 0.2 })
      .call(() => {
        if (onComplete) onComplete();
      });
  }, [onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="loader-content">
        <span className="loader-text">AGUNG PRAYOGI</span>
        <div className="loader-bar" ref={loaderBarRef}></div>
      </div>
    </div>
  );
}
