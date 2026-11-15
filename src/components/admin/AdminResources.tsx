'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Archive,
  Presentation,
  FileCode,
} from 'lucide-react';
import { semesterOptions } from '@/data/mockData';

export default function AdminResources() {
  const { notes, subjects, openEditModal, openPreviewModal, deleteNote, downloadNote, fetchNotes } = useApp();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredNotes = notes.filter((n) => {
    // Subject filter
    if (subjectFilter !== 'All' && n.subject !== subjectFilter) return false;

    // Semester filter
    if (semesterFilter !== 'All' && n.semester !== semesterFilter) return false;

    // Status filter
    if (statusFilter !== 'All') {
      const s = n.status.toLowerCase();
      if (statusFilter === 'published' && s !== 'published') return false;
      if (statusFilter === 'pending' && s !== 'pending' && s !== 'in review') return false;
      if (statusFilter === 'rejected' && s !== 'rejected') return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchDesc = n.description.toLowerCase().includes(q);
      const matchUploader = n.uploader.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchUploader) return false;
    }

    return true;
  });

  const handleDeleteConfirm = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      deleteNote(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Control and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search all resources by title, description, or uploader..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="All">All Semesters</option>
              {semesterOptions
                .filter((s) => s !== 'All Semesters')
                .map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
            </select>

            <button
              onClick={() => fetchNotes()}
              className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh notes list"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-5">Resource Details</th>
                <th className="py-3.5 px-4">Subject & Semester</th>
                <th className="py-3.5 px-4">Uploader</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Uploaded</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No resources found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => {
                  const s = note.status.toLowerCase();
                  const isPending = s === 'pending' || s === 'in review';
                  const isApproved = s === 'published';
                  const isRejected = s === 'rejected';

                  return (
                    <tr key={note.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Title & File info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-indigo-100">
                            {note.fileType}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate max-w-xs">
                              {note.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                              {note.fileName} ({note.fileSize})
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Semester */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{note.subject}</p>
                        <p className="text-[11px] text-slate-400">{note.semester}</p>
                      </td>

                      {/* Uploader */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{note.uploader.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{note.uploader.department}</p>
                      </td>

                      {/* Downloads */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {note.downloadsCount}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isApproved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPending ? 'bg-amber-500' : isApproved ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {isPending ? 'Pending' : isApproved ? 'Published' : 'Rejected'}
                        </span>
                      </td>

                      {/* Upload Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{note.uploadedAt}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPreviewModal(note)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Preview note"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => downloadNote(note)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(note)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit metadata"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteConfirm(note.id, note.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete note permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

