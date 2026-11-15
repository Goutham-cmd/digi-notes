'use client';

import React, { useRef, useState } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  depth?: number;
  showGlare?: boolean;
  onClick?: () => void;
}

export default function ThreeDCard({
  children,
  className = '',
  intensity = 12,
  depth = 15,
  showGlare = true,
  onClick,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) translateZ(0px)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth}px)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? transform : 'none',
        }}
      >
        {children}

        {/* Dynamic Specular 3D Glare */}
        {showGlare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 180px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
}

