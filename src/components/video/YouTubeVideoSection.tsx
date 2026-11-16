'use client';

import React, { useState, useMemo } from 'react';
import {
  YouTubeVideo,
  YouTubeVideoType,
  youtubeCategories,
  getYouTubeVideos,
  getDirectYouTubeSearchUrl,
} from '@/data/youtubeData';
import YouTubeVideoCard from './YouTubeVideoCard';
import YouTubePlayerModal from './YouTubePlayerModal';
import {
  Video,
  Search,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Film,
  GraduationCap,
} from 'lucide-react';

interface YouTubeVideoSectionProps {
  selectedSubject: string;
  defaultCategory?: YouTubeVideoType;
}

export default function YouTubeVideoSection({
  selectedSubject,
  defaultCategory = 'all',
}: YouTubeVideoSectionProps) {
  const [activeCategory, setActiveCategory] = useState<YouTubeVideoType>(defaultCategory);
  const [videoSearch, setVideoSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  const videos = useMemo(() => {
    return getYouTubeVideos({
      subject: selectedSubject,
      query: videoSearch,
      type: activeCategory,
    });
  }, [selectedSubject, videoSearch, activeCategory]);

  const allTypesCount = useMemo(() => {
    return getYouTubeVideos({
      subject: selectedSubject,
    }).length;
  }, [selectedSubject]);

  const youtubeDirectUrl = useMemo(() => {
    return getDirectYouTubeSearchUrl(selectedSubject, videoSearch);
  }, [selectedSubject, videoSearch]);

  const isAllSubjects = selectedSubject === 'All Subjects';

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-indigo-500/20 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>YouTube Video Masterclasses</span>
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                {isAllSubjects ? 'All Disciplines' : selectedSubject}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isAllSubjects ? 'Internet YouTube Lectures Hub' : `${selectedSubject} Video Hub`}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                {videos.length} Available
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated from world-class university lecture series, MIT OpenCourseWare, freeCodeCamp, Gate Smashers, and top visual engineering animators.
            </p>
          </div>

          {/* Quick YouTube Search Out link */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={youtubeDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-900/40 transition-all active:scale-95"
              title="Search live on YouTube"
            >
              <Film className="w-4 h-4" />
              <span>Search YouTube Directly</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Video Filter Chips & Search Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {youtubeCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm scale-[1.02]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Topic search inside videos */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter topics (e.g. Dijkstra, SQL, KVL)..."
              value={videoSearch}
              onChange={(e) => setVideoSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
            />
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <YouTubeVideoCard
              key={video.id}
              video={video}
              onPlay={(v) => setActiveVideo(v)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No curated videos match &ldquo;{videoSearch}&rdquo; for this filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            You can search YouTube live across the entire internet for this subject and topic with one click:
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={youtubeDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Search YouTube Internet for &ldquo;{selectedSubject}&rdquo;</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                setVideoSearch('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Video Theater Player Modal */}
      <YouTubePlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
