'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, BookOpen, Layers, Star, Zap, Award, Flame } from 'lucide-react';

interface Interactive3DModelProps {
  coveragePercentage?: number;
  totalNotes?: number;
  verifiedCount?: number;
}

export default function Interactive3DModel({
  coveragePercentage = 88,
  totalNotes = 0,
  verifiedCount = 0,
}: Interactive3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 10, y: -15 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);

  const metrics = [
    {
      title: 'Syllabus Coverage',
      percent: coveragePercentage,
      subtitle: 'Course blueprint aligned',
      color: 'from-indigo-500 to-cyan-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      icon: Award,
    },
    {
      title: 'Peer Verification',
      percent: totalNotes > 0 ? Math.min(100, Math.round((verifiedCount / totalNotes) * 100)) : 96,
      subtitle: 'Moderator & peer reviewed',
      color: 'from-emerald-400 to-teal-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: CheckCircle2,
    },
    {
      title: 'Exam Readiness',
      percent: 92,
      subtitle: 'Formula sheets & solutions',
      color: 'from-amber-400 to-rose-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      icon: Flame,
    },
  ];

  const currentMetric = metrics[activeMetricIndex];

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isAutoSpinning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 22;
    const rotateX = -((y - centerY) / centerY) * 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isAutoSpinning) {
      setRotation({ x: 10, y: -15 });
    }
  };

  // Auto-spin animation toggle
  useEffect(() => {
    if (!isAutoSpinning) return;
    let frameId: number;
    let angle = rotation.y;

    const animate = () => {
      angle += 0.8;
      setRotation((prev) => ({ ...prev, y: angle % 360, x: Math.sin(angle * 0.02) * 12 }));
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoSpinning, rotation.y]);

  const cycleMetric = () => {
    setActiveMetricIndex((prev) => (prev + 1) % metrics.length);
  };

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentMetric.percent / 100) * circumference;

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center select-none">
      {/* Background ambient neon glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 bg-indigo-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="w-40 h-40 bg-purple-500/20 rounded-full blur-2xl translate-x-12 -translate-y-8" />
      </div>

      {/* 3D Viewport container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[340px] h-[280px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {/* The 3D Scene Root */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Layer 1: Back Base Grid / Blueprint Shadow (-40px Z) */}
          <div
            className="absolute w-52 h-64 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900/90 border border-indigo-500/20 shadow-2xl backdrop-blur-md flex flex-col justify-between p-4 pointer-events-none"
            style={{
              transform: 'translateZ(-40px) rotateZ(-8deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
              <span className="text-[10px] font-mono text-indigo-400">ARCHIVE // V.24</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
              </div>
            </div>
            <div className="space-y-2 opacity-30">
              <div className="h-2 bg-indigo-400/40 rounded w-3/4" />
              <div className="h-2 bg-indigo-400/20 rounded w-5/6" />
              <div className="h-2 bg-indigo-400/20 rounded w-1/2" />
            </div>
            <div className="text-[9px] font-mono text-slate-500 flex justify-between">
              <span>EXAM_BLUEPRINT</span>
              <span>CS-SEMESTER</span>
            </div>
          </div>

          {/* Layer 2: Middle Floating Document Card (-10px Z) */}
          <div
            className="absolute w-56 h-68 rounded-2xl bg-gradient-to-tr from-slate-900/95 via-indigo-950/80 to-slate-800/95 border border-indigo-400/30 shadow-xl backdrop-blur-md p-4 flex flex-col justify-between"
            style={{
              transform: 'translateZ(-10px) rotateZ(4deg)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                ● LIVE SYNC
              </span>
              <span className="text-[10px] font-mono text-slate-400">P2P REPO</span>
            </div>
            <div className="space-y-1.5 my-auto">
              <p className="text-xs font-bold text-slate-200 line-clamp-1">
                Operating Systems: Virtual Memory & Page Tables
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>12 Pages</span>
                <span>•</span>
                <span>4.9 ★ Rating</span>
              </div>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-4/5 rounded-full" />
            </div>
          </div>

          {/* Layer 3: Main Front Interactive 3D Note Card (+30px Z) */}
          <div
            onClick={cycleMetric}
            className="group relative w-60 h-72 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-900/95 border border-indigo-400/50 shadow-2xl backdrop-blur-xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-indigo-300"
            style={{
              transform: 'translateZ(30px)',
              boxShadow: isHovered
                ? '0 30px 60px -15px rgba(79, 70, 229, 0.4), 0 0 25px rgba(99, 102, 241, 0.2)'
                : '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Top Bar with Status & Live Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[11px] font-semibold text-white tracking-wide">
                  NoteNest Core
                </span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentMetric.badgeBg}`}>
                {currentMetric.title}
              </span>
            </div>

            {/* Center: Interactive 3D Holographic Progress Ring (+50px Z) */}
            <div
              className="relative my-auto flex flex-col items-center justify-center transition-transform duration-300"
              style={{ transform: 'translateZ(25px)' }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Animated Progress Gradient Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black tracking-tight text-white flex items-center">
                    {currentMetric.percent}
                    <span className="text-xs text-indigo-400 font-bold ml-0.5">%</span>
                  </span>
                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                    Aligned
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-medium text-slate-300 mt-2 text-center">
                {currentMetric.subtitle}
              </p>
            </div>

            {/* Card Footer: Interactive Hint & Tag */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-indigo-300 font-medium">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Tap to Switch Metric
              </span>
              <span className="text-slate-500 font-mono">3D / V.3</span>
            </div>
          </div>

          {/* Layer 4: Floating 3D Satellite Badge 1 (Top Right, +65px Z) */}
          <div
            className="absolute -top-3 -right-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-400/40 shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-transform duration-300 pointer-events-none"
            style={{
              transform: 'translateZ(65px)',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="text-[10px] font-bold text-white">
              <span className="text-amber-300">Fast-Track</span> Revision
            </div>
          </div>

          {/* Layer 5: Floating 3D Satellite Badge 2 (Bottom Left, +55px Z) */}
          <div
            className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-400/40 shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-transform duration-300 pointer-events-none"
            style={{
              transform: 'translateZ(55px)',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-200">Professor Vetted</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Interaction Control Controls (Bottom Center) */}
      <div className="absolute bottom-1 flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-full px-3 py-1 backdrop-blur-md text-[11px] text-slate-300 shadow-sm z-20">
        <span className="flex items-center gap-1 text-slate-400">
          <Layers className="w-3 h-3 text-indigo-400" />
          Interactive 3D
        </span>
        <span className="text-slate-600">•</span>
        <button
          onClick={() => setIsAutoSpinning((prev) => !prev)}
          className={`font-semibold transition-colors px-1.5 py-0.5 rounded ${
            isAutoSpinning
              ? 'text-indigo-400 bg-indigo-500/20'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Toggle continuous 360 rotation"
        >
          {isAutoSpinning ? 'Pause Spin' : '360° Spin'}
        </button>
        <span className="text-slate-600">•</span>
        <button
          onClick={() => {
            setIsAutoSpinning(false);
            setRotation({ x: 10, y: -15 });
          }}
          className="text-slate-400 hover:text-white transition-colors"
          title="Reset orientation"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

