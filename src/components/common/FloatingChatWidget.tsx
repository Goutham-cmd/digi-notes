'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MessageSquareCode, Sparkles } from 'lucide-react';

export default function FloatingChatWidget() {
  const { activeTab, setActiveTab } = useApp();

  // Hide when already on the chat page
  if (activeTab === 'chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={() => setActiveTab('chat')}
        className="group flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Open NoteNest Student Study Lounge"
        aria-label="Open Student Study Lounge Chat"
      >
        <div className="relative">
          <MessageSquareCode className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
        <span className="text-xs font-semibold tracking-wide">
          Study Lounge
        </span>
        <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
          Chat Live
        </span>
      </button>
    </div>
  );
}

