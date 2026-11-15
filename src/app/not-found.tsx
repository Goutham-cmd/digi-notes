'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center selection:bg-indigo-500 selection:text-white">
      {/* Brand Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-6">
        <BookOpen className="w-7 h-7" />
      </div>

      {/* 404 Status Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
        <span>Error 404 • Page Not Found</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Course Material Not Found
      </h1>

      <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        The study guide, lecture slides, or exam review material you are looking for may have been
        relocated, merged, or archived into another syllabus.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>

        <Link
          href="/#explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200 shadow-xs transition-all active:scale-95"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Course Library</span>
        </Link>
      </div>

      <footer className="mt-16 text-xs text-slate-400">
        NoteNest Academic Resource Repository • Verified University Network
      </footer>
    </div>
  );
}

