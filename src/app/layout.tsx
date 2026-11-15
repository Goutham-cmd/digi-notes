import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Toast from '@/components/common/Toast';
import UploadModal from '@/components/notes/UploadModal';
import NotePreviewModal from '@/components/notes/NotePreviewModal';
import EditNoteModal from '@/components/notes/EditNoteModal';

export const metadata: Metadata = {
  title: 'NoteNest — Digital Notes & Resource Sharing Platform',
  description: 'A modern, peer-verified college productivity dashboard to share and discover lecture notes, cheat sheets, and exam blueprints.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          {children}
          <UploadModal />
          <NotePreviewModal />
          <EditNoteModal />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
