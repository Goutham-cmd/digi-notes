'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  FileCheck2,
  Clock,
  AlertTriangle,
  Download,
  Bookmark,
  CheckCircle2,
  Eye,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Note } from '@/types';

interface AdminOverviewProps {
  onOpenReject: (note: Note) => void;
}

export default function AdminOverview({ onOpenReject }: AdminOverviewProps) {
  const {
    notes,
    adminUsers,
    setAdminTab,
    approveNote,
    openPreviewModal,
    subjects,
  } = useApp();

  const registeredStudentsCount = adminUsers.length;
  const publishedNotes = notes.filter((n) => n.status === 'published' || n.status === 'Published');
  const pendingNotes = notes.filter((n) => n.status === 'pending' || n.status === 'In Review');
  const rejectedNotes = notes.filter((n) => n.status === 'rejected');
  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloadsCount || 0), 0);
  const totalBookmarksCount = notes.filter((n) => n.isBookmarked).length;

  const recentPending = pendingNotes.slice(0, 4);
  const recentUsers = adminUsers.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-3d-lift">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Students
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">{registeredStudentsCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active Campus Users</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-3d-lift">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Published
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-emerald-600">{publishedNotes.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Live on Explore</p>
          </div>
        </div>

        <div
          onClick={() => setAdminTab('moderation')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 card-3d-lift"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-amber-600">{pendingNotes.length}</p>
            <p className="text-[11px] text-amber-600/90 mt-0.5 flex items-center gap-1 font-medium">
              Requires Review &rarr;
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-3d-lift">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-rose-600">{rejectedNotes.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Quality Screened</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-3d-lift">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Downloads
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">{totalDownloads}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Campus Circulation</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-3d-lift">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Subjects
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">{subjects.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Curriculum Options</p>
          </div>
        </div>
      </div>

      {/* Moderation Queue Alert Card */}
      {pendingNotes.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {pendingNotes.length} Note{pendingNotes.length > 1 ? 's' : ''} Awaiting Administrative Review
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Students have submitted resources that are hidden from the Explore tab until reviewed and approved.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('moderation')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 active:scale-[0.98]"
          >
            <span>Open Moderation Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Pending Submissions & User Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notes Pending Review */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Pending Submissions</h3>
              </div>
              <button
                onClick={() => setAdminTab('moderation')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all ({pendingNotes.length})
              </button>
            </div>

            {recentPending.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-bold text-slate-800">Queue is Clear!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  All submitted student notes have been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPending.map((note) => (
                  <div
                    key={note.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-mono font-bold">{note.fileType}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{note.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="text-indigo-600 font-semibold">{note.subject}</span>
                          <span>•</span>
                          <span>{note.semester}</span>
                          <span>•</span>
                          <span>By {note.uploader.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openPreviewModal(note)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenReject(note)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveNote(note.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Student Registrations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Registrations</h3>
              </div>
              <button
                onClick={() => setAdminTab('users')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Manage
              </button>
            </div>

            {recentUsers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No registered users yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentUsers.map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                        alt={u.full_name || 'Student'}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {u.full_name || 'Anonymous Student'}
                          </p>
                          {u.role === 'admin' && (
                            <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-1 rounded border border-purple-200">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        u.is_suspended
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {u.is_suspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

