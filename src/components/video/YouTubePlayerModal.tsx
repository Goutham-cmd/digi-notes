'use client';

import React from 'react';
import { YouTubeVideo } from '@/data/youtubeData';
import {
  X,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Eye,
  Clock,
  GraduationCap,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface YouTubePlayerModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export default function YouTubePlayerModal({ video, onClose }: YouTubePlayerModalProps) {
  const { setActiveTab, setSelectedSubject, addToast } = useApp();

  if (!video) return null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(video.youtubeUrl);
      addToast({
        title: 'Video Link Copied',
        description: 'YouTube link copied to your clipboard.',
        type: 'info',
      });
    }
  };

  const handleDiscuss = () => {
    onClose();
    setActiveTab('chat');
  };

  const handleExploreSubjectNotes = () => {
    onClose();
    setSelectedSubject(video.subject);
    setActiveTab('explore');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              {video.subject}
            </span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shrink-0">
              {video.typeLabel}
            </span>
            <span className="text-xs text-slate-500 truncate hidden md:inline">
              by {video.channel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Share video"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Open on YouTube in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player (Responsive 16:9 iframe) */}
        <div className="relative w-full aspect-video bg-black shrink-0">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Body / Details */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  {video.channel}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {video.duration}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                  {video.level}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDiscuss}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discuss in Lounge</span>
              </button>
              <button
                onClick={handleExploreSubjectNotes}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Subject Notes</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>{video.description}</p>
          </div>

          {/* Key Topics Covered */}
          {video.keyTopics && video.keyTopics.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Syllabus Topics Covered in Video
              </h4>
              <div className="flex flex-wrap gap-2">
                {video.keyTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="text-slate-500 hidden sm:block">
            Sourced from verified public academic channels on YouTube.
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
