'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import NoteCard from '@/components/notes/NoteCard';
import { Bookmark, Search, Compass, BookOpen, Trash2 } from 'lucide-react';

export default function BookmarksView() {
  const { notes, setActiveTab } = useApp();
  const [bookmarkSearch, setBookmarkSearch] = useState('');

  const bookmarkedNotes = notes.filter((n) => n.isBookmarked);

  const filteredBookmarks = bookmarkedNotes.filter((note) => {
    if (!bookmarkSearch.trim()) return true;
    const query = bookmarkSearch.toLowerCase().trim();
    return (
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query) ||
      note.courseCode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Saved Study Resources ({bookmarkedNotes.length})
            </h3>
            <p className="text-xs text-slate-500">Your personalized revision collection</p>
          </div>
        </div>

        {bookmarkedNotes.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in bookmarks..."
              value={bookmarkSearch}
              onChange={(e) => setBookmarkSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Bookmarks Grid or Empty State */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {bookmarkedNotes.length === 0 ? 'No bookmarks yet' : 'No matching bookmarks'}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {bookmarkedNotes.length === 0
              ? 'Click the bookmark icon on any note card while exploring to keep track of midterm guides and cheat sheets here.'
              : `No bookmarks match "${bookmarkSearch}".`}
          </p>

          <div className="mt-5">
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Study Notes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
