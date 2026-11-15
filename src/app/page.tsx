'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardView from '@/components/views/DashboardView';
import ExploreView from '@/components/views/ExploreView';
import MyUploadsView from '@/components/views/MyUploadsView';
import BookmarksView from '@/components/views/BookmarksView';
import CategoriesView from '@/components/views/CategoriesView';
import SettingsView from '@/components/views/SettingsView';

export default function Home() {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'explore':
        return <ExploreView />;
      case 'uploads':
        return <MyUploadsView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'categories':
        return <CategoriesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all">
        {/* Sticky Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Minimal Campus SaaS Footer */}
        <footer className="border-t border-slate-200/80 bg-white/50 py-4 px-4 sm:px-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">NoteNest</span> — Digital Notes & Resource Sharing Platform. Built for University Excellence.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center justify-center gap-4 text-slate-400">
            <span>Syllabus Aligned</span>
            <span>•</span>
            <span>Peer Reviewed</span>
            <span>•</span>
            <span>Phase 1 Hackathon Release</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
