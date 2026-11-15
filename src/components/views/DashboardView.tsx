'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import StatsCard from '@/components/common/StatsCard';
import NoteCard from '@/components/notes/NoteCard';
import { popularSubjects, mockActivities } from '@/data/mockData';
import {
  FileText,
  UploadCloud,
  Download,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export default function DashboardView() {
  const { notes, setActiveTab, openUploadModal, navigateToSubject } = useApp();

  const myUploads = notes.filter((n) => n.uploader.isCurrentUser);
  const bookmarkedNotes = notes.filter((n) => n.isBookmarked);
  const totalDownloads = notes.reduce((acc, curr) => acc + curr.downloadsCount, 0);

  const recentlyAdded = [...notes].slice(0, 4);
  const recommendedNotes = notes.filter((n) => n.isRecommended).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Semester Midterm & Final Exam Archives Live</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Access verified lecture notes, cheat sheets & lab solutions.
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            NoteNest empowers college students to share curated course guides, peer-reviewed study
            materials, and exam blueprints.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs sm:text-sm shadow hover:bg-slate-100 transition-all active:scale-[0.98]"
            >
              <span>Explore All Notes</span>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </button>

            <button
              onClick={openUploadModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 text-white font-medium text-xs sm:text-sm transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Contribute Notes</span>
            </button>
          </div>
        </div>

        {/* Abstract subtle background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Layers className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Notes"
          value={notes.length}
          change="+18% this month"
          icon={FileText}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={() => setActiveTab('explore')}
        />

        <StatsCard
          label="My Uploads"
          value={myUploads.length}
          change="3 in review"
          icon={UploadCloud}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => setActiveTab('uploads')}
        />

        <StatsCard
          label="Campus Downloads"
          value={totalDownloads.toLocaleString()}
          change="+240 today"
          icon={Download}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatsCard
          label="My Bookmarks"
          value={bookmarkedNotes.length}
          change="Saved for finals"
          icon={Bookmark}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => setActiveTab('bookmarks')}
        />
      </div>

      {/* Popular Subjects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Popular Subjects
            </h3>
            <p className="text-xs text-slate-500">Quickly filter notes by high-demand coursework</p>
          </div>

          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularSubjects.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => navigateToSubject(sub.name)}
              className="p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
            >
              <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                {sub.code}
              </span>

              <div className="mt-2.5">
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-1 transition-colors">
                  {sub.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{sub.notesCount} study notes</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Two Column Section: Recently Added Notes & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recently Added Notes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Recently Added Notes
              </h3>
              <p className="text-xs text-slate-500">Latest student contributions across semesters</p>
            </div>

            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentlyAdded.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recommended Resources & Community Activity */}
        <div className="space-y-6">
          {/* Recommended Resources */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Recommended for You</h4>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Curated</span>
            </div>

            <div className="divide-y divide-slate-100">
              {recommendedNotes.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => navigateToSubject(rec.subject)}
                  className="py-3 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                      {rec.courseCode}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {rec.fileType}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mt-1 line-clamp-2">
                    {rec.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>{rec.uploader.name}</span>
                    <span className="font-medium text-slate-600">{rec.downloadsCount} dl</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Campus Activity</h4>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="space-y-3.5">
              {mockActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 leading-snug">
                      <span className="font-semibold text-slate-900">{act.user}</span>{' '}
                      {act.action}{' '}
                      <span className="font-medium text-indigo-700">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
