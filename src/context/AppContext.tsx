'use client';

import React, { createContext, useContext, useState } from 'react';
import { Note, NavTab, UserProfile, ToastMessage } from '../types';
import { initialNotes, initialUserProfile } from '../data/mockData';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedSemester: string;
  setSelectedSemester: (sem: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  previewNote: Note | null;
  openPreviewModal: (note: Note) => void;
  closePreviewModal: () => void;
  editingNote: Note | null;
  openEditModal: (note: Note) => void;
  closeEditModal: () => void;
  toggleBookmark: (noteId: string) => void;
  addNote: (newNote: Omit<Note, 'id' | 'downloadsCount' | 'rating' | 'reviewsCount' | 'isBookmarked' | 'uploadedAt'>) => void;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (noteId: string) => void;
  downloadNote: (note: Note) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  navigateToSubject: (subjectName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openPreviewModal = (note: Note) => setPreviewNote(note);
  const closePreviewModal = () => setPreviewNote(null);

  const openEditModal = (note: Note) => setEditingNote(note);
  const closeEditModal = () => setEditingNote(null);

  const toggleBookmark = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId) {
          const nextState = !note.isBookmarked;
          addToast({
            title: nextState ? 'Added to Bookmarks' : 'Removed from Bookmarks',
            description: `"${note.title.substring(0, 45)}..."`,
            type: nextState ? 'success' : 'info',
          });
          return { ...note, isBookmarked: nextState };
        }
        return note;
      })
    );
  };

  const addNote = (newNoteData: Omit<Note, 'id' | 'downloadsCount' | 'rating' | 'reviewsCount' | 'isBookmarked' | 'uploadedAt'>) => {
    const newNote: Note = {
      ...newNoteData,
      id: 'note-' + Date.now(),
      downloadsCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      isBookmarked: false,
      uploadedAt: 'Just now',
    };
    setNotes((prev) => [newNote, ...prev]);
    addToast({
      title: 'Note Uploaded Successfully!',
      description: `"${newNote.title}" is now available on NoteNest.`,
      type: 'success',
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    addToast({
      title: 'Note Updated',
      description: `Changes to "${updatedNote.title.substring(0, 40)}" saved.`,
      type: 'success',
    });
    setEditingNote(null);
  };

  const deleteNote = (noteId: string) => {
    const noteToDelete = notes.find((n) => n.id === noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    addToast({
      title: 'Note Deleted',
      description: noteToDelete ? `"${noteToDelete.title.substring(0, 40)}" was removed.` : 'Note removed.',
      type: 'warning',
    });
  };

  const downloadNote = (note: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, downloadsCount: n.downloadsCount + 1 } : n))
    );
    addToast({
      title: 'Download Started',
      description: `Downloading ${note.fileName} (${note.fileSize})`,
      type: 'info',
    });
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
    addToast({
      title: 'Profile Updated',
      description: 'Your settings and preferences have been updated.',
      type: 'success',
    });
  };

  const navigateToSubject = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setActiveTab('explore');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        notes,
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        selectedSemester,
        setSelectedSemester,
        sortBy,
        setSortBy,
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        previewNote,
        openPreviewModal,
        closePreviewModal,
        editingNote,
        openEditModal,
        closeEditModal,
        toggleBookmark,
        addNote,
        updateNote,
        deleteNote,
        downloadNote,
        userProfile,
        updateUserProfile,
        toasts,
        addToast,
        removeToast,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        navigateToSubject,
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
