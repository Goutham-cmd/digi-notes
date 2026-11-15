'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Filter,
  RefreshCw,
  Mail,
  School,
  Calendar,
  UploadCloud,
} from 'lucide-react';
import { AdminUser } from '@/types';

export default function AdminUsers() {
  const { adminUsers, fetchAdminUsers, toggleUserSuspension, changeUserRole, isLoadingAdmin, user: currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const filteredUsers = adminUsers.filter((u) => {
    // Role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    // Status filter
    if (statusFilter === 'active' && u.is_suspended) return false;
    if (statusFilter === 'suspended' && !u.is_suspended) return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = (u.full_name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Control & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students by name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Administrators</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>

            <button
              onClick={() => fetchAdminUsers()}
              className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh User List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-5">Student / User</th>
                <th className="py-3.5 px-4">Academic Faculty</th>
                <th className="py-3.5 px-4">Uploads</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  const dateStr = u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                            alt={u.full_name || 'User'}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">
                              {u.full_name || 'Anonymous Student'} {isCurrent && '(You)'}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department & Uni */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{u.department || 'General'}</p>
                        <p className="text-[11px] text-slate-400">{u.semester || 'N/A'} • {u.university || 'Campus'}</p>
                      </td>

                      {/* Uploads Count */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.uploadsCount ?? 0}</span>
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            u.is_suspended
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.is_suspended ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          {u.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{dateStr}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        {!isCurrent ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Suspension */}
                            <button
                              onClick={() => toggleUserSuspension(u.id, u.is_suspended)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                u.is_suspended
                                  ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                  : 'text-rose-600 border-rose-200 hover:bg-rose-50'
                              }`}
                              title={u.is_suspended ? 'Reactivate Account' : 'Suspend Account'}
                            >
                              {u.is_suspended ? (
                                <UserCheck className="w-4 h-4" />
                              ) : (
                                <UserX className="w-4 h-4" />
                              )}
                            </button>

                            {/* Change Role */}
                            <button
                              onClick={() =>
                                changeUserRole(u.id, u.role === 'admin' ? 'student' : 'admin')
                              }
                              className="px-2 py-1 border border-slate-200 hover:bg-slate-100 rounded-lg text-[11px] font-medium text-slate-700 transition-colors"
                              title={u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                            >
                              {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Self</span>
                        )}
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

