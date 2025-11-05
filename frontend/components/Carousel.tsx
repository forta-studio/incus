"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  colors: string[];
}

const slides: Slide[] = [
  {
    title: "New Release: Midnight Frequencies",
    subtitle:
      "Experience the latest electronic soundscapes from our featured artists.",
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
  },
  {
    title: "Premium Sample Packs Available",
    subtitle:
      "Elevate your productions with professionally crafted sounds and loops.",
    colors: ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6"],
  },
  {
    title: "Deep House Chronicles Vol. 3",
    subtitle:
      "The third installment of our acclaimed deep house compilation series.",
    colors: ["#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"],
  },
];

export default function HeroCarousel(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Add noise animation styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes noise {
        0% { 
          background-position: 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
          opacity: 0.2;
        }
        25% { 
          background-position: -1px -1px, 1px 0px, 2px -2px, -1px 1px, 1px -1px;
          opacity: 0.25;
        }
        50% { 
          background-position: 1px 1px, -1px 1px, -2px 2px, 2px -1px, -1px 2px;
          opacity: 0.15;
        }
        75% { 
          background-position: -1px 0px, 0px -1px, 1px 1px, -2px 0px, 2px 1px;
          opacity: 0.22;
        }
        100% { 
          background-position: 0px 1px, -1px 0px, 0px -2px, 1px 2px, -2px -1px;
          opacity: 0.18;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 🔄 Main GSAP animation timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current) return;

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

  // 🎨 Update gradient colors when slide changes
  useEffect(() => {
    if (!bgRef.current) return;

    const currentColors = slides[current].colors;
    gsap.to(bgRef.current, {
      background: `
        radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
          ${currentColors[0]}27 0%, 
          ${currentColors[1]}16 25%, 
          ${currentColors[2]}13 50%, 
          ${currentColors[3]}10 75%, 
          transparent 100%),
        linear-gradient(135deg, 
          ${currentColors[0]}45 0%, 
          ${currentColors[1]}35 25%, 
          ${currentColors[2]}25 50%, 
          ${currentColors[3]}15 75%, 
          transparent 100%),
        linear-gradient(45deg, 
          ${currentColors[3]}20 0%, 
          transparent 50%, 
          ${currentColors[0]}15 100%)
      `,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [current, mousePos]);

  // 🖱️ Mouse movement for gradient interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });

      if (!bgRef.current) return;

      const currentColors = slides[current].colors;
      gsap.to(bgRef.current, {
        background: `
          radial-gradient(circle at ${x * 100}% ${y * 100}%, 
            ${currentColors[0]}30 0%, 
            ${currentColors[1]}20 25%, 
            ${currentColors[2]}15 50%, 
            ${currentColors[3]}13 75%, 
            transparent 100%),
          linear-gradient(135deg, 
            ${currentColors[0]}45 0%, 
            ${currentColors[1]}35 25%, 
            ${currentColors[2]}25 50%, 
            ${currentColors[3]}15 75%, 
            transparent 100%),
          linear-gradient(45deg, 
            ${currentColors[3]}23 0%, 
            transparent 50%, 
            ${currentColors[0]}17 100%)
        `,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [current]);

  return (
    <section
      ref={containerRef}
      className="relative h-[65vh] flex items-center justify-center overflow-hidden"
    >
      {/* Shader Background */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, 
              ${slides[current].colors[0]}30 0%, 
              ${slides[current].colors[1]}20 25%, 
              ${slides[current].colors[2]}15 50%, 
              ${slides[current].colors[3]}13 75%, 
              transparent 100%),
            linear-gradient(135deg, 
              ${slides[current].colors[0]}45 0%, 
              ${slides[current].colors[1]}35 25%, 
              ${slides[current].colors[2]}25 50%, 
              ${slides[current].colors[3]}15 75%, 
              transparent 100%),
            linear-gradient(45deg, 
              ${slides[current].colors[3]}23 0%, 
              transparent 50%, 
              ${slides[current].colors[0]}17 100%)
          `,
          transition: "background 1s ease-in-out",
        }}
      />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.05) 1px,
              rgba(255, 255, 255, 0.05) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.03) 1px,
              rgba(255, 255, 255, 0.03) 2px
            ),
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 1px, transparent 1px),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "3px 3px, 3px 3px, 8px 8px, 12px 12px, 6px 6px",
          animation: "noise 0.4s infinite linear alternate",
        }}
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center px-6">
        <h2
          ref={titleRef}
          className="text-6xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
        >
          {slides[current].title}
        </h2>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto"
        >
          {slides[current].subtitle}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                     flex items-center justify-center text-white hover:bg-white/20 
                     transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                     flex items-center justify-center text-white hover:bg-white/20 
                     transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
