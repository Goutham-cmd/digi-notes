'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  UploadCloud,
  Menu,
  Bell,
  BookMarked,
  Filter,
  Sparkles,
  LogOut,
} from 'lucide-react';

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    openUploadModal,
    setIsMobileSidebarOpen,
    userProfile,
    signOut,
  } = useApp();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: `Welcome back, ${userProfile.name.split(' ')[0]} 👋`,
          subtitle: 'Find, organize, and share peer-verified study materials.',
        };
      case 'explore':
        return {
          title: 'Explore Study Materials',
          subtitle: 'Search across all departments, courses, and semesters.',
        };
      case 'uploads':
        return {
          title: 'My Uploaded Notes',
          subtitle: 'Manage your contributions, track downloads, and review status.',
        };
      case 'bookmarks':
        return {
          title: 'Saved & Bookmarked Notes',
          subtitle: 'Quick access to your curated exam preparations and cheat sheets.',
        };
      case 'categories':
        return {
          title: 'Academic Disciplines & Categories',
          subtitle: 'Browse notes curated by engineering and science faculties.',
        };
      case 'settings':
        return {
          title: 'Account & Preferences',
          subtitle: 'Manage your profile, university details, and notifications.',
        };
      case 'admin':
        return {
          title: 'Campus Administration Portal',
          subtitle: 'Content moderation, user oversight, curriculum governance, and platform audit logs.',
        };
      default:
        return {
          title: 'NoteNest Dashboard',
          subtitle: 'Digital Notes and Resource Sharing Platform',
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'explore') {
      setActiveTab('explore');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  userProfile.role === 'admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {userProfile.role === 'admin' ? 'ADMIN' : 'STUDENT'}
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 truncate">{subtitle}</p>
          </div>
        </div>

        {/* Right: Search + Action buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex items-center w-64 lg:w-72"
          >
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes, subjects, codes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'explore' && e.target.value.trim().length > 0) {
                  setActiveTab('explore');
                }
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </form>

          {/* Quick Notification icon */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('explore')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Recent Activity"
              aria-label="Recent activity and notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Sign Out of NoteNest"
            aria-label="Sign out of your NoteNest account"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Upload Button */}
          <button
            onClick={openUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Notes</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Mobile search input */}
      <div className="mt-2.5 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, topics, codes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'explore' && e.target.value.trim().length > 0) {
                setActiveTab('explore');
              }
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </form>
      </div>
    </header>
  );
}
