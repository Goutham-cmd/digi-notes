'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NavTab } from '@/types';
import {
  BookOpen,
  Compass,
  UploadCloud,
  Bookmark,
  MessageSquare,
} from 'lucide-react';

export default function MobileNavBar() {
  const {
    activeTab,
    setActiveTab,
    notes,
    openUploadModal,
  } = useApp();

  const bookmarksCount = notes.filter((n) => n.isBookmarked).length;

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {/* 1. Dashboard Tab */}
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Dashboard"
        >
          {activeTab === 'dashboard' && (
            <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
          )}
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* 2. Explore Tab */}
        <button
          onClick={() => handleTabClick('explore')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative ${
            activeTab === 'explore'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Explore Notes and Videos"
        >
          {activeTab === 'explore' && (
            <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
          )}
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Explore</span>
        </button>

        {/* 3. Center Quick Action: Upload (+) Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={openUploadModal}
            className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-300 active:scale-90 transition-transform"
            aria-label="Upload Study Resource"
            title="Upload Note"
          >
            <UploadCloud className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Messages / Study Lounge Tab */}
        <button
          onClick={() => handleTabClick('chat')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative ${
            activeTab === 'chat'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Messages"
        >
          {activeTab === 'chat' && (
            <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
          )}
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <span className="text-[10px] mt-1">Messages</span>
        </button>

        {/* 5. Bookmarks Tab */}
        <button
          onClick={() => handleTabClick('bookmarks')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative ${
            activeTab === 'bookmarks'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Saved Bookmarks"
        >
          {activeTab === 'bookmarks' && (
            <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
          )}
          <div className="relative">
            <Bookmark className="w-5 h-5" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-mono px-1 min-w-[14px] h-[14px] rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {bookmarksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Saved</span>
        </button>
      </div>
    </nav>
  );
}
