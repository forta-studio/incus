"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const move = (e: MouseEvent): void => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", move);

    const cursorInner = cursor.querySelector("div");

    // Use event delegation instead of querying elements
    const handleMouseEnter = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target.matches("a, button, [data-hover]")) {
        gsap.to(cursorInner, {
          width: "20px",
          height: "20px",
          duration: 0.2,
          ease: "power3.out",
        });
      }
    };

    const handleMouseLeave = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target.matches("a, button, [data-hover]")) {
        gsap.to(cursorInner, {
          width: "32px",
          height: "32px",
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const handleMouseDown = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target.matches("a, button, [data-hover]")) {
        gsap.to(cursorInner, { width: "14px", height: "14px", duration: 0.1 });
      }
    };

    const handleMouseUp = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target.matches("a, button, [data-hover]")) {
        gsap.to(cursorInner, { width: "20px", height: "20px", duration: 0.2 });
      }
    };

    // Use event delegation on document
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("mouseup", handleMouseUp, true);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("mouseup", handleMouseUp, true);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="relative w-8 h-8 border-[1px] border-white rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>
    </div>
  );
}
