"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Fragment shader for the distortion and heat effect
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  // Noise function for heat effect
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
    // Use UV coordinates directly - they should already be properly mapped
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    vec2 mousePos = (uMouse + 1.0) * 0.5; // Convert from -1,1 to 0,1
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
    
    // Sample the texture
    vec4 color = texture2D(uTexture, uv);
    
    // Base image should be at normal brightness when not hovered
    vec3 baseColor = color.rgb;
    
    // Heat/burn effect
    float heat = smoothstep(0.3, 0.0, dist) * uHover;
    
    // Add noise for heat distortion
    float noiseValue = noise(uv * 10.0 + uTime * 2.0) * 0.1;
    heat += noiseValue * uHover * 0.5;
    
    // Start with the base color (normal brightness)
    vec3 finalColor = baseColor;
    
    // Only apply effects when hovering
    if (uHover > 0.0) {
      // Brighten highlights and add warmth
      vec3 heated = baseColor;
      
      // Increase brightness
      heated = mix(heated, heated * 1.3, heat);
      
      // Add warm tint (more red/orange)
      heated.r = mix(heated.r, min(heated.r * 1.2, 1.0), heat);
      heated.g = mix(heated.g, min(heated.g * 1.1, 1.0), heat);
      heated.b = mix(heated.b, heated.b * 0.9, heat);
      
      // Add subtle glow
      float glow = smoothstep(0.4, 0.0, dist) * uHover * 0.2;
      heated += vec3(glow * 0.3, glow * 0.2, glow * 0.1);
      
      // Blend between base and heated based on hover amount
      finalColor = mix(baseColor, heated, uHover);
    }
    
    gl_FragColor = vec4(finalColor, color.a);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface HoverImageMeshProps {
  imageUrl: string;
  width: number;
  height: number;
}

const HoverImageMesh: React.FC<HoverImageMeshProps> = ({
  imageUrl,
  width,
  height,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0));

  // Use the same texture loading approach as the working debug version
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useEffect(() => {
    if (texture) {
      console.log("✅ Shader texture loaded:", imageUrl);
      texture.flipY = true; // Fix image orientation
      texture.format = THREE.RGBAFormat;
      texture.needsUpdate = true;
    }
  }, [texture, imageUrl]);

  // Create shader material
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }, [texture, width, height]);

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
      // Convert mouse position to UV coordinates
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

  return (
    <mesh
      ref={meshRef}
      material={shaderMaterial}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
};

interface HoverEffectImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const HoverEffectImage: React.FC<HoverEffectImageProps> = ({
  src,
  width,
  height,
  className = "",
}) => {
  const aspect = width / height;

  useEffect(() => {
    console.log("🚀 HoverEffectImage mounted with src:", src);
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: aspect }}>
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
        onCreated={(state) => {
          console.log("✅ Shader Canvas created");
          // Ensure the camera properly fits the content
          state.camera.updateProjectionMatrix();
        }}
      >
        <HoverImageMesh imageUrl={src} width={width} height={height} />
      </Canvas>
    </div>
  );
};

export default HoverEffectImage;
