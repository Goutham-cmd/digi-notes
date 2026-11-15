'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { subjectOptions, semesterOptions } from '@/data/mockData';
import {
  X,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Trash2,
} from 'lucide-react';
import { FileType } from '@/types';

export default function UploadModal() {
  const { isUploadModalOpen, closeUploadModal, addNote, subjects } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(subjectOptions[1]);
  const [semester, setSemester] = useState('Semester 5');
  const [courseCode, setCourseCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [fileType, setFileType] = useState<FileType>('PDF');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const ext = file.name.split('.').pop()?.toUpperCase();
    let detectedType: FileType = 'PDF';
    if (ext === 'DOC' || ext === 'DOCX') detectedType = 'DOCX';
    else if (ext === 'ZIP' || ext === 'RAR') detectedType = 'ZIP';
    else if (ext === 'PPT' || ext === 'PPTX') detectedType = 'PPTX';

    setFileType(detectedType);
    setSelectedFile({ name: file.name, size: sizeInMB });
    setRawFile(file);
    if (errors.file) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.trim().length < 5) newErrors.title = 'Title should be at least 5 characters';

    if (!description.trim()) newErrors.description = 'Description is required';
    else if (description.trim().length < 15)
      newErrors.description = 'Description must be at least 15 characters';

    if (!courseCode.trim()) newErrors.courseCode = 'Course code is required (e.g. CS204)';
    if (!rawFile) newErrors.file = 'Please upload a note file (PDF, DOCX, ZIP, PPTX)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !rawFile) return;

    setIsSubmitting(true);
    setUploadProgress(30);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 200);

    const success = await addNote(
      {
        title,
        description,
        subjectName: subject,
        courseCode: courseCode.toUpperCase(),
        semester,
        fileType,
        status: 'Published',
      },
      rawFile
    );

    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsSubmitting(false);

    if (success) {
      resetForm();
      closeUploadModal();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseCode('');
    setTagsInput('');
    setSelectedFile(null);
    setRawFile(null);
    setErrors({});
    setUploadProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Study Resource</h2>
              <p className="text-xs text-slate-500">Share your peer-verified notes with classmates</p>
            </div>
          </div>

          <button
            onClick={closeUploadModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Note Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Operating Systems: Virtual Memory & Page Replacement Cheat Sheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.title ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Subject & Semester Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject / Discipline <span className="text-rose-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {subjects.length > 0
                  ? subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))
                  : subjectOptions
                    .filter((s) => s !== 'All Subjects')
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Semester <span className="text-rose-500">*</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {semesterOptions.filter((s) => s !== 'All Semesters').map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Code & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CS301"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className={`w-full px-3 py-2 text-sm uppercase bg-white border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.courseCode ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
              />
              {errors.courseCode && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.courseCode}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topics & Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Paging, Virtual Memory, Midterm, Solved Proofs"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Syllabus Alignment <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Provide a concise description of what topics, proofs, and formulas this study material includes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.description ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attach Resource Document <span className="text-rose-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.zip,.pptx"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50 ${errors.file ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-indigo-300'
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 border border-indigo-100">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Click to select or drag and drop your file
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PDF, DOCX, PPTX or ZIP (Maximum recommended 25MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{selectedFile.size}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.file && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.file}
              </p>
            )}
          </div>

          {/* Progress bar during submit */}
          {isSubmitting && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Verifying and packaging document...</span>
                <span className="font-semibold text-indigo-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </form>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-[11px] text-slate-400">
            Resource will be instantly published to your college directory.
          </p>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={closeUploadModal}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading...' : 'Publish Notes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
