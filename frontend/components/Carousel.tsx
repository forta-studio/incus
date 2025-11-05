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
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current slide colors
  const currentColors = slides[current].colors;

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

  // 🖱️ Subtle mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      // Make mouse following more subtle by reducing the range and adding center bias
      const centerX = 50;
      const centerY = 50;
      const subtleX = centerX + (x - centerX) * 0.2; // Reduce movement to 20% of actual
      const subtleY = centerY + (y - centerY) * 0.3;

      setMousePos({ x: subtleX, y: subtleY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
  }, [current, isTransitioning, nextSlide]);

  return (
    <>
      {/* Global styles for noise animations */}
      <style jsx global>{`
        @keyframes noiseMove {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(-25px, -30px);
          }
          50% {
            transform: translate(-50px, -20px);
          }
          75% {
            transform: translate(-35px, -45px);
          }
          100% {
            transform: translate(-60px, -60px);
          }
        }

        @keyframes noiseMove2 {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(30px, -20px) rotate(0.5deg);
          }
          50% {
            transform: translate(-15px, 40px) rotate(-0.3deg);
          }
          75% {
            transform: translate(45px, 25px) rotate(0.8deg);
          }
          100% {
            transform: translate(60px, 60px) rotate(1deg);
          }
        }
      `}</style>

      <section
        ref={containerRef}
        className="relative h-[65vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            background: `
            radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
              ${currentColors[0]}25 0%, 
              ${currentColors[1]}20 25%, 
              ${currentColors[2]}15 50%, 
              ${currentColors[3]}10 75%, 
              transparent 100%),
            linear-gradient(135deg, 
              ${currentColors[0]}45 0%, 
              ${currentColors[1]}35 25%, 
              ${currentColors[2]}25 50%, 
              ${currentColors[3]}18 75%, 
              transparent 100%),
            linear-gradient(45deg, 
              ${currentColors[3]}30 0%, 
              transparent 50%, 
              ${currentColors[0]}20 100%)
          `,
          }}
        />

        {/* Noise Texture Overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url("/noise.png")',
            backgroundRepeat: "repeat",
            backgroundSize: "200px 400px",
            animation: "noiseMove 15s linear infinite",
            // Extend beyond viewport to avoid edge visibility
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
          }}
        />

        {/* Secondary Noise Layer for more complexity */}
        <div
          className="absolute opacity-12 mix-blend-soft-light"
          style={{
            backgroundImage: 'url("/noise.png")',
            backgroundRepeat: "repeat",
            backgroundSize: "150px 250px",
            animation: "noiseMove2 10s linear infinite reverse",
            // Extend beyond viewport to avoid edge visibility
            width: "130%",
            height: "130%",
            top: "-15%",
            left: "-15%",
          }}
        />

        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/3 via-black/1 to-black/5" />

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
    </>
  );
}
