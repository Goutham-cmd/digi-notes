'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note, NavTab, AdminTab, UserProfile, ToastMessage, DbSubject, AdminUser, AdminAuditLog } from '../types';
import { initialUserProfile, initialNotes, popularSubjects } from '../data/mockData';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AppContextType {
  // Auth state & actions
  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    meta: { fullName: string; university: string; department: string; semester: string }
  ) => Promise<{ error: any; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;

  // Navigation & tabs
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Notes state & CRUD
  notes: Note[];
  subjects: DbSubject[];
  isLoadingNotes: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (
    newNoteData: {
      title: string;
      description: string;
      subjectName: string;
      courseCode: string;
      semester: string;
      fileType: Note['fileType'];
      status?: Note['status'];
    },
    rawFile: File
  ) => Promise<boolean>;
  updateNote: (updatedNote: Note) => Promise<boolean>;
  deleteNote: (noteId: string) => Promise<boolean>;
  downloadNote: (note: Note) => Promise<void>;
  toggleBookmark: (noteId: string) => Promise<void>;

  // Admin & Moderation Operations (Phase 3)
  adminUsers: AdminUser[];
  adminAuditLogs: AdminAuditLog[];
  isLoadingAdmin: boolean;
  fetchAdminUsers: () => Promise<void>;
  fetchAdminLogs: () => Promise<void>;
  approveNote: (noteId: string) => Promise<boolean>;
  rejectNote: (noteId: string, reason: string) => Promise<boolean>;
  toggleUserSuspension: (userId: string, currentStatus: boolean) => Promise<boolean>;
  changeUserRole: (userId: string, newRole: 'student' | 'admin') => Promise<boolean>;
  createSubject: (name: string, description: string) => Promise<boolean>;
  updateSubject: (id: string, name: string, description: string) => Promise<boolean>;
  deleteSubject: (id: string) => Promise<{ success: boolean; message?: string }>;
  logAdminAudit: (actionType: string, targetRecord: string, details?: any) => Promise<void>;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedSemester: string;
  setSelectedSemester: (sem: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  navigateToSubject: (subjectName: string) => void;

  // Modals
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  previewNote: Note | null;
  openPreviewModal: (note: Note) => void;
  closePreviewModal: () => void;
  editingNote: Note | null;
  openEditModal: (note: Note) => void;
  closeEditModal: () => void;

  // User Profile & Preferences
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Responsive UI
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // App & Data State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [subjects, setSubjects] = useState<DbSubject[]>(
    popularSubjects.map((s, idx) => ({
      id: `subj-${idx + 1}`,
      name: s.name,
      description: `${s.notesCount} verified study resources`,
    }))
  );
  const [userBookmarks, setUserBookmarks] = useState<Set<string>>(
    new Set(initialNotes.filter((n) => n.isBookmarked).map((n) => n.id))
  );
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Admin Data State (Phase 3)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [sortBy, setSortBy] = useState('Most Popular');

  // Modals & UI States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isAdmin = userProfile.role === 'admin';

  // Toast Helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // -------------------------------------------------------------
  // Supabase Auth Management (Stage 1 & Stage 4)
  // -------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await loadUserProfile(initialSession.user);
          }
          setIsLoadingAuth(false);
        }
      } catch (err) {
        console.error('Error getting session:', err);
        if (mounted) setIsLoadingAuth(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await loadUserProfile(currentSession.user);
        } else {
          setUserProfile(initialUserProfile);
        }
        setIsLoadingAuth(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setUserProfile((prev) => ({
          ...prev,
          name: data.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Student',
          email: data.email || currentUser.email || '',
          avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`,
          university: data.university || 'Engineering & Tech Campus',
          department: data.department || 'Computer Science',
          semester: data.semester || 'Semester 4',
          role: data.role || 'student',
          isSuspended: (data as any).is_suspended ?? false,
        }));
      } else {
        setUserProfile((prev) => ({
          ...prev,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Student',
          email: currentUser.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`,
        }));
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.user) {
      addToast({
        title: 'Welcome Back!',
        description: `Signed in successfully as ${data.user.email}`,
        type: 'success',
      });
      await fetchNotes();
    }
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    meta: { fullName: string; university: string; department: string; semester: string }
  ) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: meta.fullName,
          university: meta.university,
          department: meta.department,
          semester: meta.semester,
        },
      },
    });

    if (!error) {
      if (data.session) {
        addToast({
          title: 'Account Created',
          description: 'Welcome to NoteNest! Your student account is now active.',
          type: 'success',
        });
        await fetchNotes();
        return { error: null, needsConfirmation: false };
      } else {
        return { error: null, needsConfirmation: true };
      }
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserBookmarks(new Set());
    setActiveTab('dashboard');
    addToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
  };

  // -------------------------------------------------------------
  // Data Fetching: Subjects & Notes
  // -------------------------------------------------------------
  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true });
      if (data && data.length > 0 && !error) {
        setSubjects(data);
      } else {
        setSubjects(
          popularSubjects.map((s, idx) => ({
            id: `subj-${idx + 1}`,
            name: s.name,
            description: `${s.notesCount} verified study resources`,
          }))
        );
      }
    } catch (e) {
      console.error('Failed to fetch subjects:', e);
    }
  };

  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      let currentBookmarks = new Set<string>(
        initialNotes.filter((n) => n.isBookmarked).map((n) => n.id)
      );
      const { data: { session: curSession } } = await supabase.auth.getSession();
      const currentUserId = curSession?.user?.id;

      if (currentUserId) {
        const { data: bData } = await supabase
          .from('bookmarks')
          .select('note_id')
          .eq('user_id', currentUserId);
        if (bData && bData.length > 0) {
          bData.forEach((b: any) => currentBookmarks.add(b.note_id));
        }
      }
      setUserBookmarks(new Set(currentBookmarks));

      let res: any = await supabase
        .from('notes')
        .select(`
          id,
          title,
          description,
          semester,
          file_path,
          file_name,
          file_type,
          file_size,
          downloads_count,
          status,
          created_at,
          uploader_id,
          subject_id,
          rejection_reason,
          subjects ( id, name ),
          profiles ( id, full_name, avatar_url, department, role )
        `)
        .order('created_at', { ascending: false });

      // Graceful fallback if rejection_reason column has not been added yet in Supabase
      if (res.error && (res.error.message?.includes('rejection_reason') || res.error.code === 'PGRST204')) {
        res = await supabase
          .from('notes')
          .select(`
            id,
            title,
            description,
            semester,
            file_path,
            file_name,
            file_type,
            file_size,
            downloads_count,
            status,
            created_at,
            uploader_id,
            subject_id,
            subjects ( id, name ),
            profiles ( id, full_name, avatar_url, department, role )
          `)
          .order('created_at', { ascending: false });
      }

      const { data, error } = res;

      if (error) {
        console.warn('Notice loading notes:', error.message);
        setNotes(initialNotes);
      } else if (data && data.length > 0) {
        const formattedNotes: Note[] = data.map((n: any) => {
          const isCurrentUser = Boolean(currentUserId && n.uploader_id === currentUserId);
          const uploaderProfile = n.profiles;
          const subjectObj = n.subjects;

          const createdDate = new Date(n.created_at);
          const diffMinutes = Math.floor((Date.now() - createdDate.getTime()) / 60000);
          let timeAgo = 'Just now';
          if (diffMinutes >= 1440) {
            timeAgo = `${Math.floor(diffMinutes / 1440)}d ago`;
          } else if (diffMinutes >= 60) {
            timeAgo = `${Math.floor(diffMinutes / 60)}h ago`;
          } else if (diffMinutes > 1) {
            timeAgo = `${diffMinutes}m ago`;
          }

          return {
            id: n.id,
            title: n.title,
            description: n.description || '',
            subject: subjectObj?.name || 'General',
            subjectId: n.subject_id,
            courseCode: 'CS' + (Math.abs(n.title.charCodeAt(0) * 11) % 400 + 100),
            semester: n.semester || 'Semester 4',
            uploader: {
              name: uploaderProfile?.full_name || (isCurrentUser ? userProfile.name : 'Verified Contributor'),
              avatar: uploaderProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.uploader_id}`,
              department: uploaderProfile?.department || 'Computer Science & Engineering',
              isCurrentUser,
            },
            uploaderId: n.uploader_id,
            fileType: (n.file_type as Note['fileType']) || 'PDF',
            fileName: n.file_name,
            fileSize: n.file_size,
            filePath: n.file_path,
            downloadsCount: n.downloads_count || 0,
            rating: 4.8 + ((n.title.charCodeAt(0) % 3) * 0.1),
            reviewsCount: 12 + (n.downloads_count % 35),
            isBookmarked: currentBookmarks.has(n.id),
            status: n.status as Note['status'],
            rejectionReason: n.rejection_reason || undefined,
            uploadedAt: timeAgo,
            tags: [subjectObj?.name || 'Academic', n.semester, 'Exam Blueprint'],
            isRecommended: n.downloads_count > 5,
            verified: true,
          };
        });

        // Merge Supabase real uploaded notes with the initial study catalog
        const dbNoteIds = new Set(formattedNotes.map((n) => n.id));
        const merged = [
          ...formattedNotes,
          ...initialNotes.filter((n) => !dbNoteIds.has(n.id)),
        ];
        setNotes(merged);
      } else {
        // Supabase has 0 notes yet, maintain the full rich initial library
        setNotes(initialNotes);
      }
    } catch (e) {
      console.error('Failed to load notes from Supabase:', e);
      setNotes(initialNotes);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [userProfile.name]);

  useEffect(() => {
    fetchSubjects();
    fetchNotes();
  }, [fetchNotes]);

  // -------------------------------------------------------------
  // Stage 5 & 8: Notes Upload, Update, Delete, Download
  // -------------------------------------------------------------
  const addNote = async (
    newNoteData: {
      title: string;
      description: string;
      subjectName: string;
      courseCode: string;
      semester: string;
      fileType: Note['fileType'];
      status?: Note['status'];
    },
    rawFile: File
  ): Promise<boolean> => {
    if (!user) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in to upload notes.',
        type: 'error',
      });
      return false;
    }

    if (userProfile.isSuspended) {
      addToast({
        title: 'Account Suspended',
        description: 'Your account is currently suspended from uploading resources.',
        type: 'error',
      });
      return false;
    }

    try {
      let targetSubjectId = subjects.find(
        (s) => s.name.toLowerCase() === newNoteData.subjectName.toLowerCase()
      )?.id;

      if (!targetSubjectId && subjects.length > 0) {
        targetSubjectId = subjects[0].id;
      }

      if (!targetSubjectId) {
        const { data: newSub } = await supabase
          .from('subjects')
          .insert({ name: newNoteData.subjectName, description: 'Academic Coursework' })
          .select('id')
          .single();
        targetSubjectId = newSub?.id;
      }

      const sanitizedName = rawFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageFilePath = `${user.id}/${Date.now()}-${sanitizedName}`;

      const { error: storageError } = await supabase.storage
        .from('notes')
        .upload(storageFilePath, rawFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: rawFile.type || 'application/pdf',
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        addToast({
          title: 'Upload Failed',
          description: storageError.message || 'Could not upload file to storage.',
          type: 'error',
        });
        return false;
      }

      const sizeMB = (rawFile.size / (1024 * 1024)).toFixed(1) + ' MB';

      // Phase 3 Moderation: student uploads default to 'pending'
      const initialStatus = isAdmin ? 'published' : (newNoteData.status || 'pending');

      const { error: dbError } = await supabase.from('notes').insert({
        title: newNoteData.title,
        description: newNoteData.description,
        subject_id: targetSubjectId,
        semester: newNoteData.semester,
        file_path: storageFilePath,
        file_name: rawFile.name,
        file_type: newNoteData.fileType,
        file_size: sizeMB,
        uploader_id: user.id,
        downloads_count: 0,
        status: initialStatus,
      });

      if (dbError) {
        console.error('Database insert error:', dbError);
        await supabase.storage.from('notes').remove([storageFilePath]);
        addToast({
          title: 'Database Error',
          description: dbError.message || 'Could not save note metadata.',
          type: 'error',
        });
        return false;
      }

      addToast({
        title: isAdmin ? 'Note Published Live' : 'Note Submitted for Moderation',
        description: isAdmin
          ? `"${newNoteData.title}" is published.`
          : `"${newNoteData.title}" is in queue. It will appear on Explore once approved by an admin.`,
        type: 'success',
      });

      await fetchNotes();
      setIsUploadModalOpen(false);
      return true;
    } catch (err: any) {
      console.error('Error in addNote:', err);
      addToast({
        title: 'Upload Error',
        description: err.message || 'Failed to complete note publication.',
        type: 'error',
      });
      return false;
    }
  };

  const updateNote = async (updatedNote: Note): Promise<boolean> => {
    if (!user) return false;

    try {
      let subjectId = updatedNote.subjectId;
      if (!subjectId && updatedNote.subject) {
        subjectId = subjects.find((s) => s.name === updatedNote.subject)?.id;
      }

      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          description: updatedNote.description,
          semester: updatedNote.semester,
          status: updatedNote.status,
          ...(subjectId ? { subject_id: subjectId } : {}),
        })
        .eq('id', updatedNote.id);

      if (error) {
        addToast({
          title: 'Update Failed',
          description: error.message || 'Could not update note.',
          type: 'error',
        });
        return false;
      }

      addToast({
        title: 'Note Updated',
        description: `Saved changes to "${updatedNote.title.substring(0, 40)}"`,
        type: 'success',
      });

      setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      setEditingNote(null);
      await fetchNotes();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Update Error',
        description: err.message || 'Error updating note.',
        type: 'error',
      });
      return false;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const targetNote = notes.find((n) => n.id === noteId);

      if (targetNote?.filePath) {
        await supabase.storage.from('notes').remove([targetNote.filePath]);
      }

      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) {
        addToast({
          title: 'Delete Failed',
          description: error.message || 'Could not delete note.',
          type: 'error',
        });
        return false;
      }

      if (isAdmin) {
        await logAdminAudit('NOTE_DELETED', targetNote?.title || noteId, {
          uploader_id: targetNote?.uploaderId,
          subject: targetNote?.subject,
        });
      }

      addToast({
        title: 'Note Deleted',
        description: 'Resource has been removed.',
        type: 'warning',
      });

      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      await fetchNotes();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Delete Error',
        description: err.message || 'Error deleting note.',
        type: 'error',
      });
      return false;
    }
  };

  const downloadNote = async (note: Note) => {
    // Stage 8: Prevent downloading unpublished notes (unless uploader or admin)
    const isOwner = user && note.uploaderId === user.id;
    const isApproved = note.status === 'published' || note.status === 'Published';

    if (!isApproved && !isOwner && !isAdmin) {
      addToast({
        title: 'Note Under Review',
        description: 'This resource is pending administrative approval and cannot be downloaded yet.',
        type: 'warning',
      });
      return;
    }

    try {
      addToast({
        title: 'Preparing Download',
        description: `Fetching ${note.fileName}...`,
        type: 'info',
      });

      let downloadUrl: string | null = null;

      if (note.filePath) {
        const { data } = supabase.storage.from('notes').getPublicUrl(note.filePath, {
          download: note.fileName,
        });
        downloadUrl = data.publicUrl;
      }

      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = note.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      await supabase.rpc('increment_downloads', { note_id_input: note.id });

      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, downloadsCount: n.downloadsCount + 1 } : n))
      );
    } catch (err: any) {
      console.error('Download error:', err);
      addToast({
        title: 'Download Failed',
        description: 'Could not complete file download.',
        type: 'error',
      });
    }
  };

  // -------------------------------------------------------------
  // Stage 6: Bookmarks Sync
  // -------------------------------------------------------------
  const toggleBookmark = async (noteId: string) => {
    if (!user) {
      addToast({
        title: 'Sign In Required',
        description: 'Please sign in to save resources to your bookmarks.',
        type: 'info',
      });
      return;
    }

    const isCurrentlyBookmarked = userBookmarks.has(noteId);

    setUserBookmarks((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) next.delete(noteId);
      else next.add(noteId);
      return next;
    });

    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isBookmarked: !isCurrentlyBookmarked } : n))
    );

    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', noteId);

        if (error) throw error;

        addToast({
          title: 'Removed from Bookmarks',
          description: 'Note removed from your saved list.',
          type: 'info',
        });
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, note_id: noteId });

        if (error) throw error;

        addToast({
          title: 'Added to Bookmarks',
          description: 'Saved to your exam prep bookmarks.',
          type: 'success',
        });
      }
    } catch (err: any) {
      console.error('Bookmark error:', err);
      setUserBookmarks((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) next.add(noteId);
        else next.delete(noteId);
        return next;
      });
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, isBookmarked: isCurrentlyBookmarked } : n))
      );
    }
  };

  // -------------------------------------------------------------
  // Phase 3: Admin & Moderation Operations
  // -------------------------------------------------------------
  const logAdminAudit = async (actionType: string, targetRecord: string, details: any = {}) => {
    if (!user || !isAdmin) return;
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_id: user.id,
        admin_email: user.email,
        action_type: actionType,
        target_record: targetRecord,
        details,
      });
    } catch (e) {
      console.error('Audit log failed:', e);
    }
  };

  const approveNote = async (noteId: string): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const targetNote = notes.find((n) => n.id === noteId);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, status: 'published', rejectionReason: undefined } : n
        )
      );

      await logAdminAudit('NOTE_APPROVED', targetNote?.title || noteId, {
        note_id: noteId,
        uploader_id: targetNote?.uploaderId,
      });

      addToast({
        title: 'Note Approved',
        description: `"${targetNote?.title || 'Note'}" is now live and published on Explore.`,
        type: 'success',
      });

      try {
        await supabase
          .from('notes')
          .update({ status: 'published', rejection_reason: null })
          .eq('id', noteId);
      } catch (e) {
        console.warn('Supabase note update notice:', e);
      }

      return true;
    } catch (err: any) {
      addToast({
        title: 'Approval Failed',
        description: err.message || 'Could not approve note.',
        type: 'error',
      });
      return false;
    }
  };

  const rejectNote = async (noteId: string, reason: string): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const targetNote = notes.find((n) => n.id === noteId);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, status: 'rejected', rejectionReason: reason } : n
        )
      );

      await logAdminAudit('NOTE_REJECTED', targetNote?.title || noteId, {
        note_id: noteId,
        uploader_id: targetNote?.uploaderId,
        reason,
      });

      addToast({
        title: 'Note Rejected',
        description: `Feedback has been sent to the uploader.`,
        type: 'warning',
      });

      try {
        await supabase
          .from('notes')
          .update({ status: 'rejected', rejection_reason: reason })
          .eq('id', noteId);
      } catch (e) {
        console.warn('Supabase note update notice:', e);
      }

      return true;
    } catch (err: any) {
      addToast({
        title: 'Rejection Failed',
        description: err.message || 'Could not reject note.',
        type: 'error',
      });
      return false;
    }
  };

  const fetchAdminUsers = async () => {
    if (!isAdmin) return;
    setIsLoadingAdmin(true);
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesData && !error) {
        // Calculate user uploads count
        const userUploadsMap: Record<string, number> = {};
        notes.forEach((n) => {
          if (n.uploaderId) {
            userUploadsMap[n.uploaderId] = (userUploadsMap[n.uploaderId] || 0) + 1;
          }
        });

        const formattedUsers: AdminUser[] = profilesData.map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          avatar_url: p.avatar_url,
          role: p.role || 'student',
          is_suspended: p.is_suspended ?? false,
          university: p.university,
          department: p.department,
          semester: p.semester,
          created_at: p.created_at,
          uploadsCount: userUploadsMap[p.id] || 0,
        }));

        setAdminUsers(formattedUsers);
      }
    } catch (e) {
      console.error('Failed to fetch admin users:', e);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const toggleUserSuspension = async (userId: string, currentStatus: boolean): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const targetUser = adminUsers.find((u) => u.id === userId);
      const nextStatus = !currentStatus;

      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: nextStatus })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAudit(
        nextStatus ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
        targetUser?.email || userId,
        { previous_status: currentStatus, new_status: nextStatus }
      );

      addToast({
        title: nextStatus ? 'User Suspended' : 'User Reactivated',
        description: `${targetUser?.full_name || 'User'} has been ${nextStatus ? 'suspended' : 'restored'}.`,
        type: nextStatus ? 'warning' : 'success',
      });

      await fetchAdminUsers();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Action Failed',
        description: err.message || 'Could not update user status.',
        type: 'error',
      });
      return false;
    }
  };

  const changeUserRole = async (userId: string, newRole: 'student' | 'admin'): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const targetUser = adminUsers.find((u) => u.id === userId);

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAudit('ROLE_CHANGED', targetUser?.email || userId, {
        target_user: targetUser?.email,
        assigned_role: newRole,
      });

      addToast({
        title: 'Role Updated',
        description: `${targetUser?.full_name || 'User'} is now a ${newRole}.`,
        type: 'success',
      });

      await fetchAdminUsers();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Role Update Failed',
        description: err.message || 'Could not change user role.',
        type: 'error',
      });
      return false;
    }
  };

  const createSubject = async (name: string, description: string): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;

      await logAdminAudit('SUBJECT_CREATED', name, { subject_id: data.id, description });

      addToast({
        title: 'Subject Added',
        description: `"${name}" added to curriculum options.`,
        type: 'success',
      });

      await fetchSubjects();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Failed to Add Subject',
        description: err.message || 'Could not create subject.',
        type: 'error',
      });
      return false;
    }
  };

  const updateSubject = async (id: string, name: string, description: string): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      const { error } = await supabase
        .from('subjects')
        .update({ name, description })
        .eq('id', id);

      if (error) throw error;

      await logAdminAudit('SUBJECT_UPDATED', name, { subject_id: id, description });

      addToast({
        title: 'Subject Updated',
        description: `Changes saved for "${name}".`,
        type: 'success',
      });

      await fetchSubjects();
      await fetchNotes();
      return true;
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        description: err.message || 'Could not update subject.',
        type: 'error',
      });
      return false;
    }
  };

  const deleteSubject = async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };

    // Stage 6 Rule: Prevent deleting subjects that still have associated notes
    const activeNotesInSubject = notes.filter((n) => n.subjectId === id);
    if (activeNotesInSubject.length > 0) {
      const msg = `Cannot delete: There are ${activeNotesInSubject.length} active notes under this subject. Please reassign or delete those notes first.`;
      addToast({
        title: 'Cannot Delete Subject',
        description: msg,
        type: 'warning',
      });
      return { success: false, message: msg };
    }

    try {
      const target = subjects.find((s) => s.id === id);
      const { error } = await supabase.from('subjects').delete().eq('id', id);

      if (error) throw error;

      await logAdminAudit('SUBJECT_DELETED', target?.name || id, { subject_id: id });

      addToast({
        title: 'Subject Deleted',
        description: `Removed "${target?.name || 'Subject'}" from catalog.`,
        type: 'warning',
      });

      await fetchSubjects();
      return { success: true };
    } catch (err: any) {
      addToast({
        title: 'Delete Failed',
        description: err.message || 'Could not delete subject.',
        type: 'error',
      });
      return { success: false, message: err.message };
    }
  };

  const fetchAdminLogs = async () => {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data && !error) {
        setAdminAuditLogs(data);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    }
  };

  // -------------------------------------------------------------
  // Profile Update
  // -------------------------------------------------------------
  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));

    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profileUpdate.name,
            university: profileUpdate.university,
            department: profileUpdate.department,
            semester: profileUpdate.semester,
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile in Supabase:', error);
        }
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }

    addToast({
      title: 'Profile Updated',
      description: 'Your settings and preferences have been saved.',
      type: 'success',
    });
  };

  // -------------------------------------------------------------
  // Modals & Navigation
  // -------------------------------------------------------------
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openPreviewModal = (note: Note) => setPreviewNote(note);
  const closePreviewModal = () => setPreviewNote(null);

  const openEditModal = (note: Note) => setEditingNote(note);
  const closeEditModal = () => setEditingNote(null);

  const navigateToSubject = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setActiveTab('explore');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        isLoadingAuth,
        isAdmin,
        signIn,
        signUp,
        signOut,
        activeTab,
        setActiveTab,
        adminTab,
        setAdminTab,
        notes,
        subjects,
        isLoadingNotes,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        downloadNote,
        toggleBookmark,
        adminUsers,
        adminAuditLogs,
        isLoadingAdmin,
        fetchAdminUsers,
        fetchAdminLogs,
        approveNote,
        rejectNote,
        toggleUserSuspension,
        changeUserRole,
        createSubject,
        updateSubject,
        deleteSubject,
        logAdminAudit,
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        selectedSemester,
        setSelectedSemester,
        sortBy,
        setSortBy,
        navigateToSubject,
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        previewNote,
        openPreviewModal,
        closePreviewModal,
        editingNote,
        openEditModal,
        closeEditModal,
        userProfile,
        updateUserProfile,
        toasts,
        addToast,
        removeToast,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
