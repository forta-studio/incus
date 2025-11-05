"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Button from "./ui/Button";

// Same fragment shader as HoverEffectImage
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  // Noise function for subtle distortion
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    vec2 mousePos = (uMouse + 1.0) * 0.5;
    float dist = distance(vUv, mousePos);
    
    // Create distortion effect - warp toward mouse
    float maxDist = 0.5;
    float distortionStrength = 0.03 * uHover;
    
    if (dist < maxDist) {
      float factor = (maxDist - dist) / maxDist;
      factor = smoothstep(0.0, 1.0, factor);
      
      vec2 direction = normalize(mousePos - vUv);
      uv += direction * factor * distortionStrength;
    }
    
    // Base color without chromatic aberration
    vec4 baseColor = texture2D(uTexture, uv);
    vec3 finalColor = baseColor.rgb;
    
    // Only apply effects when hovering
    if (uHover > 0.0) {
      // Calculate effect intensity based on distance from mouse
      float effectIntensity = smoothstep(0.4, 0.0, dist) * uHover;
      
      // Add subtle noise for organic feel
      float noiseValue = noise(uv * 8.0 + uTime * 1.5) * 0.02;
      effectIntensity += noiseValue * uHover * 0.3;
      
      // Chromatic aberration - sample RGB channels separately with more dramatic offsets
      float aberrationStrength = effectIntensity * 0.015; // Same as HoverEffectImage
      
      // Create more pronounced RGB separation with both horizontal and vertical offsets
      vec2 redOffset = vec2(-aberrationStrength * 1.2, aberrationStrength * 0.3);
      vec2 greenOffset = vec2(0.0, -aberrationStrength * 0.2);
      vec2 blueOffset = vec2(aberrationStrength * 1.2, aberrationStrength * 0.5);
      
      float r = texture2D(uTexture, uv + redOffset).r;
      float g = texture2D(uTexture, uv + greenOffset).g;
      float b = texture2D(uTexture, uv + blueOffset).b;
      
      vec3 chromaticColor = vec3(r, g, b);
      
      // Desaturation effect
      vec3 desaturated = vec3(dot(chromaticColor, vec3(0.299, 0.587, 0.114)));
      
      // Mix between chromatic color and desaturated based on effect intensity (same as HoverEffectImage)
      vec3 processedColor = mix(chromaticColor, desaturated, effectIntensity * 0.4);
      
      // Blend the processed color with the base color
      finalColor = mix(baseColor.rgb, processedColor, uHover);
    }
    
    gl_FragColor = vec4(finalColor, baseColor.a);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Component for the mesh inside Canvas
interface ShaderTextMeshProps {
  textTexture: THREE.Texture;
  width: number;
  height: number;
  onHover: (hovered: boolean) => void;
}

const ShaderTextMesh: React.FC<ShaderTextMeshProps> = ({
  textTexture,
  width,
  height,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0));

  // Create shader material
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: textTexture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }, [textTexture, width, height]);

  useFrame((state) => {
    if (materialRef.current) {
      // Animate hover state
      const targetHover = isHovered ? 1 : 0;
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        targetHover,
        0.1
      );

      // Update mouse position
      materialRef.current.uniforms.uMouse.value.lerp(mousePos, 0.1);

      // Update time for noise animation
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerMove = (event: any) => {
    if (meshRef.current && event.point instanceof THREE.Vector3) {
      // Convert mouse position to UV coordinates - exact same as HoverEffectImage
      const localPoint = event.point.clone();

      // Fix mouse coordinate mapping to follow cursor (not mirror)
      const uvX = (localPoint.x + 1) / 2;
      const uvY = (localPoint.y + 1) / 2; // Remove the negative to fix mirroring

      // Convert to shader space (-1 to 1)
      const shaderX = uvX * 2 - 1;
      const shaderY = uvY * 2 - 1;

      setMousePos(new THREE.Vector2(shaderX, shaderY));
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  return (
    <mesh
      ref={meshRef}
      material={shaderMaterial}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
};

// Component for rendering text as texture with shader effects
interface ShaderTextProps {
  text: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  width: number;
  height: number;
  className?: string;
}

const ShaderText: React.FC<ShaderTextProps> = ({
  text,
  fontSize,
  fontWeight,
  color,
  width,
  height,
  className = "",
}) => {
  const [textTexture, setTextTexture] = useState<THREE.Texture | null>(null);

  // Create text texture
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with higher resolution for crisp text
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set text properties
    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Enable smooth text rendering
    ctx.imageSmoothingEnabled = true;

    // Draw text with word wrapping
    const words = text.split(" ");
    const lineHeight = fontSize * 1.2;
    const maxWidth = width - 40; // padding
    let line = "";
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw lines centered
    const startY = (height - (lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), width / 2, startY + index * lineHeight);
    });

    // Create texture - match HoverEffectImage setup
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = true; // Fix image orientation like HoverEffectImage
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;

    setTextTexture(texture);

    return () => {
      texture.dispose();
    };
  }, [text, fontSize, fontWeight, color, width, height]);

  if (!textTexture) return null;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 1],
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: 0.1,
          far: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <ShaderTextMesh
          textTexture={textTexture}
          width={width}
          height={height}
          onHover={() => {}}
        />
      </Canvas>
    </div>
  );
};

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
              ${currentColors[0]}35 0%, 
              ${currentColors[1]}28 25%, 
              ${currentColors[2]}22 50%, 
              ${currentColors[3]}15 75%, 
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
        <div className="relative z-10 max-w-4xl text-center px-6">
          {/* Hidden elements for GSAP text animations */}
          <div className="opacity-0 absolute">
            <h2 ref={titleRef}>{slides[current].title}</h2>
            <p ref={subtitleRef}>{slides[current].subtitle}</p>
          </div>

          {/* Shader-based title */}
          <div className="mb-6">
            <ShaderText
              text={slides[current].title}
              fontSize={72}
              fontWeight="800"
              color="#ffffff"
              width={800}
              height={180}
              className="mx-auto"
            />
          </div>

          {/* Shader-based subtitle */}
          <div>
            <ShaderText
              text={slides[current].subtitle}
              fontSize={24}
              fontWeight="300"
              color="rgba(255, 255, 255, 0.8)"
              width={800}
              height={120}
              className="mx-auto"
            />
          </div>
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
