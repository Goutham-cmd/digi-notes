'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  UserCheck,
  UserX,
  Layers,
  Shield,
  Clock,
  RefreshCw,
} from 'lucide-react';

export default function AdminLogs() {
  const { adminAuditLogs, fetchAdminLogs } = useApp();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdminLogs();
  }, []);

  const filteredLogs = adminAuditLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const matchType = log.action_type.toLowerCase().includes(q);
    const matchTarget = (log.target_record || '').toLowerCase().includes(q);
    const matchAdmin = (log.admin_email || '').toLowerCase().includes(q);
    return matchType || matchTarget || matchAdmin;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'NOTE_APPROVED':
        return {
          icon: CheckCircle2,
          text: 'Approved Note',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'NOTE_REJECTED':
        return {
          icon: AlertTriangle,
          text: 'Rejected Note',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'NOTE_DELETED':
        return {
          icon: Trash2,
          text: 'Deleted Note',
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'USER_SUSPENDED':
        return {
          icon: UserX,
          text: 'Suspended User',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'USER_REACTIVATED':
        return {
          icon: UserCheck,
          text: 'Reactivated User',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'ROLE_CHANGED':
        return {
          icon: Shield,
          text: 'Role Changed',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'SUBJECT_CREATED':
      case 'SUBJECT_UPDATED':
      case 'SUBJECT_DELETED':
        return {
          icon: Layers,
          text: action.replace('_', ' '),
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return {
          icon: FileText,
          text: action,
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Administrative Audit Trail</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all note approvals, rejections, student account actions, and curriculum updates.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by action or target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            onClick={() => fetchAdminLogs()}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Target Record</th>
                <th className="py-3.5 px-4">Admin Operator</th>
                <th className="py-3.5 px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No administrative audit entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action_type);
                  const Icon = badge.icon;
                  const dateStr = log.created_at
                    ? new Date(log.created_at).toLocaleString()
                    : 'Just now';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-5 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.text}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {log.target_record || '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {log.admin_email || 'System Admin'}
                      </td>

                      <td className="py-3 px-5 text-slate-500 font-mono text-[10px] max-w-sm truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
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

