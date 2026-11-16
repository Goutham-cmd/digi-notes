'use client';

import React from 'react';
import { Note } from '@/types';
import { useApp } from '@/context/AppContext';
import ThreeDCard from '@/components/common/ThreeDCard';
import {
  FileText,
  Download,
  Bookmark,
  Star,
  Eye,
  CheckCircle2,
  Trash2,
  Edit3,
  Archive,
  Presentation,
  FileCode,
  Play,
  Video,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
}

export default function NoteCard({ note, showActions = false }: NoteCardProps) {
  const {
    toggleBookmark,
    downloadNote,
    openPreviewModal,
    openEditModal,
    deleteNote,
    setActiveTab,
  } = useApp();

  const getFileTypeBadge = (type: Note['fileType']) => {
    switch (type) {
      case 'PDF':
        return {
          icon: FileText,
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      case 'DOCX':
        return {
          icon: FileCode,
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
        };
      case 'ZIP':
        return {
          icon: Archive,
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'PPTX':
        return {
          icon: Presentation,
          bg: 'bg-orange-50 text-orange-700 border-orange-200/80',
          dot: 'bg-orange-500',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-slate-50 text-slate-700 border-slate-200/80',
          dot: 'bg-slate-500',
        };
    }
  };

  const fileBadge = getFileTypeBadge(note.fileType);
  const FileIcon = fileBadge.icon;

  return (
    <ThreeDCard intensity={7} depth={10} className="h-full">
      <div className="group relative bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between h-full card-3d-lift">
        <div>
          {/* Top Header: Badges & Bookmark */}
          <div className="flex items-center justify-between gap-2 mb-3" style={{ transform: 'translateZ(12px)' }}>
            <div className="flex flex-wrap items-center gap-1.5">
            {/* File type */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${fileBadge.bg}`}
            >
              <FileIcon className="w-3 h-3" />
              {note.fileType}
            </span>

            {/* Semester badge */}
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {note.semester}
            </span>

            {/* Course Code */}
            <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
              {note.courseCode}
            </span>

            {/* Video Lecture Pill */}
            {note.videoUrl && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
                <Play className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                Video
              </span>
            )}

            {/* Moderation Status Pill */}
            {note.status && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  (note.status || '').toLowerCase() === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : (note.status || '').toLowerCase() === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}
              >
                {(note.status || '').toLowerCase() === 'published'
                  ? 'Published'
                  : (note.status || '').toLowerCase() === 'rejected'
                  ? 'Rejected'
                  : 'In Review'}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(note.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              note.isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={note.isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
          >
            <Bookmark
              className={`w-4 h-4 ${note.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
            />
          </button>
        </div>

        {/* Subject */}
        <p className="text-xs font-semibold text-indigo-600 mb-1">{note.subject}</p>

        {/* Note Title */}
        <h3
          onClick={() => openPreviewModal(note)}
          className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {note.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {note.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        {/* Rejection feedback */}
        {note.status.toLowerCase() === 'rejected' && note.rejectionReason && (
          <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700">
            <span className="font-semibold">Moderator Note:</span> {note.rejectionReason}
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-3">
        {/* Author info & metrics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <GraduationCap className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate flex items-center gap-1">
                <span>{note.uploader.department || note.uploader.name}</span>
                {note.verified && (
                  <CheckCircle2 className="w-3 h-3 text-indigo-600 inline shrink-0" />
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700">{note.rating.toFixed(1)}</span>
            </span>

            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>{note.downloadsCount}</span>
            </span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-slate-400">
            {note.fileSize} {note.pageCount ? `• ${note.pageCount} pgs` : ''}
          </span>

          <div className="flex items-center gap-1.5 relative z-20">
            {showActions && note.uploader.isCurrentUser && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(note);
                  }}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit note"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
                      deleteNote(note.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {note.videoUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPreviewModal(note);
                }}
                className="btn-3d inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                title="Watch attached video lecture"
              >
                <Play className="w-3 h-3 fill-rose-600 text-rose-600" />
                <span>Watch</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                openPreviewModal(note);
              }}
              className="btn-3d inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Preview notes"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('chat');
              }}
              className="btn-3d inline-flex items-center p-1.5 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Discuss in Messages"
              aria-label="Discuss in Messages"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadNote(note);
              }}
              className="btn-3d inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-xs transition-all cursor-pointer"
              title={`Download PDF: ${note.fileName}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get PDF</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </ThreeDCard>
  );
}
