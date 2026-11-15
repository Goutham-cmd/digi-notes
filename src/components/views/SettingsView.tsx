'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Bell,
  Sliders,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  School,
  Mail,
  GraduationCap,
} from 'lucide-react';

export default function SettingsView() {
  const { userProfile, updateUserProfile } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'preferences' | 'notifications'>('profile');

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [university, setUniversity] = useState(userProfile.university);
  const [department, setDepartment] = useState(userProfile.department);
  const [semester, setSemester] = useState(userProfile.semester);
  const [studentId, setStudentId] = useState(userProfile.studentId);
  const [bio, setBio] = useState(userProfile.bio);

  // Preference states
  const [defaultFileFormat, setDefaultFileFormat] = useState(userProfile.defaultFileFormat);
  const [emailNotifications, setEmailNotifications] = useState(userProfile.emailNotifications);
  const [newNoteAlerts, setNewNoteAlerts] = useState(userProfile.newNoteAlerts);
  const [weeklyDigest, setWeeklyDigest] = useState(userProfile.weeklyDigest);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      university,
      department,
      semester,
      studentId,
      bio,
      defaultFileFormat,
      emailNotifications,
      newNoteAlerts,
      weeklyDigest,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSettingsTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeSettingsTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeSettingsTab === 'preferences'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Account Preferences</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeSettingsTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {activeSettingsTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic & Personal Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                This information appears on your uploaded notes and verified campus badges.
              </p>
            </div>

            {/* Avatar Row */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => alert('Avatar upload modal preview (UI only)')}
                  className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition-colors"
                  title="Change avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{userProfile.name}</h4>
                <p className="text-xs text-slate-500">{userProfile.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    {userProfile.reputationPoints} Contributor Karma
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email (.edu)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Major
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Standing / Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {[
                    'Semester 1',
                    'Semester 2',
                    'Semester 3',
                    'Semester 4',
                    'Semester 5',
                    'Semester 6',
                    'Semester 7',
                    'Semester 8',
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Bio & Study Specialization
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {activeSettingsTab === 'preferences' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize default download behavior and study dashboard display.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Preferred File Format</h4>
                  <p className="text-xs text-slate-500">
                    Auto-filter preview files to preferred document type
                  </p>
                </div>
                <select
                  value={defaultFileFormat}
                  onChange={(e) => setDefaultFileFormat(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                >
                  <option value="PDF">PDF (Recommended)</option>
                  <option value="DOCX">DOCX</option>
                  <option value="ZIP">Archive (ZIP)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Theme Preference</h4>
                  <p className="text-xs text-slate-500">
                    Clean high-contrast Light Theme for reading study documents
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Clean Light (Default)
                </span>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'notifications' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose when you want to receive alerts and email digests.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    New Notes in Enrolled Subjects
                  </h4>
                  <p className="text-xs text-slate-500">
                    Receive email notifications when classmates upload notes for your courses.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={newNoteAlerts}
                  onChange={(e) => setNewNoteAlerts(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Resource Download Alerts</h4>
                  <p className="text-xs text-slate-500">
                    Get notified when other students download or rate your uploaded notes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Weekly Exam Prep Digest</h4>
                  <p className="text-xs text-slate-500">
                    Summary of top-rated study cheat sheets sent every Monday morning.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
