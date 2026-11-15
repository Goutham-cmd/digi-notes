'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react';
import { DbSubject } from '@/types';

export default function AdminSubjects() {
  const { subjects, notes, createSubject, updateSubject, deleteSubject } = useApp();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<DbSubject | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingSubject(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: DbSubject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setDescription(sub.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    let success = false;
    if (editingSubject) {
      success = await updateSubject(editingSubject.id, name.trim(), description.trim());
    } else {
      success = await createSubject(name.trim(), description.trim());
    }
    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const activeCount = notes.filter((n) => n.subjectId === id || n.subject === name).length;
    if (activeCount > 0) {
      alert(`Cannot delete "${name}": There are ${activeCount} active notes assigned to this subject. Please delete or reassign those notes first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the subject "${name}"?`)) {
      deleteSubject(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Add Button */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Academic Subjects & Curricula</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage coursework disciplines, track resource distributions, and enforce syllabus alignment.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const count = notes.filter((n) => n.subjectId === sub.id || n.subject === sub.name).length;

          return (
            <div
              key={sub.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Layers className="w-4 h-4" />
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>{count} Notes</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{sub.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sub.description || 'No description provided for this academic discipline.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(sub)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Subject"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(sub.id, sub.name)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    count > 0
                      ? 'text-slate-300 hover:text-slate-400 cursor-not-allowed'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title={count > 0 ? `Cannot delete: ${count} active notes` : 'Delete Subject'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Subject */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSubject ? 'Edit Subject Details' : 'Add New Curriculum Subject'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Discipline Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Description & Topics
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the curriculum scope and focus areas..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

