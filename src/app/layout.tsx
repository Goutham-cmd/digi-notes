import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Toast from '@/components/common/Toast';
import UploadModal from '@/components/notes/UploadModal';
import NotePreviewModal from '@/components/notes/NotePreviewModal';
import EditNoteModal from '@/components/notes/EditNoteModal';
import LegalModal from '@/components/legal/LegalModal';
import CookieConsent from '@/components/common/CookieConsent';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://digi-notes-deribwuxp-code-breach.vercel.app'),
  title: {
    default: 'NoteNest — Academic Notes & Resource Sharing Platform',
    template: '%s | NoteNest',
  },
  description:
    'A modern, peer-verified college productivity platform to share and discover syllabus-aligned lecture notes, cheat sheets, exam blueprints, and video lectures.',
  keywords: [
    'NoteNest',
    'lecture notes',
    'exam blueprints',
    'cheat sheets',
    'college study materials',
    'peer reviewed notes',
    'university resources',
    'computer science notes',
  ],
  authors: [{ name: 'NoteNest Academic Network' }],
  creator: 'NoteNest',
  publisher: 'NoteNest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NoteNest — Academic Notes & Resource Sharing Platform',
    description:
      'Access peer-verified course guides, formula sheets, and video lectures with real-time syllabus alignment.',
    url: 'https://digi-notes-deribwuxp-code-breach.vercel.app',
    siteName: 'NoteNest',
    images: [
      {
        url: '/favicon.svg',
        width: 512,
        height: 512,
        alt: 'NoteNest Academic Platform Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'NoteNest — Academic Notes & Resource Sharing Platform',
    description:
      'Access verified lecture notes, formula sheets, and study companion materials.',
    images: ['/favicon.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
          <LegalModal />
          <CookieConsent />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
