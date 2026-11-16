'use client';

import React from 'react';
import { YouTubeVideo } from '@/data/youtubeData';
import {
  Play,
  ExternalLink,
  Clock,
  Eye,
  GraduationCap,
  Sparkles,
  Zap,
  PlayCircle,
  FileCheck,
} from 'lucide-react';

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export default function YouTubeVideoCard({ video, onPlay }: YouTubeVideoCardProps) {
  const getTypeBadge = () => {
    switch (video.type) {
      case 'full-course':
        return {
          icon: GraduationCap,
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-100',
        };
      case 'crash-course':
        return {
          icon: Zap,
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
        };
      case 'concept-animation':
        return {
          icon: PlayCircle,
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-100',
        };
      case 'exam-problems':
        return {
          icon: FileCheck,
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
        };
      default:
        return {
          icon: Sparkles,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
        };
    }
  };

  const badge = getTypeBadge();
  const IconComponent = badge.icon;

  return (
    <div
      onClick={() => onPlay(video)}
      className="group bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {/* Thumbnail image */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Play overlay icon */}
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 flex items-center justify-center transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/90 group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium flex items-center gap-1 shadow-xs">
          <Clock className="w-3 h-3 text-slate-300" />
          <span>{video.duration}</span>
        </div>

        {/* Subject tag top left */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-indigo-200 text-[10px] font-semibold border border-white/10">
            {video.subject}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Type Badge & Channel */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              <IconComponent className="w-3 h-3" />
              <span>{video.typeLabel}</span>
            </span>

            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.views}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Channel Name */}
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{video.channel}</span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Topics & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-hidden">
            {video.keyTopics.slice(0, 2).map((topic, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate"
              >
                #{topic}
              </span>
            ))}
            {video.keyTopics.length > 2 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{video.keyTopics.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Open on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(video);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-xs transition-all"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Watch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
