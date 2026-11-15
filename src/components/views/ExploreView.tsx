'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import NoteCard from '@/components/notes/NoteCard';
import { subjectOptions, semesterOptions } from '@/data/mockData';
import {
  Search,
  SlidersHorizontal,
  FolderOpen,
  X,
  FileQuestion,
  RefreshCw,
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

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Stage 4: Only approved and published notes appear on public Explore Notes
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
            <div className="flex items-center gap-2 w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
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
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredNotes.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{notes.length}</span> study resources
          </div>
        </div>
      </div>

      {/* Notes Grid */}
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
            We couldn't find any documents matching your current search term or filter selection.
            Try clearing filters or checking other semesters.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
