'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Download,
  Bookmark,
  Star,
  CheckCircle2,
  Calendar,
  FileText,
  Share2,
  FileCheck,
  ShieldCheck,
  Tag,
  Video,
  Play,
  ExternalLink,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { getEmbedUrl } from '@/lib/videoUtils';

export default function NotePreviewModal() {
  const { previewNote, closePreviewModal, toggleBookmark, downloadNote, addToast, setActiveTab } = useApp();

  if (!previewNote) return null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Share Link Copied',
        description: 'Resource link copied to clipboard.',
        type: 'info',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] modal-3d-appear">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate mr-2">
            <span className="text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 truncate">
              {previewNote.subject}
            </span>
            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
              {previewNote.courseCode}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline shrink-0">{previewNote.semester}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(previewNote.id)}
              className={`p-2 rounded-xl border transition-colors ${
                previewNote.isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={previewNote.isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
            >
              <Bookmark
                className={`w-4 h-4 ${previewNote.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Share resource"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={closePreviewModal}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Uploader */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {previewNote.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      {previewNote.uploader.department || previewNote.uploader.name}
                    </span>
                    {previewNote.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                        Verified Curriculum
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Peer-Reviewed Course Repository</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{previewNote.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({previewNote.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">
                    {previewNote.downloadsCount}
                  </span>
                  <span>downloads</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{previewNote.uploadedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Summary & Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              {previewNote.description}
            </p>
          </div>

          {/* Attached Video Lecture Section */}
          {previewNote.videoUrl && (
            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-md border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center border border-rose-500/30">
                    <Video className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Watch Video Lecture Companion
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Curated video tutorial corresponding to this study material
                    </p>
                  </div>
                </div>

                <a
                  href={previewNote.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              {getEmbedUrl(previewNote.videoUrl) ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 shadow-inner">
                  <iframe
                    src={getEmbedUrl(previewNote.videoUrl) || ''}
                    title={previewNote.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <a
                  href={previewNote.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-slate-800/80 rounded-xl hover:bg-slate-800 transition-colors text-indigo-400 text-xs font-semibold"
                >
                  <Play className="w-4 h-4 fill-indigo-400" />
                  <span>Click to watch lecture on external platform ({previewNote.videoUrl})</span>
                </a>
              )}
            </div>
          )}

          {/* Simulated Document Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Document Preview ({previewNote.pageCount ? `${previewNote.pageCount} Pages` : 'Document'})
              </h4>
              <span className="text-xs text-indigo-600 font-medium">Page 1 of {previewNote.pageCount || 10}</span>
            </div>

            <div className="bg-slate-100 rounded-xl p-4 sm:p-6 border border-slate-200 text-slate-700">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4 max-w-xl mx-auto">
                <div className="border-b border-slate-100 pb-3">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {previewNote.courseCode} — {previewNote.subject} — Notes
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {previewNote.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Source: {previewNote.uploader.department || previewNote.subject} • NoteNest Verified
                  </p>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                  <p className="font-semibold text-slate-800">1. Core Objectives & Conceptual Outline</p>
                  <p>
                    These lecture review notes synthesize foundational theory with worked examination
                    problems, algorithmic pseudocode, and step-by-step problem-solving templates.
                  </p>
                  <div className="bg-slate-50 p-3 rounded border border-slate-100 text-[11px] font-mono text-slate-700">
                    Theorem / Main Principle: Given input parameters, state transitions preserve
                    invariance across time complexity bounds O(log n) and O(V + E).
                  </div>
                  <p>
                    Important: Cross-referenced with the official syllabus and recommended textbook problem
                    sets. Key definitions and edge cases are highlighted for fast revision.
                  </p>
                </div>

                <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
                  Preview restricted to sample pages. Download the full file for unrestricted access.
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Syllabus Topics & Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {previewNote.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Mobile-Safe Layout */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-200 gap-2">
          <div className="text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
            <span className="font-semibold text-slate-800">{previewNote.fileName}</span> (
            {previewNote.fileSize})
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
            <button
              onClick={() => {
                closePreviewModal();
                setActiveTab('chat');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200/80 transition-colors"
              title="Discuss this note in Student Messages"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discuss in Messages</span>
              <span className="sm:hidden">Discuss</span>
            </button>

            <button
              onClick={closePreviewModal}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                downloadNote(previewNote);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
