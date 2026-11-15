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
import AdminPortal from '@/components/admin/AdminPortal';
import AuthView from '@/components/auth/AuthView';
import ThreeDBackground from '@/components/common/ThreeDBackground';
import { BookOpen, Loader2 } from 'lucide-react';

export default function Home() {
  const { activeTab, session, isLoadingAuth } = useApp();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 mb-4 animate-pulse">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Connecting to NoteNest...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

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
      case 'admin':
        return <AdminPortal />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-x-hidden">
      {/* Global 3D Ambient Perspective Background */}
      <ThreeDBackground />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all relative z-10">
        {/* Sticky Header */}
        <Header />

        {/* Dynamic Page Content with Clean 3D Transitions */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          <div key={activeTab} className="animate-3d-view">
            {renderActiveView()}
          </div>
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
            <span>Campus Academic Network</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
