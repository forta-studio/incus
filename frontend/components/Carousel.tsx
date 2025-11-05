"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

interface Slide {
  title: string;
  subtitle: string;
  background: string;
}

const slides: Slide[] = [
  {
    title: "New Release: Midnight Frequencies",
    subtitle:
      "Experience the latest electronic soundscapes from our featured artists.",
    background: "/hero-bg.png",
  },
  {
    title: "Premium Sample Packs Available",
    subtitle:
      "Elevate your productions with professionally crafted sounds and loops.",
    background: "/hero-bg.png",
  },
  {
    title: "Deep House Chronicles Vol. 3",
    subtitle:
      "The third installment of our acclaimed deep house compilation series.",
    background: "/hero-bg.png",
  },
];

export default function HeroCarousel(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // 🔄 Main GSAP animation timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current || !bgRef.current) return;

      const title = new SplitType(titleRef.current, { types: "words" });
      const subtitle = new SplitType(subtitleRef.current, { types: "words" });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          setTimeout(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
          }, 6000);
        },
      });

      // Fade background out
      tl.to(bgRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url(${slides[current].background})`;
          }
        },
      });

      // Fade background in
      tl.to(
        bgRef.current,
        { opacity: 1, duration: 1.2, ease: "power2.inOut" },
        "+=0.2"
      );

      // Animate text in
      tl.from(title.words, {
        y: 80,
        opacity: 0,
        rotateX: 50,
        transformOrigin: "bottom center",
        stagger: 0.05,
        duration: 1.2,
      }).from(
        subtitle.words,
        {
          y: 40,
          opacity: 0,
          stagger: 0.04,
          duration: 0.8,
        },
        "-=0.8"
      );

      // Animate text out before next slide
      tl.to(
        [title.words, subtitle.words],
        {
          y: -60,
          opacity: 0,
          stagger: 0.04,
          duration: 0.8,
          delay: 3,
          ease: "power2.in",
          onComplete: () => {
            title.revert();
            subtitle.revert();
          },
        },
        "+=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [current]);

  // 🖱️ Parallax mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!bgRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(bgRef.current, {
        backgroundPosition: `${50 + x}% ${50 + y}%`,
        duration: 1.2,
        ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[65vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slides[current].background})`,
          transition: "background 1s ease-in-out",
        }}
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center px-6">
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
        >
          {slides[current].title}
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto"
        >
          {slides[current].subtitle}
        </p>
      </div>
    </section>
  );
}
