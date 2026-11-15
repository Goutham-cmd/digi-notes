'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NavTab } from '@/types';
import {
  BookOpen,
  Compass,
  UploadCloud,
  Bookmark,
  LayoutGrid,
  Settings,
  Sparkles,
  X,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

interface SidebarItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    notes,
    userProfile,
    isAdmin,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    openUploadModal,
  } = useApp();

  const myUploadsCount = notes.filter((n) => n.uploader.isCurrentUser).length;
  const bookmarksCount = notes.filter((n) => n.isBookmarked).length;
  const pendingCount = notes.filter(
    (n) => n.status.toLowerCase() === 'pending' || n.status.toLowerCase() === 'in review'
  ).length;

  const navItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'explore', label: 'Explore Notes', icon: Compass, badge: notes.filter(n => n.status.toLowerCase() === 'published').length },
    { id: 'uploads', label: 'My Uploads', icon: UploadCloud, badge: myUploadsCount },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, badge: bookmarksCount },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: 'Live' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
    ...(isAdmin ? [{ id: 'admin' as NavTab, label: 'Admin Portal', icon: ShieldCheck, badge: pendingCount > 0 ? pendingCount : undefined }] : []),
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">NoteNest</span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full border border-indigo-200/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Peer Resource Hub</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Upload Action */}
        <div className="px-4 pt-5 pb-2">
          <button
            onClick={() => {
              openUploadModal();
              if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
            }}
            className="btn-3d w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-200 transition-all active:scale-[0.99]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 font-semibold shadow-xs translate-x-1 border-l-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick study badge card */}
          <div className="pt-6 px-1">
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100/90 card-3d-lift cursor-default">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-900">Campus Verified</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All uploaded notes undergo student peer review and professor syllabus alignment.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-slate-100">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {userProfile.name}
                </span>
                {isAdmin ? (
                  <span className="text-[9px] font-extrabold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                    ADMIN
                  </span>
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">{userProfile.department}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
}
