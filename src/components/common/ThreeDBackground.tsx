'use client';

import React from 'react';

export default function ThreeDBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 3D Isometric Perspective Grid Plane */}
      <div
        className="absolute -top-40 -left-40 right-0 h-[600px] opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #4f46e5 1px, transparent 1px),
            linear-gradient(to bottom, #4f46e5 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(600px) rotateX(45deg) scale(1.4)',
          transformOrigin: 'top center',
        }}
      />

      {/* Floating 3D Element 1: Glass Cube Top Right */}
      <div
        className="absolute top-24 right-16 w-32 h-32 opacity-25 hidden md:block"
        style={{
          perspective: 800,
          animation: 'float3dSlow 14s ease-in-out infinite alternate',
        }}
      >
        <div
          className="w-full h-full rounded-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-[1px] shadow-lg shadow-indigo-500/10"
          style={{
            transform: 'rotateX(25deg) rotateY(-35deg) translateZ(20px)',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* Floating 3D Element 2: Note Sheet Mid Left */}
      <div
        className="absolute top-1/2 left-8 w-24 h-32 opacity-20 hidden lg:block"
        style={{
          perspective: 600,
          animation: 'float3dMedium 10s ease-in-out infinite alternate-reverse',
        }}
      >
        <div
          className="w-full h-full rounded-xl border border-indigo-300/30 bg-white/40 shadow-md shadow-indigo-900/5 p-3 flex flex-col justify-between"
          style={{
            transform: 'rotateX(-20deg) rotateY(30deg) rotateZ(-12deg) translateZ(10px)',
          }}
        >
          <div className="w-8 h-1.5 bg-indigo-300/40 rounded" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-slate-400/20 rounded" />
            <div className="w-4/5 h-1 bg-slate-400/20 rounded" />
            <div className="w-3/5 h-1 bg-slate-400/20 rounded" />
          </div>
        </div>
      </div>

      {/* Floating 3D Element 3: Geometric Disc Bottom Right */}
      <div
        className="absolute bottom-20 right-1/4 w-40 h-40 opacity-15 hidden sm:block"
        style={{
          perspective: 700,
          animation: 'float3dSlow 18s ease-in-out infinite',
        }}
      >
        <div
          className="w-full h-full rounded-full border border-dashed border-indigo-400/50 bg-indigo-500/5"
          style={{
            transform: 'rotateX(55deg) rotateZ(20deg)',
          }}
        />
      </div>

      {/* Ambient Gradient Depth Orbs (Disabled on mobile to prevent compositor lag during scroll) */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10 hidden md:block" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10 hidden md:block" />

      {/* Inline Keyframes for 3D Floating Animations */}
      <style jsx global>{`
        @keyframes float3dSlow {
          0% {
            transform: translateY(0px) rotateX(10deg) rotateY(10deg);
          }
          50% {
            transform: translateY(-20px) rotateX(18deg) rotateY(-15deg);
          }
          100% {
            transform: translateY(8px) rotateX(5deg) rotateY(20deg);
          }
        }
        @keyframes float3dMedium {
          0% {
            transform: translateY(0px) rotateZ(-12deg) rotateY(20deg);
          }
          50% {
            transform: translateY(-16px) rotateZ(-4deg) rotateY(35deg);
          }
          100% {
            transform: translateY(10px) rotateZ(-18deg) rotateY(15deg);
          }
        }
        @keyframes viewPop3D {
          0% {
            opacity: 0;
            transform: perspective(1000px) translateZ(-20px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) translateZ(0px) scale(1);
          }
        }
        .animate-3d-view {
          animation: viewPop3D 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}

