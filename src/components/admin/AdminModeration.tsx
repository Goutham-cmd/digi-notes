'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Note } from '@/types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  Check,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface AdminModerationProps {
  onOpenReject: (note: Note) => void;
}

export default function AdminModeration({ onOpenReject }: AdminModerationProps) {
  const { notes, approveNote, openPreviewModal, downloadNote } = useApp();
  const [filter, setFilter] = useState<'pending' | 'published' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter((n) => {
    // Status filter
    const s = n.status.toLowerCase();
    if (filter === 'pending' && s !== 'pending' && s !== 'in review') return false;
    if (filter === 'published' && s !== 'published') return false;
    if (filter === 'rejected' && s !== 'rejected') return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchUploader = n.uploader.name.toLowerCase().includes(q);
      const matchSubject = n.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchUploader && !matchSubject) return false;
    }
    return true;
  });

  const pendingCount = notes.filter((n) => n.status.toLowerCase() === 'pending' || n.status.toLowerCase() === 'in review').length;
  const publishedCount = notes.filter((n) => n.status.toLowerCase() === 'published').length;
  const rejectedCount = notes.filter((n) => n.status.toLowerCase() === 'rejected').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tab filter pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('pending')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Review</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'pending' ? 'bg-amber-700 text-amber-100' : 'bg-slate-200 text-slate-700'}`}>
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('published')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'published' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
                {publishedCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('rejected')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rejected</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'rejected' ? 'bg-rose-700 text-rose-100' : 'bg-slate-200 text-slate-700'}`}>
                {rejectedCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              All Notes ({notes.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Moderation Items */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-90" />
          <h3 className="text-sm font-bold text-slate-900">No notes in this category</h3>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'pending'
              ? 'Great job! The moderation queue is empty.'
              : 'No notes match the current search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const isPending = note.status.toLowerCase() === 'pending' || note.status.toLowerCase() === 'in review';
            const isApproved = note.status.toLowerCase() === 'published';
            const isRejected = note.status.toLowerCase() === 'rejected';

            return (
              <div
                key={note.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Note details */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center shrink-0 border border-indigo-100">
                    <span className="text-xs font-mono font-bold">{note.fileType}</span>
                    <span className="text-[9px] text-indigo-400 font-medium">{note.fileSize}</span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {note.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{note.semester}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isPending ? 'Pending Moderation' : isApproved ? 'Published Live' : 'Rejected'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{note.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {note.description || 'No description provided.'}
                    </p>

                    {/* Rejection feedback banner */}
                    {isRejected && note.rejectionReason && (
                      <div className="mt-2 p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Moderator Feedback:</span> {note.rejectionReason}
                        </div>
                      </div>
                    )}

                    {/* Uploader Meta */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>
                        By <span className="font-medium text-slate-700">{note.uploader.name}</span>
                      </span>
                      <span>•</span>
                      <span>{note.uploader.department}</span>
                      <span>•</span>
                      <span>Submitted {note.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => openPreviewModal(note)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => downloadNote(note)}
                    className="p-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    title="Download document for verification"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                  </button>

                  {isPending && (
                    <>
                      <button
                        onClick={() => onOpenReject(note)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => approveNote(note.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors active:scale-[0.98]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </>
                  )}

                  {isRejected && (
                    <button
                      onClick={() => approveNote(note.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Re-Approve</span>
                    </button>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => onOpenReject(note)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium transition-colors"
                    >
                      <span>Unpublish / Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

