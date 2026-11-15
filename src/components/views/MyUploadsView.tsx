'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import NoteCard from '@/components/notes/NoteCard';
import {
  UploadCloud,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  Download,
  Filter,
  Plus,
} from 'lucide-react';
import { NoteStatus } from '@/types';

export default function MyUploadsView() {
  const {
    notes,
    openUploadModal,
    openEditModal,
    openPreviewModal,
    deleteNote,
    downloadNote,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | NoteStatus>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const myUploads = notes.filter((n) => n.uploader.isCurrentUser);

  const filteredUploads = myUploads.filter((note) => {
    if (statusFilter !== 'All' && note.status !== statusFilter) return false;
    return true;
  });

  const publishedCount = myUploads.filter((n) => n.status === 'Published').length;
  const inReviewCount = myUploads.filter((n) => n.status === 'In Review').length;
  const draftCount = myUploads.filter((n) => n.status === 'Draft').length;
  const totalUploadDownloads = myUploads.reduce((acc, curr) => acc + curr.downloadsCount, 0);

  const getStatusBadge = (status: NoteStatus) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Published
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            In Review
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Uploads Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Uploads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{myUploads.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Published</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">In Review</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inReviewCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Total Downloads</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalUploadDownloads.toLocaleString()}</p>
        </div>
      </div>

      {/* Control Bar: Filter, View Switcher & Upload Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>

          {(['All', 'Published', 'In Review', 'Draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Card View
            </button>
          </div>

          <button
            onClick={openUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>
        </div>
      </div>

      {/* Main Listing */}
      {filteredUploads.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUploads.map((note) => (
              <NoteCard key={note.id} note={note} showActions />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Document / Title</th>
                    <th className="py-3.5 px-4">Subject & Course</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Downloads</th>
                    <th className="py-3.5 px-4 text-center">Rating</th>
                    <th className="py-3.5 px-4">Uploaded</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredUploads.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h4
                              onClick={() => openPreviewModal(note)}
                              className="font-semibold text-slate-900 hover:text-indigo-600 truncate cursor-pointer text-xs"
                            >
                              {note.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {note.fileName} • {note.fileSize}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-slate-800">{note.subject}</p>
                          <p className="text-[11px] text-slate-400">
                            {note.courseCode} • {note.semester}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(note.status)}</td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {note.downloadsCount}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-800">★ {note.rating.toFixed(1)}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {note.uploadedAt}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPreviewModal(note)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Preview note"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(note)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete note "${note.title}"?`)) {
                                deleteNote(note.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No notes found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {statusFilter !== 'All'
              ? `You don't have any notes currently in "${statusFilter}" status.`
              : 'You haven’t uploaded any study materials yet. Share your first guide today!'}
          </p>

          <div className="mt-5">
            <button
              onClick={openUploadModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your First Note</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
