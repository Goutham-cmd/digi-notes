'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import NoteCard from '@/components/notes/NoteCard';
import YouTubeVideoSection from '@/components/video/YouTubeVideoSection';
import { subjectOptions, semesterOptions } from '@/data/mockData';
import { getYouTubeVideos, getDirectYouTubeSearchUrl } from '@/data/youtubeData';
import {
  Search,
  SlidersHorizontal,
  X,
  FileQuestion,
  RefreshCw,
  Video,
  FileText,
  Play,
  ExternalLink,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export default function ExploreView() {
  const {
    notes,
    subjects,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedSemester,
    setSelectedSemester,
    sortBy,
    setSortBy,
  } = useApp();

  const [viewMode, setViewMode] = useState<'notes' | 'videos'>('notes');

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Only approved and published notes appear on public Explore Notes
        const isPublished = (note.status || '').toLowerCase() === 'published';
        if (!isPublished) return false;

        // Search filter (title, description, tags, course code, uploader)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesTitle = note.title.toLowerCase().includes(query);
          const matchesDesc = note.description.toLowerCase().includes(query);
          const matchesSubject = note.subject.toLowerCase().includes(query);
          const matchesCode = note.courseCode.toLowerCase().includes(query);
          const matchesTags = note.tags.some((t) => t.toLowerCase().includes(query));
          const matchesAuthor = note.uploader.name.toLowerCase().includes(query);

          if (!matchesTitle && !matchesDesc && !matchesSubject && !matchesCode && !matchesTags && !matchesAuthor) {
            return false;
          }
        }

        // Subject filter
        if (selectedSubject !== 'All Subjects' && note.subject !== selectedSubject) {
          return false;
        }

        // Semester filter
        if (selectedSemester !== 'All Semesters' && note.semester !== selectedSemester) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Most Popular') {
          return b.downloadsCount - a.downloadsCount;
        }
        if (sortBy === 'Highest Rated') {
          return b.rating - a.rating;
        }
        if (sortBy === 'Alphabetical') {
          return a.title.localeCompare(b.title);
        }
        // Newest First default
        return 0;
      });
  }, [notes, searchQuery, selectedSubject, selectedSemester, sortBy]);

  const subjectVideosCount = useMemo(() => {
    return getYouTubeVideos({ subject: selectedSubject }).length;
  }, [selectedSubject]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedSubject !== 'All Subjects' ||
    selectedSemester !== 'All Semesters';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All Subjects');
    setSelectedSemester('All Semesters');
    setSortBy('Most Popular');
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top Row: Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, keyword, course code (e.g. CS204, Dijkstra, Operating Systems)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            {/* View Mode Toggle: Study Notes vs YouTube Videos */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
              <button
                onClick={() => setViewMode('notes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'notes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View Study Notes"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Notes</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-mono text-slate-600">
                  {filteredNotes.length}
                </span>
              </button>

              <button
                onClick={() => setViewMode('videos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'videos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View YouTube Video Lectures"
              >
                <Video className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">YouTube Hub</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 font-mono font-bold">
                  {subjectVideosCount}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Highest Rated">Highest Rated</option>
                <option value="Newest First">Newest First</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row: Subject & Semester Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filters:</span>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="text-xs font-semibold bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All Subjects">All Subjects</option>
              {subjects.length > 0
                ? subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))
                : subjectOptions
                    .filter((s) => s !== 'All Subjects')
                    .map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
            </select>

            {/* Semester Selector */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span>
              Showing <span className="font-bold text-slate-900">{filteredNotes.length}</span> study notes
            </span>
            <span>•</span>
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <Video className="w-3 h-3" />
              {subjectVideosCount} YouTube video lectures
            </span>
          </div>
        </div>
      </div>

      {/* When a specific subject is selected and in 'notes' mode: show prominent Video Hub Banner */}
      {selectedSubject !== 'All Subjects' && viewMode === 'notes' && (
        <div className="bg-gradient-to-r from-rose-50 via-indigo-50/60 to-rose-50 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                  YouTube Learning Hub
                </span>
                <span className="text-xs text-slate-500 font-medium">{selectedSubject}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {subjectVideosCount > 0
                  ? `${subjectVideosCount} YouTube Video Lectures & Masterclasses Found`
                  : `Search YouTube across the Internet for ${selectedSubject}`}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Full courses, one-shot crash courses, 3Blue1Brown/Reducible visual animations, and solved numerical problems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setViewMode('videos')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs shadow-rose-200 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Videos ({subjectVideosCount})</span>
            </button>
            <a
              href={getDirectYouTubeSearchUrl(selectedSubject)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
              title="Search live on YouTube"
            >
              <span>YouTube ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area based on View Mode */}
      {viewMode === 'videos' ? (
        /* YouTube Videos Hub */
        <YouTubeVideoSection selectedSubject={selectedSubject} />
      ) : (
        /* Study Notes Grid */
        <div>
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <FileQuestion className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No notes match your filters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                We couldn&apos;t find any documents matching your current search term or filter selection.
                You can explore YouTube video lectures or reset filters.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setViewMode('videos')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>View {selectedSubject} YouTube Lectures</span>
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
