'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { openLegalModal } = useApp();

  useEffect(() => {
    try {
      const consent = localStorage.getItem('notenest_cookie_consent');
      if (!consent) {
        // Show after 1.2s delay for non-intrusive entry
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Storage access disabled
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('notenest_cookie_consent', type);
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-900/10 text-slate-800">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Privacy & Cookie Choices</h4>
          </div>

          <button
            onClick={() => handleAccept('essential')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          NoteNest uses essential cookies and local browser storage to keep you signed in, preserve
          your bookmarks, and maintain campus download security. We never sell student data.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <button
              onClick={() => openLegalModal('privacy')}
              className="underline hover:text-indigo-600 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => openLegalModal('terms')}
              className="underline hover:text-indigo-600 transition-colors"
            >
              Terms
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAccept('essential')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleAccept('all')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

