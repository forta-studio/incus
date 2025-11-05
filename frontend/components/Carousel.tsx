"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button";

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
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const changeSlide = useCallback(
    (newIndex: number) => {
      if (isTransitioning || newIndex === current) return;

      setIsTransitioning(true);

      // Clear any existing autoplay timeout
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }

      // Kill existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Animate out current text
      if (titleRef.current && subtitleRef.current) {
        const title = new SplitType(titleRef.current, { types: "words" });
        const subtitle = new SplitType(subtitleRef.current, { types: "words" });

        gsap.to([title.words, subtitle.words], {
          y: -60,
          opacity: 0,
          stagger: 0.02,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            title.revert();
            subtitle.revert();
            setCurrent(newIndex);
            setIsTransitioning(false);
          },
        });
      } else {
        setCurrent(newIndex);
        setIsTransitioning(false);
      }
    },
    [isTransitioning, current]
  );

  const nextSlide = useCallback(() => {
    const newIndex = (current + 1) % slides.length;
    changeSlide(newIndex);
  }, [current, changeSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (current - 1 + slides.length) % slides.length;
    changeSlide(newIndex);
  }, [current, changeSlide]);

  // 🔄 Text animation when slide changes
  useEffect(() => {
    if (isTransitioning) return;

    const ctx = gsap.context(() => {
      if (!titleRef.current || !subtitleRef.current) return;

      const title = new SplitType(titleRef.current, { types: "words" });
      const subtitle = new SplitType(subtitleRef.current, { types: "words" });

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create new timeline
      timelineRef.current = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // Animate text in
      timelineRef.current
        .from(title.words, {
          y: 80,
          opacity: 0,
          rotateX: 50,
          transformOrigin: "bottom center",
          stagger: 0.05,
          duration: 1.2,
        })
        .from(
          subtitle.words,
          {
            y: 40,
            opacity: 0,
            stagger: 0.04,
            duration: 0.8,
          },
          "-=0.8"
        );

      // Clean up function
      const cleanup = () => {
        title.revert();
        subtitle.revert();
      };

      return cleanup;
    }, containerRef);

    return () => ctx.revert();
  }, [current, isTransitioning]);

  // 🔄 Autoplay functionality
  useEffect(() => {
    if (isTransitioning) return;

    // Clear existing timeout
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // Set new timeout for autoplay
    autoplayTimeoutRef.current = setTimeout(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [current, isTransitioning]);

  // 🎨 Update gradient colors when slide changes
  useEffect(() => {
    if (!bgRef.current) return;

    const currentColors = slides[current].colors;
    gsap.to(bgRef.current, {
      background: `
        radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
          ${currentColors[0]}18 0%, 
          ${currentColors[1]}12 25%, 
          ${currentColors[2]}08 50%, 
          ${currentColors[3]}05 75%, 
          transparent 100%),
        linear-gradient(135deg, 
          ${currentColors[0]}30 0%, 
          ${currentColors[1]}22 25%, 
          ${currentColors[2]}16 50%, 
          ${currentColors[3]}10 75%, 
          transparent 100%),
        linear-gradient(45deg, 
          ${currentColors[3]}12 0%, 
          transparent 50%, 
          ${currentColors[0]}08 100%)
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
            ${currentColors[0]}20 0%, 
            ${currentColors[1]}15 25%, 
            ${currentColors[2]}10 50%, 
            ${currentColors[3]}08 75%, 
            transparent 100%),
          linear-gradient(135deg, 
            ${currentColors[0]}30 0%, 
            ${currentColors[1]}22 25%, 
            ${currentColors[2]}16 50%, 
            ${currentColors[3]}10 75%, 
            transparent 100%),
          linear-gradient(45deg, 
            ${currentColors[3]}15 0%, 
            transparent 50%, 
            ${currentColors[0]}10 100%)
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
              ${slides[current].colors[0]}20 0%, 
              ${slides[current].colors[1]}15 25%, 
              ${slides[current].colors[2]}10 50%, 
              ${slides[current].colors[3]}08 75%, 
              transparent 100%),
            linear-gradient(135deg, 
              ${slides[current].colors[0]}30 0%, 
              ${slides[current].colors[1]}22 25%, 
              ${slides[current].colors[2]}16 50%, 
              ${slides[current].colors[3]}10 75%, 
              transparent 100%),
            linear-gradient(45deg, 
              ${slides[current].colors[3]}15 0%, 
              transparent 50%, 
              ${slides[current].colors[0]}10 100%)
          `,
          transition: "background 1s ease-in-out",
        }}
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

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
        <Button onClick={prevSlide} size="sm" variant="default">
          <ChevronLeft size={20} />
        </Button>
        <Button onClick={nextSlide} size="sm" variant="default">
          <ChevronRight size={20} />
        </Button>
      </div>
    </section>
  );
}
