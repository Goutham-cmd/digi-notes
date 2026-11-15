'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note, NavTab, UserProfile, ToastMessage, DbSubject } from '../types';
import { initialUserProfile } from '../data/mockData';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AppContextType {
  // Auth state & actions
  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean;
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
      status: Note['status'];
    },
    rawFile: File
  ) => Promise<boolean>;
  updateNote: (updatedNote: Note) => Promise<boolean>;
  deleteNote: (noteId: string) => Promise<boolean>;
  downloadNote: (note: Note) => Promise<void>;
  toggleBookmark: (noteId: string) => Promise<void>;

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<DbSubject[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<Set<string>>(new Set());
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

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

  // -------------------------------------------------------------
  // Toast Helper
  // -------------------------------------------------------------
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
  // Supabase Auth Management (Stage 4)
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
        }));
      } else {
        // Fallback to metadata
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
    addToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
  };

  // -------------------------------------------------------------
  // Load Subjects and Notes (Stages 2, 5, 6, 7, 8)
  // -------------------------------------------------------------
  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true });
      if (data && !error) {
        setSubjects(data);
      }
    } catch (e) {
      console.error('Failed to fetch subjects:', e);
    }
  };

  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      // 1. Fetch user bookmarks if authenticated
      let currentBookmarks = new Set<string>();
      const { data: { session: curSession } } = await supabase.auth.getSession();
      const currentUserId = curSession?.user?.id;

      if (currentUserId) {
        const { data: bData } = await supabase
          .from('bookmarks')
          .select('note_id')
          .eq('user_id', currentUserId);
        if (bData) {
          currentBookmarks = new Set(bData.map((b) => b.note_id));
          setUserBookmarks(currentBookmarks);
        }
      }

      // 2. Fetch notes with joins
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error fetching notes:', error);
      } else if (data) {
        const formattedNotes: Note[] = data.map((n: any) => {
          const isCurrentUser = Boolean(currentUserId && n.uploader_id === currentUserId);
          const uploaderProfile = n.profiles;
          const subjectObj = n.subjects;

          // Format relative time
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
            uploadedAt: timeAgo,
            tags: [subjectObj?.name || 'Academic', n.semester, 'Exam Blueprint'],
            isRecommended: n.downloads_count > 5,
            verified: true,
          };
        });

        setNotes(formattedNotes);
      }
    } catch (e) {
      console.error('Failed to load notes from Supabase:', e);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [userProfile.name]);

  useEffect(() => {
    fetchSubjects();
    fetchNotes();
  }, [fetchNotes]);

  // -------------------------------------------------------------
  // Stage 5: Upload, Update, Delete, Download
  // -------------------------------------------------------------
  const addNote = async (
    newNoteData: {
      title: string;
      description: string;
      subjectName: string;
      courseCode: string;
      semester: string;
      fileType: Note['fileType'];
      status: Note['status'];
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

    try {
      // 1. Resolve subject_id
      let targetSubjectId = subjects.find(
        (s) => s.name.toLowerCase() === newNoteData.subjectName.toLowerCase()
      )?.id;

      if (!targetSubjectId && subjects.length > 0) {
        targetSubjectId = subjects[0].id;
      }

      if (!targetSubjectId) {
        // Fallback insert subject if needed
        const { data: newSub } = await supabase
          .from('subjects')
          .insert({ name: newNoteData.subjectName, description: 'Academic Coursework' })
          .select('id')
          .single();
        targetSubjectId = newSub?.id;
      }

      // 2. Upload raw file to Supabase Storage Bucket 'notes'
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

      // 3. Format file size
      const sizeMB = (rawFile.size / (1024 * 1024)).toFixed(1) + ' MB';

      // 4. Insert note metadata into 'notes' table
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
        status: newNoteData.status || 'Published',
      });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Rollback storage file on DB error
        await supabase.storage.from('notes').remove([storageFilePath]);
        addToast({
          title: 'Database Error',
          description: dbError.message || 'Could not save note metadata.',
          type: 'error',
        });
        return false;
      }

      addToast({
        title: 'Note Published Successfully',
        description: `"${newNoteData.title}" is now available in peer search.`,
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
      // Find subject_id if subject name changed
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

      // 1. Delete from storage if file path exists
      if (targetNote?.filePath) {
        await supabase.storage.from('notes').remove([targetNote.filePath]);
      }

      // 2. Delete database row
      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) {
        addToast({
          title: 'Delete Failed',
          description: error.message || 'Could not delete note.',
          type: 'error',
        });
        return false;
      }

      addToast({
        title: 'Note Deleted',
        description: 'Resource has been removed from NoteNest.',
        type: 'warning',
      });

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
    try {
      addToast({
        title: 'Preparing Download',
        description: `Fetching ${note.fileName}...`,
        type: 'info',
      });

      // 1. Get download URL from Supabase Storage
      let downloadUrl: string | null = null;

      if (note.filePath) {
        const { data } = supabase.storage.from('notes').getPublicUrl(note.filePath, {
          download: note.fileName,
        });
        downloadUrl = data.publicUrl;
      }

      // 2. Trigger secure browser download
      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = note.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 3. Atomically increment download count in Supabase via RPC
      await supabase.rpc('increment_downloads', { note_id_input: note.id });

      // 4. Update local state
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

    // Optimistic UI update
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
      // Revert optimistic update on error
      setUserBookmarks((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) next.add(noteId);
        else next.delete(noteId);
        return next;
      });
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, isBookmarked: isCurrentlyBookmarked } : n))
      );
      addToast({
        title: 'Bookmark Failed',
        description: 'Could not sync bookmark with database.',
        type: 'error',
      });
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
        signIn,
        signUp,
        signOut,
        activeTab,
        setActiveTab,
        notes,
        subjects,
        isLoadingNotes,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        downloadNote,
        toggleBookmark,
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
