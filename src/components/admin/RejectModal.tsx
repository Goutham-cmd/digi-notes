'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Note } from '@/types';
import { X, AlertTriangle, Send } from 'lucide-react';

interface RejectModalProps {
  note: Note | null;
  onClose: () => void;
}

export default function RejectModal({ note, onClose }: RejectModalProps) {
  const { rejectNote } = useApp();
  const [reason, setReason] = useState('Incomplete scan / unreadable pages');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!note) return null;

  const presetReasons = [
    'Incomplete scan / unreadable pages',
    'Low resolution or blurry handwriting',
    'Copyrighted textbook reproduction',
    'Incorrect course code or subject assignment',
    'Duplicate submission',
    'Spam or irrelevant academic material',
    'Other (specified below)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Other (specified below)' ? customReason.trim() : reason;
    if (!finalReason) return;

    setIsSubmitting(true);
    const success = await rejectNote(note.id, finalReason);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col modal-3d-appear">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reject Note Submission</h3>
              <p className="text-xs text-slate-500">Provide moderator feedback to the student</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">Resource being rejected:</p>
            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{note.title}</p>
            <p className="text-[11px] text-slate-500">
              Uploaded by <span className="font-semibold text-slate-700">{note.uploader.name}</span> • {note.subject}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Rejection Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              {presetReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {reason === 'Other (specified below)' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Feedback Message
              </label>
              <textarea
                rows={3}
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain what needs to be corrected before this note can be approved..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

