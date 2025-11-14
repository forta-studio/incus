"use client";

import { useRef } from "react";
import { gsap } from "gsap";

type HeroTagProps = {
  type: "New Release" | "Sale";
};

const repeatText = (text: string, count: number) =>
  Array(count).fill(text).join(" • ");

export const HeroTag: React.FC<HeroTagProps> = ({ type }) => {
  const circleText = repeatText(type.toUpperCase(), 6);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseEnter = () => {
    if (svgRef.current) {
      // Create a timeline for the bounce effect
      const tl = gsap.timeline();

      tl.to(svgRef.current, {
        rotation: 195, // Overshoot to 195 degrees
        duration: 0.35,
        ease: "power1.out",
        transformOrigin: "50% 50%",
      })
        .to(svgRef.current, {
          rotation: 170, // Bounce back to 170 degrees
          duration: 0.25,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        })
        .to(svgRef.current, {
          rotation: 182, // Small overshoot again
          duration: 0.18,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        })
        .to(svgRef.current, {
          rotation: 180, // Final settle at 180 degrees
          duration: 0.12,
          ease: "sine.out",
          transformOrigin: "50% 50%",
        });
    }
  };

  const handleMouseLeave = () => {
    if (svgRef.current) {
      // Create a timeline for the return bounce effect
      const tl = gsap.timeline();

      tl.to(svgRef.current, {
        rotation: -15, // Overshoot backwards to -15 degrees
        duration: 0.28,
        ease: "power1.out",
        transformOrigin: "50% 50%",
      })
        .to(svgRef.current, {
          rotation: 8, // Bounce forward to 8 degrees
          duration: 0.22,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        })
        .to(svgRef.current, {
          rotation: -2, // Small overshoot backward
          duration: 0.16,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        })
        .to(svgRef.current, {
          rotation: 0, // Final settle at 0 degrees
          duration: 0.12,
          ease: "sine.out",
          transformOrigin: "50% 50%",
        });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: "rgba(255,255,255, 0.8)",
        boxShadow: "4px 3px 0 rgba(0,0,0,1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
      className="hero-tag"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Center Text */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: 700,
          fontSize: 16,
          zIndex: 2,
          color: "#191919ff",
          textAlign: "center",
          lineHeight: "1.1rem",
        }}
      >
        {type.toUpperCase()}
      </span>
      {/* Circular Text */}
      <svg
        ref={svgRef}
        width={110}
        height={110}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <path
            id="circlePath"
            d="M55,55 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <text fontSize={8} fontWeight={700} letterSpacing={0.55}>
          <textPath
            href="#circlePath"
            startOffset="0"
            className="hero-tag-circle-text"
          >
            {circleText} •
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default HeroTag;
