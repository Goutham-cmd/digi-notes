'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  FileText,
  Layers,
  History,
  Shield,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { AdminTab, Note } from '@/types';
import AdminOverview from './AdminOverview';
import AdminModeration from './AdminModeration';
import AdminUsers from './AdminUsers';
import AdminResources from './AdminResources';
import AdminSubjects from './AdminSubjects';
import AdminLogs from './AdminLogs';
import RejectModal from './RejectModal';

export default function AdminPortal() {
  const { isAdmin, adminTab, setAdminTab, notes, setActiveTab } = useApp();
  const [rejectingNote, setRejectingNote] = useState<Note | null>(null);

  // Security Gate: Students cannot view the admin portal
  if (!isAdmin) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-12 shadow-sm animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Administrative Access Required</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Your account is registered as a student. Administrative permissions are enforced via database Row Level Security and server verification.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>
      </div>
    );
  }

  const pendingCount = notes.filter(
    (n) => n.status.toLowerCase() === 'pending' || n.status.toLowerCase() === 'in review'
  ).length;

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'moderation', label: 'Moderation Queue', icon: Clock, badge: pendingCount },
    { id: 'users', label: 'Student Accounts', icon: Users },
    { id: 'resources', label: 'All Resources', icon: FileText },
    { id: 'subjects', label: 'Curricula & Subjects', icon: Layers },
    { id: 'logs', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Sub-Navigation */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 card-3d-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  NoteNest Campus Administration
                </h2>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  ADMIN ROLE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Moderation queue, curriculum governance, student safety, and resource control
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = adminTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setAdminTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sub-View */}
      <main key={adminTab} className="animate-3d-view">
        {adminTab === 'overview' && (
          <AdminOverview onOpenReject={(n) => setRejectingNote(n)} />
        )}
        {adminTab === 'moderation' && (
          <AdminModeration onOpenReject={(n) => setRejectingNote(n)} />
        )}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'resources' && <AdminResources />}
        {adminTab === 'subjects' && <AdminSubjects />}
        {adminTab === 'logs' && <AdminLogs />}
      </main>

      {/* Reject Modal */}
      <RejectModal note={rejectingNote} onClose={() => setRejectingNote(null)} />
    </div>
  );
}

