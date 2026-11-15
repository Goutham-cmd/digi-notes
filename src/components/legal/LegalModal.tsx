'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, ShieldCheck, FileText, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function LegalModal() {
  const { legalModalState, closeLegalModal } = useApp();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'faq'>('privacy');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (legalModalState.isOpen && legalModalState.defaultTab) {
      setActiveTab(legalModalState.defaultTab);
    }
  }, [legalModalState]);

  if (!legalModalState.isOpen) return null;

  const faqs = [
    {
      q: 'How are study notes verified on NoteNest?',
      a: 'All student submissions undergo an automated syllabus check and moderation review before publishing. Peer-reviewed documents that meet university standards receive the Verified Curriculum badge.',
    },
    {
      q: 'Can I attach YouTube or video lectures to notes?',
      a: 'Yes! NoteNest supports embedded multimedia companions. When contributing or editing notes, simply paste any public YouTube lecture URL into the "Attach Video Lecture" field. Fellow students can stream lectures directly beside your written notes.',
    },
    {
      q: 'What formats can I upload and download?',
      a: 'NoteNest supports PDF study guides, DOCX summary briefs, PPTX presentation lecture slides, and ZIP laboratory code archives up to 25MB per document.',
    },
    {
      q: 'Does NoteNest comply with university academic honor codes?',
      a: 'Yes. NoteNest is designed exclusively for original student summaries, revision guides, practice formula sheets, and peer collaboration. Commercial textbook piracy, live exam solution leakage, or plagiarism violates our Terms of Service and results in immediate account suspension.',
    },
    {
      q: 'Who has access to the Admin Portal?',
      a: 'The Admin Portal is restricted via cryptographic Supabase Row-Level Security (RLS) to university-appointed moderators and faculty leads. Students cannot view or access administrative moderation tools.',
    },
    {
      q: 'How are downloads counted and tracked?',
      a: 'Each time a peer clicks "Get" or downloads a document, NoteNest increments the verified download count in our database, awarding reputation points to the contributing department or student.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] modal-3d-appear">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              {activeTab === 'privacy' && <ShieldCheck className="w-4 h-4" />}
              {activeTab === 'terms' && <FileText className="w-4 h-4" />}
              {activeTab === 'faq' && <HelpCircle className="w-4 h-4" />}
            </div>
            <h2 id="legal-modal-title" className="text-base font-bold text-slate-900">
              NoteNest Academic Trust & Policies
            </h2>
          </div>

          <button
            onClick={closeLegalModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/60 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Student Privacy Commitment</h3>
                <p>
                  NoteNest is built by and for university students. We collect only the minimal data required
                  to manage your academic repository account (email address, university department, and
                  study year). We never monetize or sell student data to third-party advertisers.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Data Storage & Cloud Security</h3>
                <p>
                  User authentication and database records are hosted on Supabase Postgres infrastructure with
                  end-to-end encryption in transit (HTTPS/TLS) and encrypted storage at rest. Publicly shared
                  notes are isolated in secured storage buckets.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Cookies & Session Storage</h3>
                <p>
                  NoteNest uses strictly essential session tokens to verify active logins and localStorage to
                  cache your bookmarks. No third-party behavioral ad trackers are installed.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Account Rights & Deletion</h3>
                <p>
                  You retain ownership of your study guides. You may edit, delete, or request complete removal
                  of your uploaded resources and profile at any time through the Settings view.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. University Academic Integrity</h3>
                <p>
                  NoteNest is an academic collaboration network. All shared materials must represent original
                  student notes, summary outlines, practice questions, or public lecture notes. Uploading live
                  exam papers, confidential professor answer keys, or copyrighted textbooks is strictly forbidden.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Peer Licensing & Attribution</h3>
                <p>
                  By contributing study materials to NoteNest, you grant fellow students permission to view,
                  download, and reference your work for personal academic study. You retain intellectual authorship.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Content Moderation & Audit</h3>
                <p>
                  The platform administrators reserve the right to review, reject, or remove any content that
                  violates campus honor codes or exhibits malicious payloads. All administrative actions are
                  recorded in an immutable audit log.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Limitation of Liability</h3>
                <p>
                  Study guides are provided "as-is" by peer contributors. While community verification is
                  enforced, NoteNest does not guarantee examination scores or curriculum perfection.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full px-4 py-3 text-left font-semibold text-slate-900 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 py-3 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            University Academic Standards Aligned
          </span>
          <button
            onClick={closeLegalModal}
            className="px-4 py-1.5 font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

